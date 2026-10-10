/**
 * Refreshes the committed Paintslam snapshot, data/hobby.json, from mage.
 *
 * Usage:
 *   MAGE_API_TOKEN=... npm run data:sync [-- --allow-empty]
 *
 * Builds never fetch this data; they read the snapshot. On any failure the
 * snapshot is left unchanged and the script exits with code 1. An empty
 * response never replaces a non-empty snapshot unless --allow-empty is given,
 * because mage answers with an empty array when its database query fails.
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SNAPSHOT = path.join(ROOT, 'data/hobby.json');
const MAGE_URL = process.env.MAGE_URL || 'https://mage.chrismcleod.dev';
const allowEmpty = process.argv.includes('--allow-empty');

const fail = message => {
  console.error(`[data:sync] ${message}; data/hobby.json unchanged`);
  process.exit(1);
};

/** Groups entries by completion year, each year sorted by completion date. */
const byYear = entries => {
  const years = {};
  for (const entry of entries) {
    const year = new Date(entry.completedDate).getFullYear();
    (years[year] ??= []).push({ ...entry, modelCount: parseInt(entry.modelCount, 10) });
  }
  for (const year in years) {
    years[year].sort((a, b) => new Date(a.completedDate) - new Date(b.completedDate));
  }
  return years;
};

const isEntry = entry =>
  entry && typeof entry === 'object' &&
  ['completedDate', 'game', 'item', 'modelCount'].every(key => key in entry);

const token = process.env.MAGE_API_TOKEN;
if (!token) fail('MAGE_API_TOKEN is not set');

let entries;
try {
  const response = await fetch(`${MAGE_URL}/hobby`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) fail(`mage answered HTTP ${response.status}`);
  entries = await response.json();
} catch (error) {
  fail(`request failed: ${error.message}`);
}

if (!Array.isArray(entries)) fail('response is not an array');
const invalid = entries.findIndex(entry => !isEntry(entry));
if (invalid !== -1) fail(`entry ${invalid} lacks completedDate, game, item or modelCount`);

const existing = fs.existsSync(SNAPSHOT) ? JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8')) : {};
if (entries.length === 0 && Object.keys(existing).length > 0 && !allowEmpty) {
  fail('mage returned no entries but the snapshot has some (pass --allow-empty to accept)');
}

const next = `${JSON.stringify(byYear(entries), null, 2)}\n`;
const current = fs.existsSync(SNAPSHOT) ? fs.readFileSync(SNAPSHOT, 'utf8') : '';
if (next === current) {
  console.log(`[data:sync] ${entries.length} entries; no change`);
} else {
  fs.mkdirSync(path.dirname(SNAPSHOT), { recursive: true });
  fs.writeFileSync(`${SNAPSHOT}.tmp`, next);
  fs.renameSync(`${SNAPSHOT}.tmp`, SNAPSHOT);
  console.log(`[data:sync] ${entries.length} entries; data/hobby.json updated`);
}
