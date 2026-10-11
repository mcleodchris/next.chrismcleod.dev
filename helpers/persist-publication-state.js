import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
export const permittedGeneratedPath = file =>
  file === '.sequoia-state.json' ||
  file === 'config/images/manifest.json' ||
  file === 'data/hobby.json' ||
  file === 'test/fixtures/publication-migration.json' ||
  /^src\/posts\/[^/]+\.md$/.test(file) ||
  /^src\/assets\/images\/social-preview\/[^/]+\.jpeg$/.test(file) ||
  file === 'src/assets/helperfiles/.well-known/site.standard.publication';
export function changedFiles(
  git = (...args) => execFileSync('git', args, {encoding: 'utf8'})
) {
  const entries = git('status', '--porcelain=v1', '-z').split('\0').filter(Boolean);
  const changes = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i],
      status = entry.slice(0, 2);
    changes.push({
      status,
      file: entry.slice(3),
      ...(/[RC]/.test(status) ? {previousFile: entries[++i]} : {})
    });
  }
  return changes;
}
export async function persistPublicationState({
  recoveryDir = '/tmp/site-publication-recovery',
  git = (...args) => execFileSync('git', args, {encoding: 'utf8'})
} = {}) {
  const changed = changedFiles(git);
  if (!changed.length) return;
  const rejected = changed.filter(
    ({file, previousFile}) => previousFile || !permittedGeneratedPath(file)
  );
  const safe = changed.filter(
    ({file, previousFile}) => !previousFile && permittedGeneratedPath(file)
  );
  // Prepare exact recoverable bytes before Git can fail, including after a local commit.
  await fs.mkdir(recoveryDir, {recursive: true});
  await fs.writeFile(
    path.join(recoveryDir, 'files.json'),
    JSON.stringify(safe, null, 2) + '\n'
  );
  await fs.writeFile(path.join(recoveryDir, 'base.txt'), git('rev-parse', 'HEAD'));
  await fs.writeFile(
    path.join(recoveryDir, 'changes.patch'),
    safe.length ? git('diff', '--binary', 'HEAD', '--', ...safe.map(c => c.file)) : ''
  );
  for (const {file, status} of safe) {
    if (status.includes('D')) continue;
    const target = path.join(recoveryDir, 'files', file);
    await fs.mkdir(path.dirname(target), {recursive: true});
    await fs.copyFile(file, target);
  }
  if (rejected.length)
    throw new Error(
      `Unexpected generated file; refusing to stage: ${rejected.map(({file}) => file).join(', ')}`
    );
  git('add', '--', ...safe.map(c => c.file));
  git('commit', '-m', 'Persist publication and prepared site data [skip ci]');
  git('push'); // Reject non-fast-forward; never force or rebase published state.
  await fs.writeFile(path.join(recoveryDir, 'persisted.txt'), git('rev-parse', 'HEAD'));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  persistPublicationState().catch(e => {
    console.error(e.message);
    process.exitCode = 1;
  });
