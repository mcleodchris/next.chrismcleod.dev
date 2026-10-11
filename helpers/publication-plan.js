import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {filesUnder, frontmatter} from './site-sources.js';
import {readJson, atomicJson} from './sync-utils.js';
export const contentHash = text => createHash('sha256').update(text).digest('hex');
export async function publicationPlan({
  now = new Date(),
  root = 'src/posts',
  stateFile = '.sequoia-state.json',
  configFile = 'sequoia.json'
} = {}) {
  const state = await readJson(stateFile),
    config = await readJson(configFile),
    actions = [],
    issues = [];
  for (const file of (await filesUnder(root)).filter(f => f.endsWith('.md'))) {
    const text = await fs.readFile(file, 'utf8'),
      {data} = frontmatter(text),
      saved = state.posts[file],
      hash = contentHash(text);
    if (data.draft) continue;
    if (saved?.contentHash === hash) continue;
    const action = !saved || !data.atUri ? 'create' : 'update';
    if (data.atUri && !saved)
      issues.push(`Existing atUri lacks publication state: ${file}`);
    if (saved && saved.atUri !== data.atUri)
      issues.push(`State/front matter atUri mismatch: ${file}`);
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - (config.bluesky?.maxAgeDays ?? 7));
    const announcement = Boolean(
      config.bluesky?.enabled && !saved?.bskyPostRef && !(new Date(data.date) < cutoff)
    );
    actions.push({
      file,
      action,
      title: data.title,
      atUri: data.atUri ?? null,
      hash,
      announcement
    });
  }
  return {actions, issues};
}
export function checkDryRun(log, plan) {
  const text = log.replace(/\x1b\[[0-9;]*m/g, '');
  if (plan.issues.length) throw new Error(plan.issues.join('\n'));
  if (
    !plan.actions.length &&
    text.includes('All posts are up to date. Nothing to publish.')
  )
    return;
  if (!text.includes('Dry run complete. No changes made.'))
    throw new Error('Sequoia did not confirm a valid complete dry run');
  const lines = text.split('\n').filter(line => /^\s*[│|]?\s*[+~] /.test(line));
  if (lines.length !== plan.actions.length)
    throw new Error('Sequoia proposed action count differs from local plan');
  for (const action of plan.actions) {
    const matches = lines.filter(line =>
      line.includes(`${action.action === 'create' ? '+' : '~'} ${action.title} (`)
    );
    if (
      matches.length !== 1 ||
      matches[0].includes('[bsky: will post]') !== action.announcement
    )
      throw new Error(`Unmatched publication/announcement: ${action.file}`);
  }
}
export async function assertMigrationApproval(
  plan,
  approval,
  migrationFile = 'test/fixtures/publication-migration.json'
) {
  const migration = await readJson(migrationFile, {files: []});
  if (migration.reviewStatus === 'published') return;
  const affected = plan.actions.filter(action =>
    migration.files.some(f => f.file === action.file)
  );
  if (!affected.length) return;
  if (contentHash(JSON.stringify(migration.files)) !== migration.reviewDigest)
    throw new Error('Migration review digest does not match its recorded files');
  for (const action of affected) {
    const expected = migration.files.find(file => file.file === action.file);
    if (
      action.hash !== expected.hash ||
      action.action !== expected.action ||
      action.announcement !== expected.announcement
    )
      throw new Error(
        `Migrated publication differs from reviewed expectation: ${action.file}`
      );
  }
  if (approval !== migration.reviewDigest)
    throw new Error(
      `Image migration publication awaits owner review. Set repository variable IMAGE_MIGRATION_APPROVED to reviewed digest ${migration.reviewDigest}.`
    );
}
export async function markMigrationPublished({
  migrationFile = 'test/fixtures/publication-migration.json',
  stateFile = '.sequoia-state.json'
} = {}) {
  const migration = await readJson(migrationFile, {files: []});
  if (migration.reviewStatus === 'published' || !migration.files.length) return;
  const state = await readJson(stateFile);
  if (migration.files.some(file => state.posts?.[file.file]?.contentHash !== file.hash))
    throw new Error(
      'Migration publication is incomplete; preserving state before recovery'
    );
  await atomicJson(migrationFile, {...migration, reviewStatus: 'published'});
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const plan = await publicationPlan(),
      output = process.argv.find(a => a.startsWith('--out='))?.slice(6),
      dryRun = process.argv.find(a => a.startsWith('--dry-run='))?.slice(10);
    if (output) await atomicJson(output, plan);
    else console.log(JSON.stringify(plan, null, 2));
    if (dryRun) {
      checkDryRun(await fs.readFile(dryRun, 'utf8'), plan);
      await assertMigrationApproval(plan, process.env.IMAGE_MIGRATION_APPROVED);
    }
    if (plan.issues.length) process.exitCode = 1;
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
