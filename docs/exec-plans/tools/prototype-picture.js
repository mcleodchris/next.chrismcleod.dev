// Archived migration verification tool; not used by builds or production release.
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {
  loadManifest,
  buildImageIndex,
  setImageIndex,
  validateManifest
} from '../../../config/images/manifest.js';
import {renderPicture} from '../../../config/images/picture.js';
const catalogue = await loadManifest();
const examples = [
  'https://assets.chrismcleod.dev/mage-test.png',
  'https://assets.chrismcleod.dev/chrismcleod.dev/assets/images/2015/01/silverlight-upgrade-warning.png',
  'https://assets.chrismcleod.dev/chrismcleod.dev/2021/08/image.png'
];
const fixtures = {
  version: 1,
  images: {
    [examples[0]]: {
      width: 600,
      height: 400,
      dimensionSource: 'variant',
      source: 'mage',
      variants: [
        {
          format: 'webp',
          url: 'https://assets.chrismcleod.dev/mage-test-300.webp',
          width: 300,
          height: 200
        }
      ]
    }
  }
};
for (const src of examples.slice(1)) {
  assert.ok(catalogue.images[src], `Missing measured prototype: ${src}`);
  fixtures.images[src] = catalogue.images[src];
}
validateManifest(fixtures);
setImageIndex(buildImageIndex(fixtures));
for (const src of examples) {
  const html = renderPicture({src, alt: 'Prototype'});
  assert.ok(!html.includes('undefined'));
  assert.match(html, /height="\d+"/);
  console.log(src, html);
}
assert.equal(catalogue.images[examples[2]].fallbackReason, 'ambiguous-derivative');
const synthetic = {
  version: 1,
  images: Object.fromEntries(
    Array.from({length: 10000}, (_, i) => [
      `https://assets.chrismcleod.dev/synthetic-${i}.png`,
      {
        width: 320,
        height: 200,
        source: 'probe',
        dimensionSource: 'original',
        variants: [],
        fallbackReason: 'benchmark'
      }
    ])
  )
};
for (const [name, m] of [
  ['catalogue', catalogue],
  ['synthetic', synthetic]
]) {
  const bytes = JSON.stringify(m).length,
    start = performance.now();
  const index = buildImageIndex(validateManifest(JSON.parse(JSON.stringify(m))));
  setImageIndex(index);
  const loaded = performance.now();
  const src = Object.keys(m.images)[0];
  for (let i = 0; i < 10000; i++) renderPicture({src, alt: 'Bench'});
  console.log(
    JSON.stringify({
      name,
      records: Object.keys(m.images).length,
      bytes,
      loadAndIndexMs: loaded - start,
      lookupAndRender10000Ms: performance.now() - loaded
    })
  );
}
