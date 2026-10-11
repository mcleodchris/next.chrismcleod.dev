// Archived migration verification tool; not used by builds or production release.
import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
import {filesUnder} from '../../../helpers/site-sources.js';
const [before, after] = process.argv.slice(2);
let pages = 0,
  images = 0;
const differences = [];
for (const file of await filesUnder(before)) {
  if (!file.endsWith('.html')) continue;
  const relative = path.relative(before, file);
  let latest;
  try {
    latest = await fs.readFile(path.join(after, relative), 'utf8');
  } catch {
    continue;
  }
  const media = html => {
    const $ = load(html);
    return {
      images: $('.e-content img, main figure img')
        .toArray()
        .map(el => ({
          alt: $(el).attr('alt') || '',
          className: $(el).attr('class') || '',
          loading: $(el).attr('loading') || 'lazy'
        })),
      captions: $('main figcaption')
        .toArray()
        .map(el => $(el).text().trim())
    };
  };
  const old = media(await fs.readFile(file, 'utf8')),
    next = media(latest);
  pages++;
  images += old.images.length;
  if (JSON.stringify(old) !== JSON.stringify(next))
    differences.push({file: relative, before: old, after: next});
}
console.log(JSON.stringify({pages, images, differences}, null, 2));
if (differences.length) process.exitCode = 1;
