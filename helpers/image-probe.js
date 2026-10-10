/**
 * Facts about images on the CDN, for building the image manifest
 * (config/images/manifest.js describes its format).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Image from '@11ty/eleventy-img';
import {
  CANDIDATE_WIDTHS,
  FORMATS,
  basenameOf,
  normaliseUrl,
  variantUrl
} from '../config/images/manifest.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CDN_IMAGE = /https:\/\/assets\.chrismcleod\.dev\/[^"')\s]+\.(?:png|jpe?g|gif|webp|avif)/gi;

/** Every CDN image URL written in a .md or .njk file under src/, normalised. */
export const scanContentUrls = () => {
  const urls = new Set();
  const walk = folder => {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const full = path.join(folder, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(md|njk)$/.test(entry.name)) {
        for (const [url] of fs.readFileSync(full, 'utf8').matchAll(CDN_IMAGE)) {
          urls.add(normaliseUrl(url));
        }
      }
    }
  };
  walk(path.join(ROOT, 'src'));
  return [...urls].sort();
};

const exists = async url => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Downloads the original to read its size, then checks which variants exist.
 * Returns a manifest entry, or throws if the original cannot be downloaded.
 */
export const probeImage = async url => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const size = Image.ImageSize(Buffer.from(await response.arrayBuffer()));
  // Variants are generated upright, so an EXIF rotation swaps the axes.
  const rotated = size.orientation >= 5;
  const width = rotated ? size.height : size.width;
  const height = rotated ? size.width : size.height;

  const widths = [...new Set([...CANDIDATE_WIDTHS, width])].sort((a, b) => a - b);
  const variants = {};
  for (const format of FORMATS) {
    variants[format] = [];
    for (const w of widths) {
      if (await exists(variantUrl(url, w, format))) variants[format].push(w);
    }
  }
  return { width, height, variants, source: 'probe' };
};

/** A manifest entry from one mage `/images/list` record, or undefined if it is unusable. */
export const mageEntry = record => {
  if (typeof record?.original !== 'string' || typeof record.metadata !== 'object' || !record.metadata) {
    return undefined;
  }
  const variants = {};
  const all = [];
  for (const [format, items] of Object.entries(record.metadata)) {
    if (!Array.isArray(items) || !items.length) continue;
    variants[format] = items.map(item => item.width).sort((a, b) => a - b);
    all.push(...items.map(item => ({ ...item, format })));
  }
  if (!all.length) return undefined;
  const widest = items => items.reduce((a, b) => (b.width > a.width ? b : a));
  const reference = widest(all.filter(item => item.format === 'jpeg').length
    ? all.filter(item => item.format === 'jpeg')
    : all);
  const entry = { width: reference.width, height: reference.height, variants, source: 'mage' };
  // mage's URLs sometimes contain `//resized`; the CDN treats that as `/resized`.
  const odd = all
    .map(item => ({ ...item, url: normaliseUrl(item.url) }))
    .find(item => item.url !== variantUrl(record.original, item.width, item.format));
  if (odd) entry.resizedBase = odd.url.slice(0, odd.url.lastIndexOf('/'));
  return entry;
};

/** Maps each basename shared by more than one distinct URL to those URLs. */
export const collidingBasenames = urls => {
  const groups = new Map();
  for (const url of new Set(urls)) {
    const name = basenameOf(url);
    groups.set(name, [...(groups.get(name) ?? []), url]);
  }
  return new Map([...groups].filter(([, members]) => members.length > 1));
};

/** Runs `task` over `items` with at most `limit` in flight. */
export const mapLimit = async (items, limit, task) => {
  const results = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index], index);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
};
