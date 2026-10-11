import state from '../.sequoia-state.json' with {type: 'json'};
import {escapeHtml} from '../config/images/escape.js';
import meta from './_data/meta.js';
export function redirectMappings(pages, publicationState = {}) {
  const built = new Set(pages.map(p => p.url)),
    mappings = new Map();
  for (const page of pages)
    for (const from of [].concat(page.data.redirectFrom || [])) {
      // /feed/ is owned by Bunny. An HTML document must not change its HTTP contract.
      if (from === '/feed/') continue;
      if (!from.startsWith('/') || from.includes('..') || /[?#]/.test(from) || !page.url)
        throw new Error(`Invalid redirect ${from}`);
      if (built.has(from) || mappings.has(from))
        throw new Error(`Redirect collision: ${from}`);
      mappings.set(from, page.url);
    }
  for (const page of pages) {
    const saved = publicationState.posts?.[page.inputPath?.replace(/^\.\//, '')];
    if (!saved?.slug || !page.data.atUri || saved.atUri !== page.data.atUri) continue;
    const from = `/blog/${saved.slug}/`;
    if (from !== page.url && !built.has(from)) {
      if (mappings.has(from) && mappings.get(from) !== page.url)
        throw new Error(`Publication redirect collision: ${from}`);
      mappings.set(from, page.url);
    }
  }
  for (const [from, target] of mappings)
    if (mappings.has(target) || from === target)
      throw new Error(`Redirect chain/loop: ${from}`);
  return [...mappings].map(([from, target]) => ({from, target}));
}
export default class {
  data() {
    return {
      pagination: {
        data: 'collections.all',
        size: 1,
        before: pages => redirectMappings(pages, state),
        alias: 'redirect'
      },
      eleventyExcludeFromCollections: true,
      excludeFromSitemap: true,
      permalink: data => data.redirect.from
    };
  }
  render({redirect}) {
    const url = escapeHtml(redirect.target);
    const canonical = escapeHtml(new URL(redirect.target, meta.url).href);
    return `<!doctype html><html lang="${escapeHtml(meta.lang)}"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${url}"><link rel="canonical" href="${canonical}"><title>Page moved</title></head><body><p>This page has moved to <a href="${url}">${url}</a>.</p></body></html>`;
  }
}
