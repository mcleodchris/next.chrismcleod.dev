import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {load} from 'cheerio';
import {filesUnder, inventorySources} from './site-sources.js';

export const feedDiscoveryLinks = $ =>
  $('link[rel="alternate"]')
    .toArray()
    .map(el => ({
      title: $(el).attr('title'),
      type: $(el).attr('type'),
      href: $(el).attr('href')
    }));
export async function inventorySite(site) {
  const routes = [],
    feeds = {},
    assets = {},
    defects = [];
  let discoveryLinks;
  for (const file of await filesUnder(site)) {
    const relative = path.relative(site, file).split(path.sep).join('/');
    if (!/\.(html|json|xml|atom|rss)$/.test(file)) continue;
    const route = '/' + relative.replace(/index\.html$/, '');
    routes.push(route);
    const text = await fs.readFile(file, 'utf8');
    if (relative.endsWith('.html')) {
      const $ = load(text);
      if (!discoveryLinks && $('meta[name="generator"]').length)
        discoveryLinks = feedDiscoveryLinks($);
      $('img').each((_, el) => {
        if (
          !$(el).attr('src') ||
          ['src', 'height', 'width'].some(k => $(el).attr(k) === 'undefined')
        )
          defects.push(`${route}: invalid image`);
      });
      for (const el of $('link[rel="stylesheet"],script[src]').toArray()) {
        const url = $(el).attr('href') ?? $(el).attr('src');
        if (url?.startsWith('/assets/')) assets[url] = (assets[url] || 0) + 1;
      }
    }
    if (relative.endsWith('.json')) {
      try {
        const data = JSON.parse(text);
        if (data.items)
          feeds[route] = {
            items: data.items.map(
              ({id, url, date_published, title, tags, external_url, _posse}) => ({
                id,
                url,
                date_published,
                title,
                tags,
                external_url,
                _posse
              })
            )
          };
      } catch (e) {
        defects.push(`${route}: invalid JSON (${e.message})`);
      }
    }
    if (/\.(atom|rss|xml)$/.test(relative)) {
      const $ = load(text, {xml: true});
      feeds[route] = {
        items: $('entry,item')
          .toArray()
          .map(el => ({
            id: $(el).find('id,guid').text(),
            date: $(el).find('updated,pubDate').text(),
            title: $(el).find('title').text(),
            link: $(el).find('link').attr('href') ?? $(el).find('link').text()
          }))
      };
    }
  }
  return {
    routes: routes.sort(),
    feeds,
    assets,
    discoveryLinks,
    defects,
    sources: await inventorySources()
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = Object.fromEntries(
    process.argv.slice(2).map(a => a.replace(/^--/, '').split('='))
  );
  const result = await inventorySite(args.site || 'dist');
  const text = JSON.stringify(result, null, 2) + '\n';
  if (args.out) await fs.writeFile(args.out, text);
  else process.stdout.write(text);
  console.error(
    `${result.routes.length} routes; ${Object.keys(result.feeds).length} feeds; ${result.sources.originals.length} image URLs; ${result.defects.length} defects`
  );
}
