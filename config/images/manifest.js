/**
 * The image manifest, data/images.json: for each original image URL on the
 * CDN, its dimensions and the resized variants that actually exist there.
 * `npm run images:sync` writes it; builds only read it.
 *
 * ManifestEntry = {
 *   width: number, height: number,
 *   variants: { [format]: number[] },  // ascending widths that exist on the CDN
 *   source: 'mage' | 'probe',
 *   resizedBase?: string               // only when variants are not under RESIZED_BASE
 * }
 */

import fs from 'fs';
import path from 'path';

export const RESIZED_BASE = 'https://assets.chrismcleod.dev/chrismcleod.dev/assets/resized';
export const FORMATS = ['avif', 'webp', 'jpeg'];
export const CANDIDATE_WIDTHS = [320, 570, 650, 820, 960, 1200];

const MANIFEST_PATH = new URL('../../data/images.json', import.meta.url);

export const isCdnImage = url => {
  try {
    return new URL(url).hostname.toLowerCase() === 'assets.chrismcleod.dev';
  } catch {
    return false;
  }
};

/** Lower-cases the host and collapses repeated slashes; keeps path case and query, drops the hash. */
export const normaliseUrl = url => {
  const parsed = new URL(url);
  parsed.hash = '';
  parsed.pathname = parsed.pathname.replace(/\/{2,}/g, '/');
  return parsed.toString();
};

/** The file name without folder or extension. */
export const basenameOf = url => {
  const { pathname } = new URL(url);
  return path.posix.basename(pathname, path.posix.extname(pathname));
};

export const variantUrl = (originalUrl, width, format, entry) =>
  `${entry?.resizedBase ?? RESIZED_BASE}/${basenameOf(originalUrl)}-${width}.${format}`;

let cache;

export const loadManifest = () => {
  cache ??= fs.existsSync(MANIFEST_PATH)
    ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
    : { version: 1, images: {} };
  return cache;
};

export const resetManifestCache = () => {
  cache = undefined;
};

export const lookup = url => {
  try {
    return loadManifest().images[normaliseUrl(url)];
  } catch {
    return undefined;
  }
};
