import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import Image from '@11ty/eleventy-img';
import {inventorySources} from './site-sources.js';
import {
  isCdnImage,
  normaliseUrl,
  validateManifest,
  sortManifest,
  buildImageIndex
} from '../config/images/manifest.js';
import {atomicJson, readJson, requestPublic} from './sync-utils.js';
export function legacyCandidates(src, width) {
  const name = new URL(src).pathname.split('/').pop().split('.')[0];
  return ['avif', 'webp', 'jpeg'].flatMap(format =>
    [...new Set([320, 570, 650, 820, 960, 1200, width])]
      .filter(w => w <= width)
      .map(w => ({
        format,
        url: `https://assets.chrismcleod.dev/chrismcleod.dev/assets/resized/${name}-${w}.${format}`
      }))
  );
}
export async function backfillImages({
  destination = 'config/images/manifest.json',
  report = '/tmp/site-maintenance/legacy-images.json',
  reprobe = false,
  checkpoint,
  sources,
  fetchImpl = fetch
} = {}) {
  const previous = validateManifest(
    await readJson(destination, {version: 1, images: {}})
  );
  const urls = [
    ...new Set(
      (sources || (await inventorySources()).originals)
        .filter(isCdnImage)
        .map(normaliseUrl)
    )
  ].sort();
  // Four workers, each awaiting the entire response body, cap requests at four.
  const request = (url, opts) => requestPublic(url, {...opts, fetchImpl});
  const cached =
    checkpoint && !reprobe ? await readJson(checkpoint, {images: {}}) : {images: {}};
  for (const [src, record] of Object.entries(cached.images))
    validateManifest({version: 1, images: {[src]: record}});
  const existingIndex = buildImageIndex(previous);
  // A checkpoint predating a verified identity merge must not resurrect its old key.
  const images = {
      ...Object.fromEntries(
        Object.entries(cached.images).filter(([src]) => !existingIndex.has(src))
      ),
      ...previous.images
    },
    unresolved = [],
    results = [],
    probes = new Map();
  const pending = urls.filter(
    src =>
      (!existingIndex.has(src) && !images[src]) ||
      (reprobe && images[src]?.source === 'probe')
  );
  let position = 0;
  await Promise.all(
    Array.from({length: Math.min(4, pending.length)}, async () => {
      while (position < pending.length) {
        const src = pending[position++];
        try {
          const bytes = await request(src);
          if (!bytes) throw new Error('Original returned HTTP 404');
          const {width, height} = Image.ImageSize(bytes);
          const digest = createHash('sha256').update(bytes).digest('hex');
          probes.set(src, {width, height, digest, variants: []});
        } catch (e) {
          unresolved.push({src, error: e.message});
        }
      }
    })
  );
  const candidateOwners = new Map();
  for (const src of urls) {
    const measured = probes.get(src) || images[src];
    if (!measured) continue;
    for (const candidate of legacyCandidates(src, measured.width)) {
      candidateOwners.set(candidate.url, [
        ...(candidateOwners.get(candidate.url) || []),
        {src, digest: measured.digest}
      ]);
    }
  }
  position = 0;
  const measuredUrls = [...probes.keys()];
  await Promise.all(
    Array.from({length: Math.min(4, measuredUrls.length)}, async () => {
      while (position < measuredUrls.length) {
        const src = measuredUrls[position++],
          original = probes.get(src);
        try {
          let ambiguous = false;
          for (const candidate of legacyCandidates(src, original.width)) {
            const owners = candidateOwners.get(candidate.url);
            if (
              owners.length > 1 &&
              owners.some(o => !o.digest || o.digest !== original.digest)
            ) {
              ambiguous = true;
              continue;
            }
            if (!(await request(candidate.url, {method: 'HEAD'}))) continue;
            const bytes = await request(candidate.url);
            if (!bytes) throw new Error(`Variant disappeared: ${candidate.url}`);
            const {width, height} = Image.ImageSize(bytes);
            if (
              width > original.width ||
              Math.abs(width / height - original.width / original.height) > 0.025
            )
              continue;
            original.variants.push({...candidate, width, height});
          }
          const {width, height, digest, variants} = original;
          // A literal derivative reference is already a measured original. Never guess its parent.
          images[src] = {
            width,
            height,
            digest,
            variants,
            dimensionSource: 'original',
            source: 'probe',
            ...(!variants.length
              ? {
                  fallbackReason: ambiguous
                    ? 'ambiguous-derivative'
                    : 'no-verified-variants'
                }
              : {})
          };
          results.push({
            src,
            variants: variants.length,
            fallbackReason: images[src].fallbackReason
          });
          console.log(
            `Resolved ${results.length}/${pending.length}: ${src} (${variants.length} variants)`
          );
        } catch (e) {
          unresolved.push({src, error: e.message});
        }
      }
    })
  );
  if (checkpoint) await atomicJson(checkpoint, {version: 1, images});
  // Referenced derivatives already present as verified variants are aliases of their parent.
  for (const [src, record] of Object.entries(images)) {
    const owner = Object.entries(images).find(
      ([other, r]) =>
        other !== src &&
        r.variants.some(
          v => v.url === src && v.width === record.width && v.height === record.height
        )
    );
    if (owner && !record.variants.length) delete images[src];
  }
  const manifest = validateManifest(sortManifest({version: 1, images}));
  const index = buildImageIndex(manifest);
  await atomicJson(destination, manifest);
  await atomicJson(report, {
    referenced: urls.length,
    resolved: urls.filter(s => index.has(s)).length,
    unresolved,
    results
  });
  return {manifest, unresolved};
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = process.argv.find(a => a.startsWith('--report='))?.slice(9);
  backfillImages({
    report,
    checkpoint: '/tmp/site-maintenance/backfill-progress.json',
    reprobe: process.argv.includes('--reprobe')
  })
    .then(({unresolved}) => {
      console.log(`Unresolved: ${unresolved.length}`);
      if (unresolved.length) process.exitCode = 1;
    })
    .catch(e => {
      console.error(e);
      process.exitCode = 1;
    });
}
