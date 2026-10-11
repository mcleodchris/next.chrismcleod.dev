import fs from 'node:fs/promises';
// Ordered by preferred browser source format; shared by validation, sync and rendering.
export const IMAGE_FORMATS = ['avif', 'webp', 'jpeg', 'png', 'gif', 'svg'];
export function normaliseUrl(src) {
  const url = new URL(src);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password)
    throw new Error(`Invalid public image URL: ${src}`);
  url.hash = '';
  return url.href;
}
export function isCdnImage(src) {
  try {
    return new URL(src).hostname.toLowerCase() === 'assets.chrismcleod.dev';
  } catch {
    return false;
  }
}
const dimension = value => Number.isInteger(value) && value > 0;
export function validateManifest(manifest) {
  if (
    manifest?.version !== 1 ||
    !manifest.images ||
    Array.isArray(manifest.images) ||
    typeof manifest.images !== 'object'
  )
    throw new Error('Invalid image manifest');
  const knownKeys = [
    'width',
    'height',
    'dimensionSource',
    'source',
    'variants',
    'fallbackReason',
    'digest',
    'aliases'
  ];
  for (const [src, record] of Object.entries(manifest.images)) {
    if (normaliseUrl(src) !== src || !isCdnImage(src))
      throw new Error(`Noncanonical catalogue key: ${src}`);
    if (
      !record ||
      Object.keys(record).some(k => !knownKeys.includes(k)) ||
      !dimension(record.width) ||
      !dimension(record.height) ||
      !['original', 'variant'].includes(record.dimensionSource) ||
      !['mage', 'probe'].includes(record.source) ||
      !Array.isArray(record.variants)
    )
      throw new Error(`Invalid image record: ${src}`);
    if (
      !record.variants.length &&
      (record.dimensionSource !== 'original' || !record.fallbackReason)
    )
      throw new Error(`Unmeasured fallback: ${src}`);
    const seen = new Set();
    for (const v of record.variants) {
      if (
        Object.keys(v).some(k => !['url', 'width', 'height', 'format'].includes(k)) ||
        !IMAGE_FORMATS.includes(v.format) ||
        !dimension(v.width) ||
        !dimension(v.height) ||
        !isCdnImage(v.url) ||
        normaliseUrl(v.url) !== v.url ||
        seen.has(v.url)
      )
        throw new Error(`Invalid variant: ${src}`);
      seen.add(v.url);
    }
    for (const alias of record.aliases || [])
      if (!isCdnImage(alias) || normaliseUrl(alias) !== alias)
        throw new Error(`Invalid alias: ${alias}`);
  }
  buildImageIndex(manifest);
  return manifest;
}
export async function loadManifest(file = 'config/images/manifest.json') {
  return validateManifest(JSON.parse(await fs.readFile(file, 'utf8')));
}
export function buildImageIndex(manifest) {
  const index = new Map(),
    owners = new Map();
  for (const [src, record] of Object.entries(manifest.images)) {
    for (const url of [
      src,
      ...(record.aliases || []),
      ...record.variants.map(v => v.url)
    ]) {
      const key = normaliseUrl(url);
      if (owners.has(key) && owners.get(key) !== src) {
        const other = index.get(key);
        if (!record.digest || record.digest !== other.digest)
          throw new Error(`Ambiguous image identity: ${key}`);
      } else {
        index.set(key, record);
        owners.set(key, src);
      }
    }
  }
  return index;
}
let index = new Map();
export function setImageIndex(value) {
  index = value;
}
export function lookupImage(src) {
  try {
    return index.get(normaliseUrl(src));
  } catch {
    return undefined;
  }
}
export function sortManifest(manifest) {
  return {
    version: 1,
    images: Object.fromEntries(
      Object.entries(manifest.images)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([src, record]) => [
          src,
          {
            ...record,
            variants: [...record.variants].sort(
              (a, b) =>
                a.format.localeCompare(b.format) ||
                a.width - b.width ||
                a.url.localeCompare(b.url)
            ),
            ...(record.aliases ? {aliases: [...record.aliases].sort()} : {})
          }
        ])
    )
  };
}
