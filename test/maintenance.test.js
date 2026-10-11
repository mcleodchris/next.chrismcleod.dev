import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {load} from 'cheerio';
import {generateFrontmatter} from '../helpers/shared-utils.js';
import {frontmatter, imageCalls} from '../helpers/site-sources.js';
import {getGraph, notesForFeed, tagList} from '../config/collections/index.js';
import {bookmarkUrl, likeUrl} from '../config/utils/content.js';
import {syncHobby} from '../helpers/sync-hobby.js';
import {syncImages, projectMageImages} from '../helpers/sync-images.js';
import {
  buildImageIndex,
  setImageIndex,
  validateManifest,
  normaliseUrl,
  sortManifest
} from '../config/images/manifest.js';
import {renderPicture, renderFigure} from '../config/images/picture.js';
import {enrichImages} from '../config/images/enrich.js';
import {markdownLib} from '../config/plugins/markdown.js';
import {createJsonFeed} from '../config/feeds.js';
import {resolveSocialImage} from '../config/images/social.js';
import {redirectMappings} from '../src/redirects.11ty.js';
import {assertRedirectRoutes} from '../config/redirects.js';
import {groupHobbyByYear} from '../config/data/hobby.js';
import {compileAssets, assetUrl} from '../config/assets/index.js';
import meta from '../src/_data/meta.js';
import {publicTags, formatDate, dateToRfc822} from '../config/filters/index.js';
const src = 'https://assets.chrismcleod.dev/test.png';
const manifest = {
  version: 1,
  images: {
    [src]: {
      width: 600,
      height: 400,
      dimensionSource: 'variant',
      source: 'mage',
      variants: [
        {
          format: 'webp',
          url: 'https://assets.chrismcleod.dev/test-300.webp',
          width: 300,
          height: 200
        },
        {
          format: 'avif',
          url: 'https://assets.chrismcleod.dev/test-600.avif',
          width: 600,
          height: 400
        }
      ]
    }
  }
};
test('front matter round-trips YAML-sensitive strings, nested objects, keys and dates', () => {
  const fields = {
    title: 'A: "quote" # tag\\path\nCafé ☕',
    tags: ['a: b', 'c # d'],
    refs: {value: 'quoted: #é\nnew'}
  };
  assert.deepEqual(
    frontmatter(generateFrontmatter('id', '2026-01-01T12:34:56.000Z', fields)).data,
    {id: 'id', date: '2026-01-01T12:34:56.000Z', ...fields}
  );
});
test('graph includes old notes beyond feed limit and topics include note/bookmark-only tags', () => {
  const notes = Array.from({length: 60}, (_, i) => ({
    date: new Date(2020, 0, i + 1),
    data: {tags: ['notes', 'Only Notes']}
  }));
  const c = {
    getFilteredByGlob: glob => (glob.includes('/notes/') ? [...notes] : []),
    getFilteredByTag: () => notes
  };
  assert.equal(notesForFeed(c).length, 50);
  assert.equal(getGraph(c).length, 60);
  assert.deepEqual(tagList(c), ['Only Notes']);
});
test('canonical Micropub keys take precedence over historical aliases', () => {
  assert.equal(bookmarkUrl({bookmarkOf: 'a', bookmark_of: 'b'}), 'a');
  assert.equal(bookmarkUrl({bookmark_of: 'b'}), 'b');
  assert.equal(likeUrl({'like-of': 'c'}), 'c');
  assert.equal(likeUrl({'likeOf': 'a', 'like_of': 'b', 'like-of': 'c'}), 'a');
});
test('public topic links exclude system collections and date-based URLs are stable on UTC runners', () => {
  assert.deepEqual(publicTags(['posts', 'timeline', 'Only Notes', 'notes']), [
    'Only Notes'
  ]);
  const oldTimezone = process.env.TZ;
  try {
    process.env.TZ = 'UTC';
    assert.equal(formatDate('2024-08-18T18:44:01.774Z', 'YYYYMMDDHHmm'), '202408181944');
    for (const zone of ['UTC', 'Europe/London']) {
      process.env.TZ = zone;
      assert.equal(dateToRfc822('2026-10-04T14:21:52Z'), 'Sun, 04 Oct 2026 14:21:52 GMT');
    }
  } finally {
    if (oldTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = oldTimezone;
  }
});
test('exact metadata selects existing formats and widths; arbitrary attributes and alt escape once', () => {
  setImageIndex(buildImageIndex(validateManifest(manifest)));
  const html = renderPicture({
    src,
    alt: '" & <é>',
    sizes: '100vw" onload="bad',
    className: 'a" b'
  });
  assert.ok(html.includes('test-300.webp'));
  assert.ok(html.includes('image/avif'));
  assert.ok(!html.includes('image/jpeg'));
  assert.ok(!html.includes('570w'));
  assert.equal(load(html)('img').attr('alt'), '" & <é>');
  assert.ok(html.includes('100vw&quot; onload=&quot;bad'));
  assert.ok(!html.includes('onload="bad'));
});
test('measured small and collision originals render with dimensions and no guessed derivatives', () => {
  const data = {
    version: 1,
    images: {
      [src]: {
        width: 482,
        height: 200,
        dimensionSource: 'original',
        source: 'probe',
        variants: [],
        fallbackReason: 'ambiguous-derivative'
      }
    }
  };
  setImageIndex(buildImageIndex(validateManifest(data)));
  const html = renderPicture({src, alt: '', loading: 'eager'});
  assert.ok(html.includes('width="482"'));
  assert.ok(html.includes('height="200"'));
  assert.ok(!html.includes('srcset'));
  assert.ok(html.includes('alt=""'));
  assert.ok(html.includes('loading="eager"'));
});
test('duplicate variant ownership fails even if aspect ratios match; meaningful URL queries survive', () => {
  const other = structuredClone(manifest.images[src]);
  assert.throws(
    () =>
      validateManifest({
        version: 1,
        images: {
          [src]: manifest.images[src],
          'https://assets.chrismcleod.dev/other.png': other
        }
      }),
    /Ambiguous/
  );
  assert.equal(
    normaliseUrl('https://ASSETS.chrismcleod.dev/A.png?size=1#hash'),
    'https://assets.chrismcleod.dev/A.png?size=1'
  );
});
test('Markdown standalone titles become escaped visible captions, inline titles remain inline', () => {
  const html = markdownLib.render(`![A & B](${src} "C & <D>")`);
  assert.match(html, /^<figure>/);
  assert.equal((html.match(/figcaption class/g) || []).length, 1);
  assert.ok(html.includes('C &amp; &lt;D&gt;'));
  assert.ok(!html.includes('title='));
  const inline = markdownLib.render(`Before ![A](${src} "Caption") after`);
  assert.ok(inline.includes('<p>'));
  assert.ok(inline.includes('title="Caption"'));
  assert.ok(!inline.includes('figure'));
});
test('tight-list image titles remain inline while loose-list and blockquote figures are valid', () => {
  for (const prefix of ['- ', '1. ']) {
    const html = markdownLib.render(`${prefix}![A](${src} "Caption")`);
    const $ = load(html);
    assert.equal($('li img').attr('title'), 'Caption');
    assert.equal($('figcaption, figure').length, 0);
  }
  for (const markdown of [
    `- ![A](${src} "Caption")\n\n- Text`,
    `> ![A](${src} "Caption")`
  ]) {
    const $ = load(markdownLib.render(markdown));
    assert.equal($('figure > figcaption').length, 1);
    assert.equal($('figure img').attr('title'), undefined);
  }
});
test('enrichment is idempotent and preserves external HTML, code, SVG, image attributes', () => {
  setImageIndex(buildImageIndex(manifest));
  const html = `<div><img src="${src}" alt="A &amp; B" class="u-photo" loading="eager"><svg><image href="x"></image></svg><pre><code>&lt;img src="x"&gt;</code></pre><img src="https://external.example/x.jpg" title="Raw title"></div>`;
  const once = enrichImages(html);
  assert.equal(enrichImages(once), once);
  assert.ok(once.includes('class="u-photo"'));
  assert.ok(once.includes('loading="eager"'));
  assert.ok(once.includes('<svg>'));
  assert.ok(once.includes('&lt;img'));
  assert.ok(once.includes('Raw title'));
  assert.equal((once.match(/<picture>/g) || []).length, 1);
});
test('JSON Feed round-trips exact strings and applies the same caption enrichment as pages', () => {
  setImageIndex(buildImageIndex(manifest));
  const title = '"Quote": # café\\\nline';
  const content = markdownLib.render(`![A](${src} "Caption")`);
  const post = {
    url: '/blog/test/',
    data: {title, excerpt: title, layout: 'post', tags: ['posts', 'Café']},
    date: new Date('2026-01-01'),
    templateContent: content
  };
  const result = JSON.parse(
    JSON.stringify(
      createJsonFeed(
        {name: 'Blog Posts', permalink: '/follow/blog/feed.json', limit: 24},
        [post],
        meta
      )
    )
  );
  assert.equal(result.items[0].title, title);
  assert.equal(result.items[0].summary, title);
  assert.equal(result.items[0].content_html, enrichImages(content));
  assert.ok(result.items[0].content_html.includes('figcaption'));
  assert.equal(result.items[0].id, post.url);
});
test('social images respect verified overrides and always use an existing image default', () => {
  assert.equal(
    resolveSocialImage({}, meta),
    'https://chrismcleod.dev/assets/images/opengraph-default.jpg'
  );
  assert.equal(
    resolveSocialImage({ogImage: 'https://example.com/image.jpg'}, meta),
    'https://example.com/image.jpg'
  );
  assert.equal(
    resolveSocialImage({ogImage: 'missing.jpg'}, meta),
    resolveSocialImage({}, meta)
  );
});
test('Mage projection removes private fields, rejects empty/shrinking/malformed data', () => {
  const records = [
    {
      original: src,
      metadata: {
        webp: [
          {
            url: 'https://assets.chrismcleod.dev/test.webp',
            width: 100,
            height: 50,
            outputPath: '/private',
            buffer: 'secret'
          }
        ]
      },
      id: 'private',
      exif: {secret: true}
    }
  ];
  const projected = projectMageImages(records);
  assert.ok(!JSON.stringify(projected).includes('private'));
  assert.ok(!JSON.stringify(projected).includes('secret'));
  assert.throws(() => projectMageImages([]), /Empty/);
  assert.throws(() => projectMageImages([{original: src, metadata: {webp: [{}]}}]));
  assert.throws(
    () =>
      projectMageImages(
        [{...records[0], original: 'https://assets.chrismcleod.dev/new.png'}],
        projected
      ),
    /Shrinking/
  );
});
test('Mage refresh retains historical derivative references across variant changes', () => {
  const oldUrl = manifest.images[src].variants[0].url;
  const data = [
    {
      original: src,
      metadata: {
        webp: [{url: 'https://assets.chrismcleod.dev/new.webp', width: 100, height: 50}]
      }
    }
  ];
  const refreshed = projectMageImages(data, manifest);
  assert.equal(buildImageIndex(refreshed).get(oldUrl), refreshed.images[src]);
  assert.ok(refreshed.images[src].aliases.includes(oldUrl));
  assert.deepEqual(projectMageImages(data, refreshed), refreshed);
  const conflict = structuredClone(manifest);
  conflict.images['https://assets.chrismcleod.dev/other.png'] = {
    ...conflict.images[src],
    source: 'probe',
    dimensionSource: 'original',
    digest: 'different',
    aliases: [oldUrl],
    variants: [],
    fallbackReason: 'no-verified-variants'
  };
  assert.throws(() => projectMageImages(data, conflict), /Ambiguous image identity/);
});
test('reviewed Mage deletions prune only missing Mage records and retain last-good bytes otherwise', async t => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'image-prune-test-'));
  t.after(() => fs.rm(dir, {recursive: true, force: true}));
  const destination = path.join(dir, 'manifest.json');
  const previous = structuredClone(manifest);
  const legacy = 'https://assets.chrismcleod.dev/legacy.png';
  previous.images[legacy] = {
    width: 32,
    height: 32,
    source: 'probe',
    dimensionSource: 'original',
    variants: [],
    fallbackReason: 'no-verified-variants'
  };
  await fs.writeFile(destination, JSON.stringify(previous));
  const before = await fs.readFile(destination, 'utf8');
  const data = [
    {
      original: 'https://assets.chrismcleod.dev/new.png',
      metadata: {
        webp: [{url: 'https://assets.chrismcleod.dev/new.webp', width: 100, height: 50}]
      }
    }
  ];
  const request = {
    destination,
    token: 'test',
    fetchImpl: async () => ({ok: true, json: async () => data})
  };
  await assert.rejects(syncImages(request), /Shrinking/);
  assert.equal(await fs.readFile(destination, 'utf8'), before);
  const result = await syncImages({...request, allowShrink: true});
  assert.ok(!result.images[src]);
  assert.deepEqual(result.images[legacy], previous.images[legacy]);
  assert.ok(result.images[data[0].original]);
  const after = await fs.readFile(destination, 'utf8');
  await assert.rejects(
    syncImages({
      ...request,
      allowShrink: true,
      fetchImpl: async () => ({ok: true, json: async () => []})
    }),
    /Empty/
  );
  assert.equal(await fs.readFile(destination, 'utf8'), after);
});
test('failed/malformed sync leaves last-good snapshots byte-identical; unchanged successful sync is deterministic', async t => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'site-sync-test-'));
  t.after(() => fs.rm(dir, {recursive: true, force: true}));
  for (const [name, fn, good, bad] of [
    [
      'hobby',
      syncHobby,
      {
        version: 1,
        items: [{game: 'A', item: 'B', modelCount: 1, completedDate: '2026-01-01'}]
      },
      [{game: 'A', item: 'B', modelCount: 1, completedDate: 'invalid'}]
    ],
    ['images', syncImages, manifest, []]
  ]) {
    const destination = path.join(dir, name + '.json');
    const bytes = JSON.stringify(good);
    await fs.writeFile(destination, bytes);
    for (const fetchImpl of [
      async () => {
        throw Error('network');
      },
      async () => ({ok: false, status: 500}),
      async () => ({ok: true, json: async () => bad})
    ]) {
      await assert.rejects(fn({destination, token: 'test', fetchImpl}));
      assert.equal(await fs.readFile(destination, 'utf8'), bytes);
    }
  }
  const destination = path.join(dir, 'stable.json');
  const payload = [{game: 'A', item: 'B', modelCount: '1', completedDate: '2026-01-01'}];
  const fetchImpl = async () => ({ok: true, json: async () => payload});
  await syncHobby({destination, token: 'test', fetchImpl});
  const before = await fs.readFile(destination, 'utf8');
  await syncHobby({destination, token: 'test', fetchImpl});
  assert.equal(await fs.readFile(destination, 'utf8'), before);
});
test('hobby groups sort by completion date and only contain real years', () => {
  assert.deepEqual(
    Object.keys(
      groupHobbyByYear({
        items: [
          {item: 'B', completedDate: '2025-01-01'},
          {item: 'A', completedDate: '2026-02-01'}
        ]
      })
    ),
    ['2025', '2026']
  );
});
test('Mage legacy SQL-style UTC dates normalize without accepting invalid calendar dates', async t => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hobby-dates-test-'));
  t.after(() => fs.rm(dir, {recursive: true, force: true}));
  const destination = path.join(dir, 'hobby.json');
  const item = {
    game: 'Warhammer 40,000',
    item: 'Dark Eldar Warriors (1998)',
    modelCount: 20
  };
  const fetchImpl = completedDate => async () => ({
    ok: true,
    json: async () => [{...item, completedDate}]
  });
  const result = await syncHobby({
    destination,
    token: 'test',
    fetchImpl: fetchImpl('2022-12-31 00:00:00.000Z')
  });
  assert.equal(result.items[0].completedDate, '2022-12-31T00:00:00.000Z');
  const before = await fs.readFile(destination, 'utf8');
  await assert.rejects(
    syncHobby({
      destination,
      token: 'test',
      fetchImpl: fetchImpl('2022-02-30 00:00:00.000Z')
    }),
    /Invalid hobby item/
  );
  assert.equal(await fs.readFile(destination, 'utf8'), before);
});
test('redirect collisions/chains fail, Bunny feed rule remains separate', () => {
  assert.deepEqual(
    redirectMappings([{url: '/new/', data: {redirectFrom: ['/old/', '/feed/']}}]),
    [{from: '/old/', target: '/new/'}]
  );
  assert.throws(
    () =>
      redirectMappings([
        {url: '/new/', data: {redirectFrom: '/old/'}},
        {url: '/old/', data: {}}
      ]),
    /collision/
  );
});
test('redirect route guard covers collection-excluded feeds, exports and future outputs', () => {
  for (const route of [
    '/follow/blog/feed.json',
    '/bookmarks/data.json',
    '/future-output.xml'
  ]) {
    assert.throws(
      () =>
        assertRedirectRoutes({
          './src/redirects.11ty.js': [route],
          './src/excluded.11ty.js': [route]
        }),
      /Redirect collision/
    );
  }
  assertRedirectRoutes({
    './src/redirects.11ty.js': ['/old/'],
    './src/page.md': ['/new/']
  });
});
test('feed discovery preserves baseline titles/order/URLs with only declared JSON corrections', async () => {
  const {discoveryFeeds} = await import('../config/feed-descriptors.js');
  const {checkDiscoveryLinks} = await import('../helpers/check-build.js');
  const baseline = JSON.parse(await fs.readFile('test/fixtures/site-contracts.json'));
  const changes = JSON.parse(
    await fs.readFile('test/fixtures/allowed-output-changes.json')
  );
  const links = discoveryFeeds.map(f => ({
    title: f.title,
    type: 'application/' + f.type,
    href: new URL(f.url, meta.url).href
  }));
  assert.equal(
    checkDiscoveryLinks(links, baseline.discoveryLinks, changes.discoveryLinks),
    true
  );
  assert.equal(checkDiscoveryLinks(links, baseline.discoveryLinks), false);
  assert.equal(
    checkDiscoveryLinks(links.slice(1), baseline.discoveryLinks, changes.discoveryLinks),
    false
  );
  const changed = structuredClone(links);
  changed[0].title = changed[0].title.toUpperCase();
  assert.equal(
    checkDiscoveryLinks(changed, baseline.discoveryLinks, changes.discoveryLinks),
    false
  );
});
test('assets use final byte hashes, are deterministic, and support alternate outputs', async t => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'site-assets-test-'));
  t.after(() => fs.rm(dir, {recursive: true, force: true}));
  assert.throws(() => assetUrl('/missing.css'), /not been compiled/);
  const first = await compileAssets({outputDir: dir, production: true});
  const second = await compileAssets({outputDir: dir, production: true});
  assert.deepEqual(first, second);
  assert.match(assetUrl('/assets/css/global.css'), /\?v=[a-f\d]{12}$/);
  await fs.access(path.join(dir, 'assets/scripts/app.js'));
});

test('codemod handles escaped strings, multiline tags, URL parentheses and inline exceptions idempotently', async () => {
  const {convertImages} =
    await import('../docs/exec-plans/tools/image-shortcode-to-markdown.js');
  const text = `{% image\n "https://assets.chrismcleod.dev/p(a).png",\n "A \\"quote\\" [bracket] ☕", "Caption"\n-%}\n\nInline {% image "https://assets.chrismcleod.dev/x.png", "A", "visible" %} after\n`;
  const result = convertImages(text);
  assert.equal(result.converted, 1);
  assert.equal(result.exceptions.length, 1);
  assert.equal(convertImages(result.content).converted, 0);
  const html = markdownLib.render(result.content.split('\n\n')[0]);
  assert.ok(html.includes('figcaption'));
  assert.equal(load(html)('img').attr('src'), 'https://assets.chrismcleod.dev/p(a).png');
  assert.equal(load(html)('img').attr('alt'), 'A "quote" [bracket] ☕');
});
test('archived migration --check reports needed conversions without writing source', async t => {
  const {migrationCommand} =
    await import('../docs/exec-plans/tools/image-shortcode-to-markdown.js');
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'migration-check-test-'));
  t.after(() => fs.rm(dir, {recursive: true, force: true}));
  await fs.mkdir(path.join(dir, 'src'));
  const file = path.join(dir, 'src/test.md'),
    original = `{% image "${src}", "A" %}\n`;
  await fs.writeFile(file, original);
  const options = {root: path.join(dir, 'src')};
  assert.equal((await migrationCommand(['--check'], options)).exitCode, 1);
  assert.equal(await fs.readFile(file, 'utf8'), original);
  await fs.writeFile(file, `![A](${src})\n`);
  assert.equal((await migrationCommand(['--check'], options)).exitCode, 0);
  await assert.rejects(migrationCommand(['--unknown'], options), /Use --check/);
});
test('rename diagnostics distinguish pre-publication edits and preserve other recovery bytes', async t => {
  const {changedFiles, persistPublicationState} =
    await import('../helpers/persist-publication-state.js');
  const {assertPreparedChanges} = await import('../helpers/release-pipeline.js');
  const changes = changedFiles(
    () => 'R  unrelated-new.txt\0unrelated-old.txt\0 M .sequoia-state.json\0'
  );
  assert.deepEqual(changes, [
    {status: 'R ', file: 'unrelated-new.txt', previousFile: 'unrelated-old.txt'},
    {status: ' M', file: '.sequoia-state.json'}
  ]);
  assert.throws(
    () => assertPreparedChanges(changes),
    /Unrelated changes before publication: unrelated-old.txt -> unrelated-new.txt/
  );
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'rename-recovery-test-'));
  t.after(() => fs.rm(dir, {recursive: true, force: true}));
  const calls = [];
  const git = (...args) => {
    calls.push(args);
    if (args[0] === 'status')
      return 'R  unrelated-new.txt\0unrelated-old.txt\0 M .sequoia-state.json\0';
    return args[0] === 'rev-parse' ? 'baseline\n' : '';
  };
  await assert.rejects(
    persistPublicationState({recoveryDir: dir, git}),
    /Unexpected generated file/
  );
  assert.deepEqual(
    await fs.readFile(path.join(dir, 'files/.sequoia-state.json')),
    await fs.readFile('.sequoia-state.json')
  );
  assert.ok(!calls.some(c => ['add', 'commit', 'push'].includes(c[0])));
});
test('release pipeline stops before publication on preflight failure, and persists before later rendering', async () => {
  const {runPublicationPipeline} = await import('../helpers/release-pipeline.js');
  for (const failure of ['preflight', 'dryRun', 'publish', 'persist', 'finalBuild']) {
    const calls = [];
    let durable = false;
    const steps = Object.fromEntries(
      ['preflight', 'dryRun', 'publish', 'persist', 'finalBuild'].map(name => [
        name,
        async () => {
          calls.push(name);
          if (name === failure) throw Error(name);
          if (name === 'persist') durable = true;
        }
      ])
    );
    await assert.rejects(runPublicationPipeline(steps), new RegExp(failure));
    if (failure === 'preflight' || failure === 'dryRun')
      assert.ok(!calls.includes('publish'));
    if (failure === 'persist') assert.ok(!calls.includes('finalBuild'));
    if (failure === 'publish' || failure === 'finalBuild') assert.equal(durable, true);
    if (failure === 'publish') assert.ok(!calls.includes('finalBuild'));
  }
  let durable = false;
  await assert.rejects(async () => {
    await runPublicationPipeline({
      preflight: async () => {},
      dryRun: async () => {},
      publish: async () => {},
      persist: async () => {
        durable = true;
      },
      finalBuild: async () => {}
    });
    throw Error('deployment failed');
  }, /deployment failed/);
  assert.equal(durable, true);
});
test('migration approval is retired only after all reviewed hashes are durable in publisher state', async t => {
  const {markMigrationPublished, assertMigrationApproval, contentHash} =
    await import('../helpers/publication-plan.js');
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'migration-gate-test-'));
  t.after(() => fs.rm(dir, {recursive: true, force: true}));
  const migrationFile = path.join(dir, 'migration.json'),
    stateFile = path.join(dir, 'state.json');
  const files = [
    {file: 'src/posts/test.md', hash: 'reviewed', action: 'update', announcement: false}
  ];
  const migration = {
    reviewStatus: 'pending-owner-review',
    files,
    reviewDigest: contentHash(JSON.stringify(files))
  };
  await fs.writeFile(migrationFile, JSON.stringify(migration));
  await fs.writeFile(stateFile, JSON.stringify({posts: {}}));
  await assert.rejects(markMigrationPublished({migrationFile, stateFile}), /incomplete/);
  assert.equal(
    JSON.parse(await fs.readFile(migrationFile)).reviewStatus,
    'pending-owner-review'
  );
  await assert.rejects(
    assertMigrationApproval({actions: files}, '', migrationFile),
    /owner review/
  );
  const ordinary = {
    file: 'src/posts/ordinary.md',
    hash: 'new',
    action: 'create',
    announcement: true
  };
  await assertMigrationApproval({actions: [ordinary]}, '', migrationFile);
  await assert.rejects(
    assertMigrationApproval({actions: [...files, ordinary]}, '', migrationFile),
    /owner review/
  );
  await assertMigrationApproval({actions: files}, migration.reviewDigest, migrationFile);
  await fs.writeFile(
    stateFile,
    JSON.stringify({posts: {'src/posts/test.md': {contentHash: 'reviewed'}}})
  );
  await markMigrationPublished({migrationFile, stateFile});
  await assertMigrationApproval(
    {actions: [{...files[0], hash: 'later-edit'}]},
    '',
    migrationFile
  );
});
test('dry-run validation rejects early validation exits and unplanned announcements', async () => {
  const {checkDryRun} = await import('../helpers/publication-plan.js');
  const plan = {
    issues: [],
    actions: [{file: 'test.md', title: 'Test', action: 'update', announcement: false}]
  };
  assert.throws(() => checkDryRun('Validation failed', plan), /did not confirm/);
  assert.throws(
    () =>
      checkDryRun(
        '  ~ Test (content changed) [bsky: will post]\nDry run complete. No changes made.',
        plan
      ),
    /Unmatched/
  );
  checkDryRun(
    '  ~ Test (content changed) [bsky: skipped, older than 30 days]\nDry run complete. No changes made.',
    plan
  );
});
test('persistence refuses unrelated files and saves exact bytes before a failed push', async t => {
  const {persistPublicationState} =
    await import('../helpers/persist-publication-state.js');
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'site-persist-test-'));
  t.after(() => fs.rm(dir, {recursive: true, force: true}));
  await assert.rejects(
    persistPublicationState({recoveryDir: dir, git: () => ' M readme.md\0'}),
    /Unexpected/
  );
  const commands = [];
  const git = (...args) => {
    commands.push(args);
    if (args[0] === 'status') return ' M .sequoia-state.json\0';
    if (args[0] === 'push') throw Error('non-fast-forward');
    return args[0] === 'rev-parse' ? 'baseline\n' : '';
  };
  await assert.rejects(
    persistPublicationState({recoveryDir: dir, git}),
    /non-fast-forward/
  );
  assert.deepEqual(
    await fs.readFile(path.join(dir, 'files/.sequoia-state.json')),
    await fs.readFile('.sequoia-state.json')
  );
  assert.ok(commands.find(c => c[0] === 'commit'));
  assert.ok(!commands.some(c => c.includes('--force') || c[0] === 'rebase'));
});
test('backfill rejects aspect-ratio ownership guesses and makes no calls on a resolved rerun', async t => {
  const {backfillImages} = await import('../helpers/backfill-images.js');
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'site-backfill-test-'));
  t.after(() => fs.rm(dir, {recursive: true, force: true}));
  const destination = path.join(dir, 'manifest.json'),
    report = path.join(dir, 'report.json');
  const a = 'https://assets.chrismcleod.dev/a/image.png',
    b = 'https://assets.chrismcleod.dev/b/image.png';
  const bytesA = await fs.readFile('src/assets/images/favicon/favicon-32x32.png'),
    bytesB = Buffer.concat([bytesA, Buffer.from('different')]);
  let calls = 0;
  const fetchImpl = async url => {
    calls++;
    if (url !== a && url !== b) throw Error('Ambiguous derivative must never be fetched');
    return {
      ok: true,
      status: 200,
      arrayBuffer: async () => (url === a ? bytesA : bytesB)
    };
  };
  const first = await backfillImages({destination, report, sources: [a, b], fetchImpl});
  assert.equal(first.unresolved.length, 0);
  assert.equal(first.manifest.images[a].fallbackReason, 'ambiguous-derivative');
  assert.equal(first.manifest.images[b].variants.length, 0);
  assert.equal(calls, 2);
  const before = await fs.readFile(destination, 'utf8');
  await backfillImages({
    destination,
    report,
    sources: [a, b],
    fetchImpl: () => {
      throw Error('Should not fetch');
    }
  });
  assert.equal(await fs.readFile(destination, 'utf8'), before);
});
test('backfill checkpoints cannot resurrect keys already covered by verified aliases', async t => {
  const {backfillImages} = await import('../helpers/backfill-images.js');
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'site-checkpoint-test-'));
  t.after(() => fs.rm(dir, {recursive: true, force: true}));
  const destination = path.join(dir, 'manifest.json'),
    checkpoint = path.join(dir, 'checkpoint.json');
  const alias = 'https://assets.chrismcleod.dev//old.png';
  const current = structuredClone(manifest);
  current.images[src].aliases = [alias];
  await fs.writeFile(destination, JSON.stringify(sortManifest(current), null, 2) + '\n');
  await fs.writeFile(
    checkpoint,
    JSON.stringify({version: 1, images: {[alias]: manifest.images[src]}})
  );
  const before = await fs.readFile(destination, 'utf8');
  await backfillImages({
    destination,
    checkpoint,
    report: path.join(dir, 'report.json'),
    sources: [src, alias],
    fetchImpl: () => {
      throw Error('Should not fetch');
    }
  });
  assert.equal(await fs.readFile(destination, 'utf8'), before);
});
test('full-document enrichment retains html/head/body, body classes and document metadata', () => {
  setImageIndex(buildImageIndex(manifest));
  const html = `<!doctype html><html lang="en"><head><title>Test</title></head><body class="latte"><main data-pagefind-body><img src="${src}" alt="A"></main></body></html>`;
  const result = enrichImages(html);
  assert.ok(result.includes('<html lang="en">'));
  assert.ok(result.includes('<head>'));
  assert.ok(result.includes('<body class="latte">'));
  assert.ok(result.includes('<!DOCTYPE html>'));
  assert.equal(enrichImages(result), result);
});
