import site from '../../src/_data/meta.js';
import MarkdownIt from 'markdown-it';
import { SYSTEM_TAGS } from '../collections/index.js';
import { formatDate, toDate } from '../utils/index.js';
import { makeTootText, makeBlueskyText } from './posse.js';
import { renderPicture } from '../images/picture.js';

const md = new MarkdownIt();

/** Returns all entries from the given array that match the specified key:value pair. */
const where = (items, key, value) =>
  items.filter(item => key.split('.').reduce((o, k) => o?.[k], item) === value);

/** Converts the given date string to ISO8610 format. */
const toISOString = dateString => toDate(dateString).toISOString();

/** A date some months later, its day clamped to the length of that month. */
const addMonths = (date, months) => {
  const result = new Date(date);
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const daysInMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(date.getDate(), daysInMonth));
  return result;
};

/** Months from start to end, a part month as a fraction (moment.js and dayjs's method). */
const monthsBetween = (start, end) => {
  if (end.getDate() < start.getDate()) return -monthsBetween(end, start);
  const whole = (start.getFullYear() - end.getFullYear()) * 12 + (start.getMonth() - end.getMonth());
  const anchor = addMonths(end, whole);
  const before = start - anchor < 0;
  const anchor2 = addMonths(end, whole + (before ? -1 : 1));
  return -(whole + (start - anchor) / (before ? anchor - anchor2 : anchor2 - anchor)) || 0;
};

const yearsAgo = date => monthsBetween(toDate(date), new Date()) / 12;

const relativeTime = new Intl.RelativeTimeFormat('en');

/** How long ago a date was in years, such as "3 years ago"; meant for dates over 18 months ago. */
const longAgo = date => relativeTime.format(-Math.round(Math.abs(yearsAgo(date))), 'year');

/** Full years from a date until now. */
const dateDiff = date => Math.trunc(yearsAgo(date)) || 0;

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

/** The absolute URL of a page's Preview image, or of the site's default image. */
const socialImageUrl = data => {
  if (data.ogImage) return `${site.url}/assets/images/social-preview/${data.ogImage}`;
  return `${site.url}${site.meta_data.opengraph_default}`;
};

/** `{{ src | picture(alt, className) }}`: responsive markup from the image manifest. */
const picture = (src, alt, className) => renderPicture({ src, alt, className });

export { socialImageUrl };

export default eleventyConfig => {
  eleventyConfig.addFilter('where', where);
  eleventyConfig.addFilter('toIsoString', toISOString);
  eleventyConfig.addFilter('formatDate', formatDate);
  eleventyConfig.addFilter('md', mdInline);
  eleventyConfig.addFilter('longAgo', longAgo);
  eleventyConfig.addFilter('dateDiff', dateDiff);
  eleventyConfig.addFilter('excludeTag', excludeTag);
  eleventyConfig.addFilter('dateForFeed', dateForFeed);
  eleventyConfig.addFilter('stripIndex', stripIndex);
  eleventyConfig.addFilter('filterTagsFromFeeds', filterTagsFromFeeds);
  eleventyConfig.addFilter('topicTags', topicTags);
  eleventyConfig.addFilter('socialImageUrl', socialImageUrl);
  eleventyConfig.addFilter('makeTootText', makeTootText);
  eleventyConfig.addFilter('makeBlueskyText', makeBlueskyText);
  eleventyConfig.addFilter('picture', picture);
};
