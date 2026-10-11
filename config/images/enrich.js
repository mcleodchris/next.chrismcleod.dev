import {load} from 'cheerio';
import {isCdnImage} from './manifest.js';
import {renderPicture} from './picture.js';
export function enrichImages(html) {
  if (!html || !html.includes('<img')) return html;
  const fullDocument = /^\s*(?:<!doctype html[^>]*>\s*)?<html\b/i.test(html);
  const $ = load(html, {}, fullDocument);
  let changed = false;
  $('img').each((_, el) => {
    const img = $(el),
      src = img.attr('src');
    if (
      !isCdnImage(src) ||
      img.parents('picture,svg,pre,code').length ||
      img.attr('data-cdn-image') !== undefined
    )
      return;
    const attributes = {...el.attribs, 'data-cdn-image': ''};
    delete attributes.loading;
    img.replaceWith(
      renderPicture({
        src,
        alt: img.attr('alt') || '',
        sizes: img.attr('sizes'),
        className: img.attr('class'),
        loading: img.attr('loading') ?? 'lazy',
        attributes
      })
    );
    changed = true;
  });
  return changed ? $.html() : html;
}
