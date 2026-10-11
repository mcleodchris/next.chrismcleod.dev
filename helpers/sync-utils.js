import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
export async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (e) {
    if (e.code === 'ENOENT' && fallback !== undefined) return fallback;
    throw e;
  }
}
export async function atomicJson(file, data) {
  await fs.mkdir(path.dirname(file), {recursive: true});
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporary, JSON.stringify(data, null, 2) + '\n');
    await fs.rename(temporary, file);
  } finally {
    await fs.rm(temporary, {force: true});
  }
}
export async function mageRequest(
  endpoint,
  {
    fetchImpl = fetch,
    token = process.env.MAGE_API_TOKEN,
    baseUrl = process.env.MAGE_URL || 'https://mage.chrismcleod.dev'
  } = {}
) {
  if (!token) throw new Error('MAGE_API_TOKEN is required for explicit sync');
  const response = await fetchImpl(`${baseUrl}${endpoint}`, {
    headers: {Authorization: `Bearer ${token}`},
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(`Mage ${endpoint}: HTTP ${response.status}`);
  return response.json();
}

/** Fetch public CDN bytes with bounded retry/timeout; never sends Mage credentials. */
export async function requestPublic(url, {method = 'GET', fetchImpl = fetch} = {}) {
  let error;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetchImpl(url, {method, signal: AbortSignal.timeout(10000)});
      if (r.status === 404) return null;
      if (!r.ok) {
        if (r.status < 500 && r.status !== 429)
          throw new Error(`HTTP ${r.status} for ${url}`);
        error = new Error(`HTTP ${r.status} for ${url}`);
        continue;
      }
      return method === 'HEAD' ? true : Buffer.from(await r.arrayBuffer());
    } catch (e) {
      error = e;
      if (e.message?.startsWith('HTTP 4') && !e.message.startsWith('HTTP 429')) throw e;
    }
  }
  throw error;
}
