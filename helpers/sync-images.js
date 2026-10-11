import 'dotenv/config';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {
  IMAGE_FORMATS,
  validateManifest,
  normaliseUrl,
  isCdnImage,
  sortManifest
} from '../config/images/manifest.js';
import {atomicJson, readJson, mageRequest, requestPublic} from './sync-utils.js';
/** Project public Mage metadata; pruning missing Mage originals requires explicit review. */
export function projectMageImages(
  data,
  previous = {version: 1, images: {}},
  {allowShrink = false} = {}
) {
  if (!Array.isArray(data) || !data.length)
    throw new Error('Empty/malformed Mage image response');
  const images = {...previous.images},
    incoming = new Set();
  for (const item of data) {
    if (
      !item ||
      !isCdnImage(item.original) ||
      !item.metadata ||
      typeof item.metadata !== 'object'
    )
      throw new Error('Malformed Mage record');
    const src = normaliseUrl(item.original);
    if (incoming.has(src)) throw new Error(`Duplicate Mage original: ${src}`);
    incoming.add(src);
    const variants = [];
    for (const [format, entries] of Object.entries(item.metadata)) {
      if (!IMAGE_FORMATS.includes(format)) continue;
      if (!Array.isArray(entries)) throw new Error(`Invalid Mage format: ${src}`);
      for (const v of entries)
        variants.push({
          format,
          url: normaliseUrl(v.url),
          width: v.width,
          height: v.height
        });
    }
    if (!variants.length) throw new Error(`Mage record has no variants: ${src}`);
    const widest = variants.reduce((a, b) => (a.width > b.width ? a : b));
    const measured = previous.images[src];
    // Keep verified historical URLs resolvable even when Mage regenerates variants.
    const currentUrls = new Set([src, ...variants.map(v => v.url)]);
    const aliases = [
      ...new Set([
        ...(measured?.aliases || []),
        ...(measured?.variants || []).map(v => v.url)
      ])
    ].filter(url => !currentUrls.has(url));
    images[src] =
      measured?.dimensionSource === 'original'
        ? {...measured, source: 'mage', variants}
        : {
            width: widest.width,
            height: widest.height,
            dimensionSource: 'variant',
            source: 'mage',
            variants
          };
    if (aliases.length) images[src].aliases = aliases;
    else delete images[src].aliases;
  }
  const missing = Object.entries(previous.images).filter(
    ([src, r]) => r.source === 'mage' && !incoming.has(src)
  );
  if (missing.length && !allowShrink)
    throw new Error(
      `Shrinking Mage response (${missing.length} missing); previous catalogue retained`
    );
  for (const [src] of missing) delete images[src];
  return validateManifest(sortManifest({version: 1, images}));
}
export async function syncImages({
  destination = 'config/images/manifest.json',
  allowShrink = false,
  ...request
} = {}) {
  const previous = validateManifest(
    await readJson(destination, {version: 1, images: {}})
  );
  const data = await mageRequest('/images/list', request);
  // Prove doubled-slash aliases against downloaded original bytes before merging identities.
  if (Array.isArray(data))
    for (const item of data) {
      if (!isCdnImage(item?.original)) continue;
      const src = normaliseUrl(item.original);
      if (previous.images[src]) continue;
      const url = new URL(src);
      const equivalent = Object.entries(previous.images).find(([old, record]) => {
        const oldUrl = new URL(old);
        return (
          record.digest &&
          oldUrl.pathname.replace(/\/+/g, '/') === url.pathname.replace(/\/+/g, '/') &&
          oldUrl.search === url.search
        );
      });
      if (!equivalent) continue;
      const [alias, record] = equivalent;
      const bytes = await requestPublic(src, {fetchImpl: request.fetchImpl || fetch});
      if (!bytes || createHash('sha256').update(bytes).digest('hex') !== record.digest)
        throw new Error(`Conflicting doubled-slash image identity: ${src}`);
      delete previous.images[alias];
      previous.images[src] = {
        ...record,
        aliases: [...new Set([...(record.aliases || []), alias])]
      };
    }
  const manifest = projectMageImages(data, previous, {allowShrink});
  await atomicJson(destination, manifest);
  return manifest;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  syncImages({allowShrink: process.argv.includes('--allow-shrink')})
    .then(m => console.log(`Saved ${Object.keys(m.images).length} image records`))
    .catch(e => {
      console.error(e.message);
      process.exitCode = 1;
    });
