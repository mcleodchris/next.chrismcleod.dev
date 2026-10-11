import dayjs from 'dayjs';
import {SYSTEM_TAGS} from '../collections/index.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
import markdownLib from '../plugins/markdown.js';
import site from '../../src/_data/meta.js';
import {slugifyString, throwIfNotType} from '../utils/index.js';
import MarkdownIt from 'markdown-it';
import {bookmarkUrl} from '../utils/content.js';

const md = new MarkdownIt();

/** Returns the first `limit` elements of the the given array. */
const limit = (array, limit) => {
  if (limit < 0) {
    throw new Error(`Negative limits are not allowed: ${limit}.`);
  }
  return array.slice(0, limit);
};

/** Returns all entries from the given array that match the specified key:value pair. */
const where = (arrayOfObjects, keyPath, value) =>
  arrayOfObjects.filter(
    object =>
      keyPath
        .replace(/\[(\w+)\]/g, '.$1')
        .split('.')
        .reduce((value, key) => value?.[key], object) === value
  );

/** Converts the given markdown string to HTML, returning it as a string. */
const toHtml = markdownString => {
  return markdownLib.renderInline(markdownString);
};

/** Removes all tags from an HTML string. */
const stripHtml = str => {
  throwIfNotType(str, 'string');
  return str.replace(/<[^>]+>/g, '');
};

/** Formats the given string as an absolute url. */
const toAbsoluteUrl = url => {
  throwIfNotType(url, 'string');
  // Replace trailing slash, e.g., site.com/ => site.com
  const siteUrl = site.url.replace(/\/$/, '');
  // Replace starting slash, e.g., /path/ => path/
  const relativeUrl = url.replace(/^\//, '');

  return `${siteUrl}/${relativeUrl}`;
};

/** Converts the given date string to ISO8610 format. */
const toISOString = dateString => dayjs(dateString).toISOString();

/** Formats a date using dayjs's conventions: https://day.js.org/docs/en/display/format */
const formatDate = (date, format) => dayjs(date).tz(site.timezone).format(format);

const longAgo = date => dayjs(date).fromNow();

const dateDiff = date => dayjs().diff(dayjs(date), 'year');

/**
 * Render content as inline markdown if single line, or full
 * markdown if multiline. for md in yaml
 * @param {string} [content]
 * @param {import('markdown-it').Options} [opts]
 * @return {string|undefined}
 */

const mdInline = (content, opts) => {
  if (!content) {
    return;
  }

  if (opts) {
    md.set(opts);
  }

  let inline = !content.includes('\n');

  // If there's quite a bit of content, we want to make sure
  // it's marked up for readability purposes
  if (inline && content.length > 200) {
    inline = false;
  }

  return inline ? md.renderInline(content) : md.render(content);
};

// source: https://github.com/bnijenhuis/bnijenhuis-nl/blob/main/.eleventy.js
const splitlines = (input, maxCharLength) => {
  const parts = input.split(' ');
  const lines = parts.reduce(function (acc, cur) {
    if (!acc.length) {
      return [cur];
    }

    let lastOne = acc[acc.length - 1];

    if (lastOne.length + cur.length > maxCharLength) {
      return [...acc, cur];
    }

    acc[acc.length - 1] = lastOne + ' ' + cur;

    return acc;
  }, []);

  return lines;
};

const jsonToString = json => JSON.stringify(json, null, 2);

// const excludeTag = (array, tag) => array.filter(item => item !== tag);
const excludeTag = (tags, tagToExclude) => {
  if (!Array.isArray(tags)) return [];
  return tags.filter(tag => tag !== tagToExclude);
};

const dateForFeed = date => {
  // thanks Robb
  return date.toISOString();
};
export const dateToRfc822 = date => new Date(date).toUTCString();
const stripIndex = path => {
  if (!path) return '';
  return path.replace('/index.html', '/');
};
export const publicTags = tags =>
  Array.isArray(tags) ? tags.filter(tag => !SYSTEM_TAGS.has(tag)) : [];

// Feed categories retain their historical editorial policy. Public topic pages instead
// exclude collection names via SYSTEM_TAGS; personal/site-meta remain genuine topics.
const tagsToFilterFromFeeds = [
  'posts',
  'all',
  'notes',
  'timeline',
  'bookmarks',
  'feed',
  'personal',
  'site-meta'
];
const filterTagsFromFeeds = array => {
  return array.filter(item => !tagsToFilterFromFeeds.includes(item));
};

export {
  limit,
  toHtml,
  where,
  toISOString,
  formatDate,
  toAbsoluteUrl,
  stripHtml,
  mdInline,
  splitlines,
  jsonToString,
  longAgo,
  dateDiff,
  excludeTag,
  dateForFeed,
  stripIndex,
  filterTagsFromFeeds
};

export default function filtersPlugin(config) {
  for (const [name, fn] of Object.entries({
    publicTags,
    bookmarkUrl,
    limit,
    toHtml,
    where,
    toIsoString: toISOString,
    formatDate,
    toAbsoluteUrl,
    stripHtml,
    slugify: slugifyString,
    toJson: JSON.stringify,
    fromJson: JSON.parse,
    md: mdInline,
    splitlines,
    keys: Object.keys,
    values: Object.values,
    entries: Object.entries,
    jsonToString,
    longAgo,
    dateDiff,
    excludeTag,
    dateForFeed,
    stripIndex,
    filterTagsFromFeeds
  }))
    if (fn) config.addFilter(name, fn);
}
