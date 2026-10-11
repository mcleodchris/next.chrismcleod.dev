import Image from '@11ty/eleventy-img';
import {lookupImage, isCdnImage, IMAGE_FORMATS} from './manifest.js';
import {escapeHtml} from './escape.js';
export const DEFAULT_SIZES = '(min-width: 55rem) 820px, 100vw';
const diagnostics = new Set();
export function resetImageDiagnostics() {
  diagnostics.clear();
}
export function imageDiagnostics() {
  return [...diagnostics].sort();
}
export function renderPicture({
  src,
  alt = '',
  sizes = DEFAULT_SIZES,
  className = '',
  loading = 'lazy',
  widths,
  attributes = {}
}) {
  sizes ||= DEFAULT_SIZES;
  const record = lookupImage(src);
  const raw = {
    ...attributes,
    alt,
    sizes,
    ...(loading ? {loading} : {}),
    decoding: 'async',
    ...(className ? {class: className} : {})
  };
  const escaped = Object.fromEntries(
    Object.entries(raw)
      .filter(
        ([k]) => !['src', 'srcset', 'width', 'height', 'onload', 'onerror'].includes(k)
      )
      .map(([k, v]) => [k, k === 'alt' ? v : escapeHtml(v)])
  );
  if (!record || !record.variants.length) {
    if (!record && isCdnImage(src)) diagnostics.add(`Missing catalogue image: ${src}`);
    delete escaped.sizes;
    return `<img src="${escapeHtml(src)}"${record ? ` width="${record.width}" height="${record.height}"` : ''} ${Object.entries(
      escaped
    )
      .map(([k, v]) => `${k}="${k === 'alt' ? escapeHtml(v) : v}"`)
      .join(' ')}>`;
  }
  const requested = widths
    ? Array.isArray(widths)
      ? widths
      : String(widths).split(',').map(Number)
    : undefined;
  let variants = requested
    ? record.variants.filter(v => requested.includes(v.width))
    : record.variants;
  if (!variants.length) {
    diagnostics.add(
      `No requested widths for ${src}: ${requested.join(',')}; using available variants`
    );
    variants = record.variants;
  }
  const metadata = {};
  // Preference order for source selection, without manufacturing formats or widths.
  for (const format of IMAGE_FORMATS) {
    const entries = variants
      .filter(v => v.format === format)
      .sort((a, b) => a.width - b.width)
      .map(v => ({
        ...v,
        url: escapeHtml(v.url),
        sourceType: `image/${format === 'svg' ? 'svg+xml' : format}`,
        srcset: `${escapeHtml(v.url)} ${v.width}w`
      }));
    if (entries.length) metadata[format] = entries;
  }
  return Image.generateHTML(metadata, escaped);
}
export function renderFigure(picture, caption) {
  return `<figure>${picture}${caption ? `<figcaption class="cluster font-display"><p>${escapeHtml(caption)}</p></figcaption>` : ''}</figure>`;
}
