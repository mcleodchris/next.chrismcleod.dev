/**
 * Milestone 6 prototype: build manifest entries in memory for representative
 * images, render them, and check every URL in the markup answers 200.
 * Throwaway; deleted once the manifest is in use.
 */

import { probeImage, collidingBasenames, scanContentUrls } from './image-probe.js';

const CDN = 'https://assets.chrismcleod.dev/chrismcleod.dev';
const samples = [
  ['mage upload', `${CDN}/assets/71432c05-ff6b-4bbe-bcfb-e5cc4d0410fc.png`],
  ['large legacy', `${CDN}/assets/images/2014/05/bloodspire_2560x1440.jpg`],
  ['small legacy', `${CDN}/assets/images/2015/01/silverlight-upgrade-warning.png`],
  ['colliding', `${CDN}/2021/08/image.png`]
];

const colliding = new Set([...collidingBasenames(scanContentUrls()).values()].flat());

const images = {};
for (const [, url] of samples) {
  const entry = await probeImage(url);
  if (colliding.has(url)) entry.variants = {};
  images[url] = entry;
}

// The renderer reads entries through loadManifest's cached object, so add
// the in-memory entries to it.
const { loadManifest } = await import('../config/images/manifest.js');
const { renderPicture } = await import('../config/images/picture.js');
Object.assign(loadManifest().images, images);

console.log(`colliding URLs in content: ${colliding.size}`);
for (const [label, url] of samples) {
  const html = renderPicture({ src: url, alt: label });
  console.log(`\n== ${label}: ${url}\n${JSON.stringify(images[url])}\n${html}`);
  const urls = new Set();
  for (const [, value] of html.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
    value.split(',').forEach(part => urls.add(part.trim().split(' ')[0]));
  }
  for (const u of urls) {
    const response = await fetch(u, { method: 'HEAD' });
    console.log(`  ${response.status} ${u}`);
  }
}
