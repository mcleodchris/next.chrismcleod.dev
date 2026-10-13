/**
 * Checks a built site for known classes of bugs.
 *
 * Usage:
 *   node helpers/check-build.js <dir> [--allow <check-name>]...
 *
 * Prints one line per check (PASS, FAIL or WARN for an allowed failure) and
 * exits with code 1 if any check that was not allowed failed.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import * as yaml from 'js-yaml';
import { XMLValidator, XMLParser } from 'fast-xml-parser';
import { identity } from '../config/identity/index.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const dir = args[0];
const allowed = new Set();
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--allow' && args[i + 1]) allowed.add(args[++i]);
}

if (!dir || !fs.existsSync(dir)) {
  console.error('Usage: node helpers/check-build.js <dir> [--allow <check-name>]...');
  process.exit(2);
}

const SYSTEM_TAG_PAGES = [
  'all', 'posts', 'timeline', 'bookmark', 'notes', 'graph', 'tagList', 'contentTags',
  'subscriptions', 'allBookmarks', 'allNotes', 'bookmarksFeed', 'bookmarksForFeed',
  'notesForFeed', 'postsForFeed', 'redirects'
];

const walk = (folder, filter, out = []) => {
  if (!fs.existsSync(folder)) return out;
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) walk(full, filter, out);
    else if (filter(full)) out.push(full);
  }
  return out;
};

const frontMatter = file => {
  const match = fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return undefined;
  try {
    // YAML 1.1, as Eleventy reads front matter (dates become Date objects)
    return yaml.load(match[1], { schema: yaml.YAML11_SCHEMA });
  } catch {
    return undefined;
  }
};

const rel = file => path.relative(dir, file);
const summarise = (problems, max = 5) =>
  `${problems.length} problem(s): ${problems.slice(0, max).join('; ')}${problems.length > max ? '; …' : ''}`;

const htmlFiles = walk(dir, f => f.endsWith('.html'));
const htmlCache = new Map();
const readHtml = file => {
  if (!htmlCache.has(file)) htmlCache.set(file, fs.readFileSync(file, 'utf8'));
  return htmlCache.get(file);
};
const domCache = new Map();
const loadDom = file => {
  if (!domCache.has(file)) domCache.set(file, cheerio.load(readHtml(file)));
  return domCache.get(file);
};

const checks = {
  'no-undefined-attributes': () => {
    const bad = htmlFiles.filter(f => readHtml(f).includes('="undefined"')).map(rel);
    return bad.length ? summarise(bad) : null;
  },

  'no-system-tag-pages': () => {
    const bad = SYSTEM_TAG_PAGES.filter(name => fs.existsSync(path.join(dir, 'tags', name)));
    return bad.length ? `system tag pages exist: ${bad.join(', ')}` : null;
  },

  'json-feeds-valid': () => {
    const problems = [];
    const feeds = walk(path.join(dir, 'follow'), f => path.basename(f) === 'feed.json');
    if (!feeds.length) return 'no JSON feeds found';
    for (const file of feeds) {
      let feed;
      try {
        feed = JSON.parse(fs.readFileSync(file, 'utf8'));
      } catch (error) {
        problems.push(`${rel(file)}: ${error.message}`);
        continue;
      }
      if (typeof feed.version !== 'string') problems.push(`${rel(file)}: version`);
      if (typeof feed.title !== 'string') problems.push(`${rel(file)}: title`);
      if (!Array.isArray(feed.items)) {
        problems.push(`${rel(file)}: items`);
        continue;
      }
      feed.items.forEach((item, index) => {
        for (const key of ['id', 'url', 'title', 'content_html']) {
          if (typeof item[key] !== 'string') problems.push(`${rel(file)} item ${index}: ${key}`);
        }
        for (const key of ['summary', 'image']) {
          if (key in item && typeof item[key] !== 'string') {
            problems.push(`${rel(file)} item ${index}: ${key}`);
          }
        }
      });
    }
    return problems.length ? summarise(problems) : null;
  },

  'xml-feeds-valid': () => {
    const problems = [];
    const files = [
      path.join(dir, 'feed.xml'),
      path.join(dir, 'bookmarks/feed.xml'),
      path.join(dir, 'sitemap.xml'),
      ...walk(path.join(dir, 'follow'), f => /feed\.(atom|rss)$/.test(f))
    ];
    const parser = new XMLParser({ ignoreAttributes: false });
    for (const file of files) {
      if (!fs.existsSync(file)) {
        problems.push(`${rel(file)}: missing`);
        continue;
      }
      const text = fs.readFileSync(file, 'utf8');
      const valid = XMLValidator.validate(text);
      if (valid !== true) {
        problems.push(`${rel(file)}: ${valid.err.msg} (line ${valid.err.line})`);
        continue;
      }
      const doc = parser.parse(text);
      const text0 = value => (typeof value === 'object' ? value?.['#text'] : value);
      if (doc.feed && !String(text0(doc.feed.title) ?? '').trim()) {
        problems.push(`${rel(file)}: empty feed title`);
      }
      if (doc.rss && !String(text0(doc.rss.channel?.title) ?? '').trim()) {
        problems.push(`${rel(file)}: empty channel title`);
      }
      if (/(href|xml:base)="undefined|(href|xml:base)="[^"]*undefined/.test(text) ||
          /<link>[^<]*undefined/.test(text)) {
        problems.push(`${rel(file)}: link contains undefined`);
      }
    }
    return problems.length ? summarise(problems) : null;
  },

  'redirect-stubs': () => {
    const problems = [];
    let count = 0;
    const sources = walk(path.join(ROOT, 'src'), f => f.endsWith('.md'));
    for (const source of sources) {
      const data = frontMatter(source);
      if (!data?.redirectFrom) continue;
      const paths = [].concat(data.redirectFrom).filter(Boolean);
      for (const from of paths) {
        count++;
        const target = from.endsWith('.html')
          ? path.join(dir, from)
          : path.join(dir, from, 'index.html');
        if (!fs.existsSync(target) || !fs.readFileSync(target, 'utf8').includes('http-equiv="refresh"')) {
          problems.push(from);
        }
      }
    }
    return problems.length ? summarise(problems) : { detail: String(count) };
  },

  // The state file's `slug` is derived from the file name; the URL a record
  // links to is the post's Sequoia path, resolved from its title.
  'sequoia-slugs-resolve': () => {
    const stateFile = path.join(ROOT, '.sequoia-state.json');
    if (!fs.existsSync(stateFile)) return null;
    const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    const missing = [];
    for (const source of Object.keys(state.posts ?? {})) {
      const file = path.join(ROOT, source);
      if (!fs.existsSync(file)) continue;
      const { title } = frontMatter(file) ?? {};
      const postPath = identity('post', title).sequoiaPath;
      if (!fs.existsSync(path.join(dir, postPath, 'index.html'))) missing.push(postPath);
    }
    return missing.length ? summarise(missing) : null;
  },

  'no-base-href': () => {
    const bad = htmlFiles.filter(f => readHtml(f).includes('<base href=')).map(rel);
    return bad.length ? summarise(bad) : null;
  },

  'picture-img-dimensions': () => {
    const problems = [];
    for (const file of htmlFiles) {
      if (!readHtml(file).includes('<picture')) continue;
      const $ = loadDom(file);
      $('picture img').each((_, img) => {
        const { width, height } = img.attribs;
        if (!/^\d+$/.test(width ?? '') || !/^\d+$/.test(height ?? '')) {
          problems.push(`${rel(file)}: ${img.attribs.src}`);
        }
      });
    }
    return problems.length ? `${problems.length} images without dimensions: ${problems.slice(0, 3).join('; ')}` : null;
  },

  'tag-links-resolve': () => {
    const problems = new Set();
    for (const file of htmlFiles) {
      if (!readHtml(file).includes('/tags/')) continue;
      const $ = loadDom(file);
      $('a[href^="/tags/"]').each((_, a) => {
        const name = decodeURIComponent(a.attribs.href.split(/[?#]/)[0].replace(/^\/tags\//, '').replace(/\/$/, ''));
        if (!fs.existsSync(path.join(dir, 'tags', name, 'index.html'))) problems.add(`/tags/${name}`);
      });
    }
    return problems.size ? summarise([...problems]) : null;
  },

  'single-asset-version': () => {
    const css = new Set();
    const js = new Set();
    for (const file of htmlFiles) {
      const html = readHtml(file);
      for (const [, href] of html.matchAll(/href="(\/assets\/css\/global\.css[^"]*)"/g)) css.add(href);
      for (const [, src] of html.matchAll(/src="(\/assets\/scripts\/app\.js[^"]*)"/g)) js.add(src);
    }
    const problems = [];
    if (css.size > 1) problems.push(`${css.size} distinct global.css URLs`);
    if (js.size > 1) problems.push(`${js.size} distinct app.js URLs`);
    return problems.length ? problems.join('; ') : null;
  },

  'og-image-is-image': () => {
    const problems = new Set();
    for (const file of htmlFiles) {
      const match = readHtml(file).match(/<meta property="og:image" content="([^"]*)"/);
      if (!match) continue;
      if (!/^https?:\/\/.+\.(jpe?g|png|webp)$/i.test(match[1])) problems.add(`${rel(file)}: ${match[1]}`);
    }
    return problems.size ? summarise([...problems]) : null;
  }
};

let failed = false;
for (const [name, check] of Object.entries(checks)) {
  let result;
  try {
    result = check();
  } catch (error) {
    result = `check threw: ${error.message}`;
  }
  if (result === null || typeof result === 'object') {
    console.log(`PASS ${name}${result?.detail ? ` (${result.detail})` : ''}`);
  } else if (allowed.has(name)) {
    console.log(`WARN ${name}: ${result} (allowed)`);
  } else {
    console.log(`FAIL ${name}: ${result}`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
