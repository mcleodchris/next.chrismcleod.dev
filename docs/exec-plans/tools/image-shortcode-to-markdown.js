// Archived migration verification tool; not used by builds or production release.
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {filesUnder, imageCalls} from '../../../helpers/site-sources.js';
import {atomicJson} from '../../../helpers/sync-utils.js';
function markdownImage(src, alt, caption) {
  const text = alt.replace(/[\\\[\]!*_`~<>&\n\r]/g, c => `&#${c.codePointAt(0)};`);
  const url = src
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s/g, c => encodeURIComponent(c));
  return `![${text}](<${url}>${caption ? ` "${caption.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : ''})`;
}
export function convertImages(text) {
  const calls = imageCalls(text),
    changes = [],
    exceptions = [];
  for (const call of calls) {
    const [src, alt, caption] = call.values;
    const before = text.slice(0, call.start).split('\n').pop(),
      after = text.slice(call.end).split('\n')[0];
    let reason;
    if (call.args.length < 2 || call.args.length > 3) reason = 'presentation options';
    else if (
      src === undefined ||
      alt === undefined ||
      (call.args.length === 3 && caption === undefined)
    )
      reason = 'dynamic/non-text arguments';
    else if (caption && /[<>]|\n/.test(caption)) reason = 'non-text or multiline caption';
    else if (caption && (before.trim() || after.trim()))
      reason = 'inline caption requires review';
    if (reason) exceptions.push({line: call.line, reason, args: call.args});
    else changes.push({...call, replacement: markdownImage(src, alt, caption)});
  }
  let content = text;
  for (const change of changes.reverse())
    content =
      content.slice(0, change.start) + change.replacement + content.slice(change.end);
  return {content, converted: changes.length, exceptions};
}
export async function migrateImages({write = false, root = 'src'} = {}) {
  const files = [],
    exceptions = [];
  for (const file of (await filesUnder(root)).filter(f => f.endsWith('.md'))) {
    const original = await fs.readFile(file, 'utf8'),
      result = convertImages(original);
    exceptions.push(...result.exceptions.map(e => ({file, ...e})));
    if (result.converted) {
      files.push({file, count: result.converted});
      if (write) await fs.writeFile(file, result.content);
    }
  }
  return {files, exceptions};
}
export async function migrationCommand(args, {root = 'src'} = {}) {
  if (
    args.some(a => !['--write', '--check'].includes(a) && !a.startsWith('--report=')) ||
    (args.includes('--write') && args.includes('--check'))
  )
    throw new Error('Use --check (read-only), --write, or --report=<path>');
  const report = await migrateImages({write: args.includes('--write'), root});
  const reportPath = args.find(a => a.startsWith('--report='))?.slice(9);
  if (reportPath) await atomicJson(reportPath, report);
  return {report, exitCode: args.includes('--check') && report.files.length ? 1 : 0};
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const {report, exitCode} = await migrationCommand(process.argv.slice(2));
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = exitCode;
}
