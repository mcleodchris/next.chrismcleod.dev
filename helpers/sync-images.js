/**
 * Refreshes the committed image manifest, data/images.json.
 *
 * Usage:
 *   MAGE_API_TOKEN=... npm run images:sync [-- --reprobe]
 *
 * 1. Reads every upload record from mage (when MAGE_API_TOKEN is set).
 * 2. Probes CDN image URLs in content that the manifest does not know yet
 *    (--reprobe probes every probe-sourced entry again).
 * 3. Clears the variants of every image whose basename another URL shares,
 *    because the CDN's flat resized/ folder holds only one set per basename.
 * Entries are only ever added or updated, never deleted, and the file is
 * written atomically.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normaliseUrl } from '../config/images/manifest.js';
import {
  collidingBasenames,
  mageEntry,
  mapLimit,
  probeImage,
  scanContentUrls
} from './image-probe.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'data/images.json');

// Load .env when present; variables already in the environment take precedence.
try {
  process.loadEnvFile();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const MAGE_URL = process.env.MAGE_URL || 'https://mage.chrismcleod.dev';
const reprobe = process.argv.includes('--reprobe');

const manifest = fs.existsSync(MANIFEST)
  ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
  : { version: 1, images: {} };
const images = manifest.images;
const counts = { mage: 0, probed: 0, collisions: 0, unreachable: 0 };

// 1. mage
const token = process.env.MAGE_API_TOKEN;
if (!token) {
  console.warn('[images:sync] MAGE_API_TOKEN is not set; skipping mage');
} else {
  try {
    const response = await fetch(`${MAGE_URL}/images/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const records = await response.json();
    if (!Array.isArray(records)) {
      console.error('[images:sync] mage response is not an array; nothing written');
      process.exit(1);
    }
    if (!records.length && Object.values(images).some(entry => entry.source === 'mage')) {
      console.warn('[images:sync] suspicious empty response from mage; no mage entries changed');
    }
    for (const record of records) {
      const entry = mageEntry(record);
      if (!entry) continue;
      images[normaliseUrl(record.original)] = entry;
      counts.mage++;
    }
  } catch (error) {
    console.warn(`[images:sync] could not read mage (${error.message}); continuing without it`);
  }
}

// 2. probe
const contentUrls = scanContentUrls();
const toProbe = contentUrls.filter(url =>
  reprobe ? images[url]?.source !== 'mage' : !images[url]
);
if (toProbe.length) console.log(`[images:sync] probing ${toProbe.length} images…`);
const unreachable = [];
await mapLimit(toProbe, 4, async url => {
  try {
    images[url] = await probeImage(url);
    counts.probed++;
  } catch (error) {
    unreachable.push(`${url} (${error.message})`);
  }
});
counts.unreachable = unreachable.length;

// 3. collisions
const colliding = [...collidingBasenames([...Object.keys(images), ...contentUrls]).values()].flat();
for (const url of colliding) {
  if (images[url]) images[url].variants = {};
}
counts.collisions = colliding.length;

// write
const sorted = Object.fromEntries(Object.keys(images).sort().map(url => [url, images[url]]));
const next = `${JSON.stringify({ version: 1, images: sorted }, null, 2)}\n`;
const current = fs.existsSync(MANIFEST) ? fs.readFileSync(MANIFEST, 'utf8') : '';
if (next !== current) {
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(`${MANIFEST}.tmp`, next);
  fs.renameSync(`${MANIFEST}.tmp`, MANIFEST);
}

if (colliding.length) console.log(`[images:sync] shared basenames, rendered without variants:\n  ${colliding.join('\n  ')}`);
if (unreachable.length) console.warn(`[images:sync] could not download, no entry written:\n  ${unreachable.join('\n  ')}`);
console.log(
  `[images:sync] ${Object.keys(sorted).length} entries; ${counts.mage} from mage, ${counts.probed} probed, ` +
    `${counts.collisions} collision-only, ${counts.unreachable} unreachable; ` +
    (next === current ? 'no change' : 'data/images.json updated')
);
