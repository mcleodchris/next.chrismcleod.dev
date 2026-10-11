import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire, syncBuiltinESMExports} from 'node:module';
import http from 'node:http';
import https from 'node:https';
import {filesUnder} from './site-sources.js';
const require = createRequire(import.meta.url);
const forbidden = () => {
  throw new Error('Offline build attempted network/image processing');
};
let attempts = 0;
const block = () => {
  attempts++;
  return forbidden();
};
globalThis.fetch = block;
http.request = http.get = https.request = https.get = block;
syncBuiltinESMExports();
const imagePath = require.resolve('@11ty/eleventy-img');
const image = require(imagePath);
const replacement = Object.assign(block, image);
image.Image.prototype.queue = block;
require.cache[imagePath].exports = replacement;
process.env.ELEVENTY_PRODUCTION = 'true';
async function sourceHashes() {
  const files = [
    ...(await filesUnder('src')),
    ...(await filesUnder('data')),
    '.sequoia-state.json',
    'config/images/manifest.json'
  ];
  return JSON.stringify(
    await Promise.all(
      files.map(async file => [
        file,
        createHash('sha256')
          .update(await fs.readFile(file))
          .digest('hex')
      ])
    )
  );
}
const before = await sourceHashes();
const output = await fs.mkdtemp(path.join(os.tmpdir(), 'site-offline-'));
try {
  const {default: Eleventy} = await import('@11ty/eleventy');
  const build = new Eleventy('src', output, {quietMode: true, source: 'cli'});
  await build.write();
  for (const file of ['assets/css/global.css', 'assets/scripts/app.js', 'index.html'])
    await fs.access(path.join(output, file));
  if ((await sourceHashes()) !== before)
    throw new Error('Offline build mutated source or publication state');
  if (attempts) throw new Error(`${attempts} blocked calls were swallowed by the build`);
  console.log(
    'Offline build passed: zero network/processing calls, source and state unchanged, alternate output assets present.'
  );
} finally {
  await fs.rm(output, {recursive: true, force: true});
}
