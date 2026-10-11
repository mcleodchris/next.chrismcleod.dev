import fs from 'node:fs/promises';
import path from 'node:path';
import {frontmatter} from '../config/utils/frontmatter.js';
export {frontmatter} from '../config/utils/frontmatter.js';
import {markdownLib} from '../config/plugins/markdown.js';
import {load} from 'cheerio';
import {SYSTEM_TAGS} from '../config/collections/index.js';

export async function filesUnder(dir) {
  const entries = await fs.readdir(dir, {withFileTypes: true});
  const lists = await Promise.all(
    entries.map(e =>
      e.isDirectory() ? filesUnder(path.join(dir, e.name)) : [path.join(dir, e.name)]
    )
  );
  return lists.flat().sort();
}
// Scan quoted arguments without splitting commas, tag terminators or newlines inside strings.
export function imageCalls(text) {
  const calls = [];
  const start = /{%[-]?\s*image\s+/g;
  let match;
  while ((match = start.exec(text))) {
    let i = start.lastIndex,
      quote = null,
      escaped = false;
    for (; i < text.length; i++) {
      const c = text[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (c === '\\' && quote) {
        escaped = true;
        continue;
      }
      if (quote) {
        if (c === quote) quote = null;
        continue;
      }
      if (c === '"' || c === "'") {
        quote = c;
        continue;
      }
      if (text.startsWith('%}', i) || text.startsWith('-%}', i)) break;
    }
    if (i >= text.length) throw new Error('Unclosed image shortcode');
    const end = i + (text.startsWith('-%}', i) ? 3 : 2);
    const argsText = text.slice(start.lastIndex, i);
    const args = [];
    let arg = '',
      q = null,
      esc = false;
    for (const c of argsText) {
      if (esc) {
        arg += c;
        esc = false;
        continue;
      }
      if (c === '\\' && q) {
        arg += c;
        esc = true;
        continue;
      }
      if (q) {
        arg += c;
        if (c === q) q = null;
        continue;
      }
      if (c === '"' || c === "'") {
        q = c;
        arg += c;
        continue;
      }
      if (c === ',') {
        args.push(arg.trim());
        arg = '';
      } else arg += c;
    }
    args.push(arg.trim());
    const values = args.map(a => {
      if (!/^(["'])[\s\S]*\1$/.test(a)) return undefined;
      return a
        .slice(1, -1)
        .replace(/\\([\\'"nrt])/g, (_, c) => ({n: '\n', r: '\r', t: '\t'})[c] ?? c);
    });
    calls.push({
      start: match.index,
      end,
      args,
      values,
      line: text.slice(0, match.index).split('\n').length
    });
    start.lastIndex = end;
  }
  return calls;
}
export async function inventorySources(root = 'src') {
  const documents = [],
    images = [],
    redirects = [],
    topics = new Set();
  for (const file of await filesUnder(root)) {
    if (!/\.(md|njk|html|json|js)$/.test(file)) continue;
    const text = await fs.readFile(file, 'utf8');
    const {data, body} = frontmatter(text);
    if (/^src\/(posts|notes|bookmarks)\/.*\.md$/.test(file))
      for (const tag of [].concat(data.tags || []))
        if (!SYSTEM_TAGS.has(tag)) topics.add(tag);
    if (/\.md$/.test(file))
      documents.push({
        file,
        permalink: data.permalink ?? null,
        atUri: data.atUri ?? null,
        date: data.date ?? null
      });
    for (const from of [].concat(data.redirectFrom || []))
      redirects.push({from, file, target: data.permalink ?? null});
    for (const c of imageCalls(body))
      images.push({
        file,
        kind: 'shortcode',
        src: c.values[0] ?? c.args[0],
        args: c.args,
        line: c.line
      });
    if (file.endsWith('.md')) {
      const visit = tokens => {
        for (const t of tokens) {
          if (t.type === 'image')
            images.push({
              file,
              kind: 'markdown',
              src: t.attrGet('src'),
              alt: t.content,
              title: t.attrGet('title')
            });
          if (t.children) visit(t.children);
        }
      };
      visit(markdownLib.parse(body, {}));
    }
    const $ = load(body, {}, false);
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.includes('{{')) images.push({file, kind: 'html', src});
    });
    // Include literal CDN image references in gallery data and templates, even when not img tags.
    for (const match of text.matchAll(
      /https?:\/\/assets\.chrismcleod\.dev\/[^\s"'<>)}\]]+\.(?:jpe?g|png|webp|avif|gif)(?:\?[^\s"'<>)}\]]*)?/gi
    )) {
      if (!images.some(im => im.file === file && im.src === match[0]))
        images.push({file, kind: 'data', src: match[0]});
    }
  }
  const originals = [
    ...new Set(images.map(i => i.src).filter(s => /^https?:/.test(s)))
  ].sort();
  const groups = new Map();
  for (const src of originals) {
    const basename = new URL(src).pathname.split('/').pop().split('.')[0];
    groups.set(basename, [...(groups.get(basename) || []), src]);
  }
  return {
    documents,
    redirects,
    images,
    originals,
    topics: [...topics].sort(),
    collisions: [...groups]
      .filter(([, urls]) => urls.length > 1)
      .map(([basename, urls]) => ({basename, urls}))
  };
}
