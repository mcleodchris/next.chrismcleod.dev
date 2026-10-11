import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {load} from 'cheerio';
import {inventorySite, feedDiscoveryLinks} from './inventory-site.js';
import {filesUnder, frontmatter} from './site-sources.js';
import {
  loadManifest,
  buildImageIndex,
  isCdnImage,
  normaliseUrl
} from '../config/images/manifest.js';
import {slugifyString} from '../config/utils/index.js';
import {formatDate} from '../config/filters/index.js';
import {readJson} from './sync-utils.js';
import {parseXml} from '@rgrove/parse-xml';
import meta from '../src/_data/meta.js';
import feeds, {xmlFeeds} from '../config/feed-descriptors.js';
/** Compare subscriber discovery metadata to the baseline plus exact declared corrections. */
export function checkDiscoveryLinks(links, baseline, changes = []) {
  const expected = baseline.map(link => {
    const correction = changes.find(
      change => JSON.stringify(change.before) === JSON.stringify(link)
    );
    return correction?.after || link;
  });
  return JSON.stringify(links) === JSON.stringify(expected);
}
export async function checkBuild(
  directory,
  {
    baseline = 'test/fixtures/site-contracts.json',
    changesFile = 'test/fixtures/allowed-output-changes.json',
    requireImages = false
  } = {}
) {
  const current = await inventorySite(directory),
    old = await readJson(baseline),
    changes = await readJson(changesFile, {});
  const approved = (route, field, id, before, after) =>
    changes.feedFields?.[`${route}:${field}`]?.items?.some(
      item =>
        item.id === id &&
        JSON.stringify(item.before) === JSON.stringify(before) &&
        JSON.stringify(item.after) === JSON.stringify(after)
    );
  const failures = [...current.defects],
    index = buildImageIndex(await loadManifest());
  const exists = async url => {
    const relative = decodeURI(url.split(/[?#]/)[0]).replace(/^\//, '');
    try {
      await fs.access(
        path.join(
          directory,
          relative.endsWith('/') || !relative ? relative + 'index.html' : relative
        )
      );
      return true;
    } catch {
      return false;
    }
  };
  for (const route of old.routes)
    if (!current.routes.includes(route) && !changes.removedRoutes?.[route])
      failures.push(`Removed route: ${route}`);
  const originalFiles = new Set((old.documents || []).map(d => d.file));
  const newDocuments = new Map();
  for (const document of current.sources.documents.filter(
    d => !originalFiles.has(d.file)
  )) {
    const {data} = frontmatter(await fs.readFile(document.file, 'utf8'));
    const kind = document.file.split('/')[1];
    let route =
      typeof data.permalink === 'string' && !data.permalink.includes('{{')
        ? data.permalink.replace(/index\.html$/, '')
        : undefined;
    if (!route && kind === 'posts') route = `/blog/${slugifyString(data.title)}/`;
    if (!route && kind === 'bookmarks')
      route = `/bookmarks/${slugifyString(data.title)}/`;
    if (!route && kind === 'notes')
      route = `/notes/${formatDate(data.date, 'YYYYMMDDHHmm')}/`;
    if (!route && kind === 'likes')
      route = `/likes/${path.basename(document.file, '.md')}/`;
    if (route) newDocuments.set(route, {kind, date: new Date(data.date).toISOString()});
  }
  for (const route of current.routes.filter(route => !old.routes.includes(route))) {
    if (
      route.startsWith('/pagefind/') ||
      changes.addedRoutes?.[route] ||
      newDocuments.has(route)
    )
      continue;
    const pagination = route.match(/^\/(blog\/page-|bookmarks\/)(\d+)\/$/);
    if (pagination) {
      const kind = pagination[1] === 'blog/page-' ? 'posts' : 'bookmarks';
      const count = current.sources.documents.filter(d =>
        d.file.startsWith(`src/${kind}/`)
      ).length;
      if (Number(pagination[2]) < Math.ceil(count / meta.pagination.itemsPerPage))
        continue;
    }
    if (/^\/paintslam\/\d{4}\/$/.test(route)) {
      const snapshot = await readJson('data/hobby.json');
      if (
        snapshot.items.some(
          item =>
            String(new Date(item.completedDate).getUTCFullYear()) === route.split('/')[2]
        )
      )
        continue;
    }
    if (
      route.startsWith('/tags/') &&
      current.sources.topics.includes(decodeURI(route.split('/')[2]))
    )
      continue;
    if (current.sources.redirects.some(redirect => redirect.from === route)) continue;
    failures.push(`Unexpected generated route: ${route}`);
  }
  for (const [feed, contract] of Object.entries(old.feeds)) {
    if (!/feed\.(xml|json|atom|rss)$/.test(feed)) continue;
    if (!current.feeds[feed]) {
      failures.push(`Missing feed: ${feed}`);
      continue;
    }
    const items = current.feeds[feed].items,
      oldIds = new Set(contract.items.map(item => item.id));
    const descriptor = [...feeds, ...xmlFeeds].find(f => f.permalink === feed);
    if (!descriptor) {
      failures.push(`Missing feed descriptor: ${feed}`);
      continue;
    }
    const kind = descriptor.kind === 'blog' ? 'posts' : descriptor.kind;
    const limit = descriptor.limit;
    const expectedCount = Math.min(
      limit,
      current.sources.documents.filter(d => d.file.startsWith(`src/${kind}/`)).length
    );
    if (items.length !== expectedCount)
      failures.push(`${feed}: expected ${expectedCount} items, received ${items.length}`);
    const additions = items.filter(item => !oldIds.has(item.id));
    for (const item of additions) {
      const route = new URL(item.id, meta.url).pathname;
      const source = newDocuments.get(route);
      if (
        !source ||
        source.kind !== kind ||
        !current.routes.includes(route) ||
        Date.parse(item.date_published || item.date) !== Date.parse(source.date)
      )
        failures.push(`${feed}: unexpected new identifier/date ${item.id}`);
    }
    const surviving = items.filter(item => oldIds.has(item.id)).map(item => item.id);
    const expectedOrder = contract.items
      .filter(item => surviving.includes(item.id))
      .map(item => item.id);
    if (JSON.stringify(surviving) !== JSON.stringify(expectedOrder))
      failures.push(`${feed}: historical item order changed`);
    const byId = new Map(items.map(item => [item.id, item]));
    for (let i = 0; i < contract.items.length; i++) {
      const previous = contract.items[i],
        item = byId.get(previous.id);
      if (!item) {
        if (i < items.length - additions.length)
          failures.push(`${feed}: missing historical item ${previous.id}`);
        continue;
      }
      for (const [field, value] of Object.entries(previous)) {
        if (JSON.stringify(item[field]) === JSON.stringify(value)) continue;
        if (field === '_posse') {
          for (const [key, expected] of Object.entries(value))
            if (
              JSON.stringify(item[field]?.[key]) !== JSON.stringify(expected) &&
              !approved(
                feed,
                `${field}.${key}`,
                previous.id,
                expected,
                item[field]?.[key]
              )
            )
              failures.push(`${feed} ${previous.id}: changed ${field}.${key}`);
        } else if (!approved(feed, field, previous.id, value, item[field]))
          failures.push(`${feed} ${previous.id}: changed ${field}`);
      }
    }
  }
  for (const previous of old.documents || []) {
    const document = current.sources.documents.find(d => d.file === previous.file);
    if (!document || JSON.stringify(document) !== JSON.stringify(previous))
      failures.push(`Source URL/date/atUri contract changed: ${previous.file}`);
  }
  const shortFormDates = new Map(
    current.sources.documents
      .filter(d => /^src\/(notes|likes)\/.*\.md$/.test(d.file) && d.date)
      .map(d => [
        d.file.startsWith('src/notes/')
          ? `/notes/${formatDate(d.date, 'YYYYMMDDHHmm')}/`
          : `/likes/${path.basename(d.file, '.md')}/`,
        new Date(d.date).toISOString()
      ])
  );
  if (requireImages)
    for (const src of current.sources.originals.filter(isCdnImage))
      if (!index.has(normaliseUrl(src))) failures.push(`Unresolved owned image: ${src}`);
  for (const file of await filesUnder(directory)) {
    if (/\.(xml|atom|rss)$/.test(file)) {
      try {
        parseXml(await fs.readFile(file, 'utf8'));
      } catch (e) {
        failures.push(`${file}: invalid XML: ${e.message}`);
      }
    }
    if (!file.endsWith('.html')) continue;
    const html = await fs.readFile(file, 'utf8'),
      $ = load(html);
    const canonical = $('link[rel="canonical"]').attr('href');
    if ($('meta[name="generator"]').length && old.discoveryLinks) {
      const links = feedDiscoveryLinks($);
      if (!checkDiscoveryLinks(links, old.discoveryLinks, changes.discoveryLinks))
        failures.push(`${file}: feed discovery links differ from declared contract`);
    }
    const expectedDate = canonical && shortFormDates.get(new URL(canonical).pathname);
    if (
      expectedDate &&
      $('main time.dt-published').first().attr('datetime') !== expectedDate
    )
      failures.push(`${file}: rendered publication date differs from source`);
    if ($('picture picture, p figure, figure figure').length)
      failures.push(`${file}: nested image enrichment`);
    for (const img of $('img').toArray()) {
      const src = $(img).attr('src');
      if (requireImages && isCdnImage(src) && !index.has(normaliseUrl(src)))
        failures.push(`${file}: unresolved rendered image ${src}`);
      if (isCdnImage(src) && index.has(normaliseUrl(src))) {
        if (
          !['width', 'height'].every(attribute => {
            const value = Number($(img).attr(attribute));
            return Number.isInteger(value) && value > 0;
          })
        )
          failures.push(`${file}: missing image dimensions`);
      }
    }
    for (const imageMeta of $('meta[property="og:image"]').toArray()) {
      const url = $(imageMeta).attr('content');
      if (!url || new URL(url, meta.url).href === new URL(meta.url).href)
        failures.push(`${file}: invalid social image`);
      else if (
        new URL(url, meta.url).origin === new URL(meta.url).origin &&
        !(await exists(new URL(url).pathname))
      )
        failures.push(`${file}: missing social image ${url}`);
    }
    const redirect = $('meta[http-equiv="refresh"]').attr('content');
    if (redirect && !(await exists(redirect.split('url=')[1])))
      failures.push(`${file}: redirect target is missing`);
    for (const link of $('a.p-category[href^="/tags/"]').toArray()) {
      const href = $(link).attr('href');
      if (!(await exists(href.endsWith('/') ? href : href + '/')))
        failures.push(`${file}: dangling public topic ${href}`);
    }
    for (const link of $('a[href^="/paintslam/"]').toArray())
      if (!(await exists($(link).attr('href'))))
        failures.push(`${file}: dangling Paintslam link`);
  }
  for (const [url] of Object.entries(current.assets)) {
    const [pathname, query] = url.split('?');
    const bytes = await fs.readFile(path.join(directory, pathname));
    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
    if (query !== `v=${hash}`) failures.push(`Asset bytes/version mismatch: ${url}`);
  }
  const state = await readJson('.sequoia-state.json');
  for (const [file, record] of Object.entries(state.posts)) {
    if (!record.slug) continue;
    const document = current.sources.documents.find(d => d.file === file);
    if (document?.atUri && !(await exists(`/blog/${record.slug}/`)))
      failures.push(`Sequoia URL is not built: ${record.slug}`);
  }
  return [...new Set(failures)];
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2),
    baseline = args.find(a => a.startsWith('--baseline='))?.slice(11);
  const failures = await checkBuild(args.find(a => !a.startsWith('--')) || 'dist', {
    ...(baseline ? {baseline} : {}),
    requireImages: args.includes('--require-images')
  });
  for (const failure of failures) console.error(`FAIL ${failure}`);
  console.log(
    `${failures.length ? 'Failed' : 'Passed'} build checks (${failures.length} issues)`
  );
  if (failures.length && !args.includes('--report-only')) process.exitCode = 1;
}
