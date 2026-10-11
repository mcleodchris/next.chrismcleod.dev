import fs from 'fs';

/**
 * Paintslam entries grouped by completion year, read from the committed
 * snapshot that `npm run data:sync` refreshes. Builds never fetch them.
 */
export default function () {
  const snapshot = new URL('../../data/hobby.json', import.meta.url);
  return fs.existsSync(snapshot) ? JSON.parse(fs.readFileSync(snapshot, 'utf8')) : {};
}
