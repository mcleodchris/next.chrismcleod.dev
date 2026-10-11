import fs from 'node:fs/promises';
export function validateHobby(snapshot) {
  if (snapshot?.version !== 1 || !Array.isArray(snapshot.items))
    throw new Error('Invalid hobby snapshot');
  for (const item of snapshot.items) {
    if (
      typeof item.game !== 'string' ||
      typeof item.item !== 'string' ||
      !Number.isInteger(item.modelCount) ||
      item.modelCount < 1 ||
      typeof item.completedDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(item.completedDate) ||
      !Number.isFinite(Date.parse(item.completedDate)) ||
      new Date(item.completedDate).toISOString().slice(0, 10) !==
        item.completedDate.slice(0, 10)
    )
      throw new Error('Invalid hobby item');
  }
  return snapshot;
}
let snapshotPromise;
export function resetHobbySnapshot() {
  snapshotPromise = undefined;
}
export function loadHobbySnapshot() {
  return (snapshotPromise ??= fs
    .readFile('data/hobby.json', 'utf8')
    .then(JSON.parse)
    .then(validateHobby)
    .catch(error => {
      if (error.code !== 'ENOENT') throw error;
      console.warn('Paintslam snapshot is missing; run npm run data:sync.');
      return {version: 1, items: []};
    }));
}
export function groupHobbyByYear(snapshot) {
  const years = {};
  for (const item of [...snapshot.items].sort(
    (a, b) =>
      a.completedDate.localeCompare(b.completedDate) || a.item.localeCompare(b.item)
  )) {
    const year = String(new Date(item.completedDate).getUTCFullYear());
    (years[year] ??= []).push(item);
  }
  return years;
}
