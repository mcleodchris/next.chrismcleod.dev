import 'dotenv/config';
import {pathToFileURL} from 'node:url';
import {validateHobby} from '../config/data/hobby.js';
import {atomicJson, readJson, mageRequest} from './sync-utils.js';
export async function syncHobby({
  destination = 'data/hobby.json',
  allowEmpty = false,
  ...request
} = {}) {
  const data = await mageRequest('/hobby', request);
  if (!Array.isArray(data)) throw new Error('Mage hobby response must be an array');
  const snapshot = validateHobby({
    version: 1,
    items: data
      .map(i => ({
        game: i.game,
        item: i.item,
        modelCount: Number(i.modelCount),
        // Historical Mage imports use a SQL-style space before the UTC time.
        completedDate:
          typeof i.completedDate === 'string'
            ? i.completedDate.replace(/^(\d{4}-\d{2}-\d{2}) (?=\d{2}:\d{2}:\d{2})/, '$1T')
            : i.completedDate
      }))
      .sort(
        (a, b) =>
          a.completedDate.localeCompare(b.completedDate) || a.item.localeCompare(b.item)
      )
  });
  const previous = await readJson(destination, {items: []});
  if (
    !allowEmpty &&
    (!snapshot.items.length || snapshot.items.length < previous.items.length)
  )
    throw new Error(
      'Empty or shrinking hobby response; last-good snapshot retained (review before --allow-empty)'
    );
  await atomicJson(destination, snapshot);
  return snapshot;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  syncHobby({allowEmpty: process.argv.includes('--allow-empty')})
    .then(s => console.log(`Saved ${s.items.length} hobby items`))
    .catch(e => {
      console.error(e.message);
      process.exitCode = 1;
    });
