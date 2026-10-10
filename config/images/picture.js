/**
 * Responsive image markup from the image manifest. Nothing is downloaded or
 * resized: the manifest says which variants exist on the CDN.
 */

import Image from '@11ty/eleventy-img';
import { FORMATS, lookup, variantUrl } from './manifest.js';

const missing = new Set();

const escapeAttribute = value =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const plainImg = ({ src, alt, className, loading, width, height }) => {
  const attributes = [
    `src="${escapeAttribute(src)}"`,
    `alt="${escapeAttribute(alt ?? '')}"`,
    width && height ? `width="${width}" height="${height}"` : '',
    className ? `class="${escapeAttribute(className)}"` : '',
    loading ? `loading="${loading}"` : '',
    'decoding="async"'
  ];
  return `<img ${attributes.filter(Boolean).join(' ')}>`;
};

export const renderPicture = ({
  src,
  alt,
  className,
  loading = 'lazy',
  sizes = '(min-width: 55rem) 820px, 100vw'
}) => {
  const entry = lookup(src);
  if (!entry) {
    missing.add(src);
    return plainImg({ src, alt, className, loading });
  }

  const metadata = {};
  for (const format of FORMATS) {
    const widths = entry.variants?.[format] ?? [];
    if (!widths.length) continue;
    metadata[format] = widths.map(width => {
      const url = variantUrl(src, width, format, entry);
      return {
        format,
        width,
        height: Math.round((width * entry.height) / entry.width),
        url,
        sourceType: `image/${format}`,
        srcset: `${url} ${width}w`
      };
    });
  }

  if (!Object.keys(metadata).length) {
    return plainImg({ src, alt, className, loading, width: entry.width, height: entry.height });
  }

  const attributes = { alt: alt ?? '', sizes, loading, decoding: 'async' };
  if (className) attributes.class = className;
  return Image.generateHTML(metadata, attributes);
};

/** Prints one warning listing the images rendered without a manifest entry, then forgets them. */
export const reportMissingImages = () => {
  if (!missing.size) return;
  console.warn(
    `[images] ${missing.size} images have no manifest entry; run npm run images:sync\n  ${[...missing].join('\n  ')}`
  );
  missing.clear();
};
