import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {
  publicationPlan,
  checkDryRun,
  assertMigrationApproval,
  markMigrationPublished
} from './publication-plan.js';
import {
  persistPublicationState,
  changedFiles,
  permittedGeneratedPath
} from './persist-publication-state.js';
/** Refuse unrelated edits/renames before any publisher is invoked. */
export function assertPreparedChanges(changes) {
  const unexpected = changes.filter(
    ({file, previousFile}) => previousFile || !permittedGeneratedPath(file)
  );
  if (unexpected.length)
    throw new Error(
      `Unrelated changes before publication: ${unexpected.map(({file, previousFile}) => (previousFile ? `${previousFile} -> ${file}` : file)).join(', ')}`
    );
}
export async function runPublicationPipeline({
  preflight,
  dryRun,
  publish,
  persist,
  finalBuild
}) {
  await preflight();
  await dryRun();
  let publicationError;
  try {
    await publish();
  } catch (error) {
    publicationError = error;
  }
  // A failed publisher may have completed some external writes. Preserve their state too.
  await persist({publicationSucceeded: !publicationError});
  if (publicationError) throw publicationError;
  await finalBuild();
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const command = (cmd, args) =>
    execFileSync(cmd, args, {
      stdio: 'inherit',
      env:
        cmd === 'npm'
          ? Object.fromEntries(
              Object.entries(process.env).filter(
                ([key]) => !/^(ATP_|PDS_|MAGE_|IMAGE_MIGRATION_APPROVED)/.test(key)
              )
            )
          : process.env
    });
  runPublicationPipeline({
    preflight: () => {
      command('npm', ['run', 'build']);
      command('npm', ['run', 'check']);
    },
    dryRun: async () => {
      assertPreparedChanges(changedFiles());
      const plan = await publicationPlan();
      if (plan.issues.length) throw Error(plan.issues.join('\n'));
      // Gate before contacting the publisher. Review covers this exact migration wave.
      await assertMigrationApproval(plan, process.env.IMAGE_MIGRATION_APPROVED);
      const log = execFileSync(
        'node_modules/.bin/sequoia',
        ['publish', '--dry-run', '--verbose'],
        {encoding: 'utf8'}
      );
      process.stdout.write(log);
      checkDryRun(log, plan);
    },
    publish: () => command('node_modules/.bin/sequoia', ['publish']),
    persist: async ({publicationSucceeded}) => {
      let migrationError;
      if (publicationSucceeded) {
        try {
          await markMigrationPublished();
        } catch (error) {
          migrationError = error;
        }
      }
      await persistPublicationState();
      if (migrationError) throw migrationError;
    },
    finalBuild: () => {
      command('npm', ['run', 'build']);
      command('npm', ['run', 'check']);
    }
  }).catch(e => {
    console.error(e.message);
    process.exitCode = 1;
  });
}
