/**
 * Reads and edits the YAML front matter of a content file's text. Edits touch
 * only the key they name, so the rest of the file stays byte for byte the same:
 * re-serialising would rewrite dates such as `2021-04-10`, which Eleventy reads
 * as local time, and Sequoia republishes a post whenever its file changes.
 */

import * as yaml from 'js-yaml';

const BLOCK = /^---(\r?\n)([\s\S]*?)\r?\n---/;

/** The front matter as data, read as Eleventy reads it (YAML 1.1: dates become Dates), or undefined. */
export const readFrontMatter = text => {
  const match = text.match(BLOCK);
  if (!match) return undefined;
  try {
    return yaml.load(match[2], { schema: yaml.YAML11_SCHEMA }) ?? {};
  } catch {
    return undefined;
  }
};

const quote = value => `'${String(value).replace(/'/g, "''")}'`;

const format = value =>
  Array.isArray(value) ? `[${value.map(quote).join(', ')}]` : yaml.dump(value, { schema: yaml.YAML11_SCHEMA, lineWidth: -1 }).trimEnd();

const CONTINUES_VALUE = /^(\s+\S|-(\s|$))/;
const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const BLANK_OR_COMMENT = /^\s*(#.*)?$/;

/**
 * Where `key` sits in the block's lines: its own line, whether the key is
 * written plain, `"quoted"` or `'quoted'`, plus every indented or `- ` line of
 * its value, including blank lines and comments between them. Blank lines and
 * comments after the value's last line are not part of it.
 */
const findKey = (lines, key) => {
  const name = escapeRegExp(key);
  const keyLine = new RegExp(`^(${name}|"${name}"|'${name}')\\s*:(\\s|$)`);
  const start = lines.findIndex(line => keyLine.test(line));
  if (start === -1) return undefined;
  let end = start + 1;
  for (let i = start + 1; i < lines.length; i++) {
    if (CONTINUES_VALUE.test(lines[i]) && !/^\s*#/.test(lines[i])) end = i + 1;
    else if (!BLANK_OR_COMMENT.test(lines[i])) break;
  }
  return { start, end };
};

const editBlock = (text, edit) => {
  const match = text.match(BLOCK);
  if (!match) throw new Error('No front matter block');
  const [whole, eol, body] = match;
  const lines = body.split(/\r?\n/);
  const edited = edit(lines);
  if (!edited) return text;
  return `---${eol}${edited.join(eol)}${eol}---${text.slice(whole.length)}`;
};

/**
 * Sets `key` to `value` (a string or a list), replacing its old value or
 * adding it at the end. Throws rather than return front matter that does not
 * read back with `key` set to `value`.
 */
export const setValue = (text, key, value) => {
  const result = editBlock(text, lines => {
    const line = `${key}: ${format(value)}`;
    const found = findKey(lines, key);
    if (!found) return [...lines, line];
    return [...lines.slice(0, found.start), line, ...lines.slice(found.end)];
  });
  const readBack = readFrontMatter(result);
  if (!readBack || JSON.stringify(readBack[key]) !== JSON.stringify(value)) {
    throw new Error(`Setting ${key} would not leave valid front matter with that value`);
  }
  return result;
};

/**
 * Adds `value` to the list under `key`, creating the list if the key is
 * missing and turning a single value into a list. Unchanged if already present.
 */
export const appendToList = (text, key, value) => {
  const current = readFrontMatter(text)?.[key];
  const list = [].concat(current ?? []);
  if (list.includes(value)) return text;
  return setValue(text, key, [...list, value]);
};
