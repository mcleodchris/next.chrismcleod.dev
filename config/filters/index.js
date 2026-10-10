import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
import site from '../../src/_data/meta.js';
import MarkdownIt from 'markdown-it';
import fs from 'fs';
import { SYSTEM_TAGS } from '../collections/index.js';
import { slugifyString } from '../utils/index.js';

const md = new MarkdownIt();

/** Returns all entries from the given array that match the specified key:value pair. */
const where = (items, key, value) =>
  items.filter(item => key.split('.').reduce((o, k) => o?.[k], item) === value);

/** Converts the given date string to ISO8610 format. */
const toISOString = dateString => dayjs(dateString).toISOString();

/** Formats a date using dayjs's conventions: https://day.js.org/docs/en/display/format */
const formatDate = (date, format) => dayjs(date).format(format);

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

// const excludeTag = (array, tag) => array.filter(item => item !== tag);
const excludeTag = (tags, tagToExclude) => {
  if (!Array.isArray(tags)) return [];
  return tags.filter(tag => tag !== tagToExclude);
};

const dateForFeed = date => {
  // thanks Robb
  return date.toISOString();
};
const stripIndex = path => {
  if (!path) return '';
  return path.replace('/index.html', '/');
};
// 'bookmark' has always been kept in feed tags, so it stays.
const tagsToFilterFromFeeds = [
  ...SYSTEM_TAGS.filter(tag => tag !== 'bookmark'),
  'bookmarks',
  'feed',
  'personal',
  'site-meta'
];
const filterTagsFromFeeds = (array) => {
  return array.filter(item => !tagsToFilterFromFeeds.includes(item));
};

/** Removes the system tags, leaving the tags that describe a topic. */
const topicTags = tags => [].concat(tags ?? []).filter(tag => !SYSTEM_TAGS.includes(tag));

const SOCIAL_PREVIEW_DIR = 'src/assets/images/social-preview';
let socialPreviewFiles;
/** True when a generated social preview image with this file name exists. */
const socialPreviewExists = name => {
  socialPreviewFiles ??= new Set(fs.existsSync(SOCIAL_PREVIEW_DIR) ? fs.readdirSync(SOCIAL_PREVIEW_DIR) : []);
  return socialPreviewFiles.has(name);
};

/** The absolute social preview image URL for a page's data. */
const socialImageUrl = data => {
  if (data.ogImage) return `${site.url}/assets/images/social-preview/${data.ogImage}`;
  const fallback = `${slugifyString(String(data.title ?? ''))}-preview.jpeg`;
  if (data.layout === 'post' && socialPreviewExists(fallback)) {
    return `${site.url}/assets/images/social-preview/${fallback}`;
  }
  return `${site.url}${site.meta_data.opengraph_default}`;
};

export {
  where,
  toISOString,
  formatDate,
  mdInline,
  longAgo,
  dateDiff,
  excludeTag,
  dateForFeed,
  stripIndex,
  filterTagsFromFeeds,
  topicTags,
  socialPreviewExists,
  socialImageUrl
};
