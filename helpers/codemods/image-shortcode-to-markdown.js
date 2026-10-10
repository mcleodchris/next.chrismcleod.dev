/**
 * One-off: rewrite `{% image "SRC", "ALT"[, "CAPTION"] %}` calls in content as
 * Markdown images, `![ALT](SRC "CAPTION")`.
 *
 * Usage:
 *   node helpers/codemods/image-shortcode-to-markdown.js          dry run: print the plan
 *   node helpers/codemods/image-shortcode-to-markdown.js --write  apply it
 *
 * Only calls with two or three string-literal arguments that stand alone on
 * their line are rewritten. A blank line is kept on each side of the result,
 * so each image is its own paragraph and therefore its own <figure>.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const write = process.argv.includes('--write');

const CALL = /\{%-?\s*image\s+([\s\S]*?)\s*-?%\}/g;
const STRING = /^\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')\s*(?:,|$)/;

/** Parses the argument list; returns the string values, or null if any argument is not a string literal. */
const parseArgs = text => {
  const args = [];
  let rest = text;
  while (rest.trim()) {
    const match = rest.match(STRING);
    if (!match) return null;
    args.push((match[1] ?? match[2]).replace(/\\(.)/g, '$1'));
    rest = rest.slice(match[0].length);
  }
  return args;
};

const escapeAlt = alt => alt.replace(/[\\[\]*_`<]/g, '\\$&');
const escapeCaption = caption => caption.replace(/[\\"]/g, '\\$&');

const files = [];
const walk = folder => {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.md')) files.push(full);
  }
};
walk(path.join(ROOT, 'src'));

let replaced = 0;
let skipped = 0;
for (const file of files.sort()) {
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes('image')) continue;
  const edits = [];
  for (const match of text.matchAll(CALL)) {
    const start = match.index;
    const end = start + match[0].length;
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const lineEndIndex = text.indexOf('\n', end);
    const lineEnd = lineEndIndex === -1 ? text.length : lineEndIndex;
    const where = `${path.relative(ROOT, file)}:${text.slice(0, start).split('\n').length}`;
    const args = parseArgs(match[1]);
    let reason;
    if (!args) reason = 'arguments are not all string literals';
    else if (args.length < 2 || args.length > 3) reason = `${args.length} arguments`;
    else if (text.slice(lineStart, start).trim() || text.slice(end, lineEnd).trim()) reason = 'not alone on its line';
    if (reason) {
      skipped++;
      console.log(`SKIP ${where}: ${reason}\n     ${match[0].slice(0, 120).replace(/\n/g, '⏎')}`);
      continue;
    }
    const [src, alt, caption] = args;
    const title = caption ? ` "${escapeCaption(caption)}"` : '';
    const markdown = `![${escapeAlt(alt)}](${src}${title})`;
    edits.push({ start, end, markdown, where, original: match[0] });
  }
  if (!edits.length) continue;

  // Replace each call in place, then, working backwards so positions stay
  // valid, add a blank line on either side of a result that touches text.
  let output = text;
  for (const edit of [...edits].reverse()) {
    output = output.slice(0, edit.start) + edit.markdown + output.slice(edit.end);
  }
  let shift = 0;
  const placed = edits.map(edit => {
    const start = edit.start + shift;
    shift += edit.markdown.length - (edit.end - edit.start);
    return { start, end: start + edit.markdown.length };
  });
  for (const { start, end } of placed.reverse()) {
    const lineStart = output.lastIndexOf('\n', start - 1) + 1;
    const nextLineEnd = output.indexOf('\n', end + 1);
    const nextLine = output.slice(end + 1, nextLineEnd === -1 ? output.length : nextLineEnd);
    if (output[end] === '\n' && nextLine.trim()) output = `${output.slice(0, end)}\n${output.slice(end)}`;
    const previousLine = output.slice(output.lastIndexOf('\n', lineStart - 2) + 1, lineStart - 1);
    if (lineStart > 0 && previousLine.trim()) output = `${output.slice(0, lineStart)}\n${output.slice(lineStart)}`;
  }
  for (const edit of edits) {
    replaced++;
    console.log(`EDIT ${edit.where}\n   - ${edit.original.slice(0, 120).replace(/\n/g, '⏎')}\n   + ${edit.markdown.slice(0, 120).replace(/\n/g, '⏎')}`);
  }
  if (write) fs.writeFileSync(file, output);
}

console.log(`\n${replaced} calls ${write ? 'rewritten' : 'to rewrite'}, ${skipped} skipped${write ? '' : ' (dry run; pass --write to apply)'}`);
