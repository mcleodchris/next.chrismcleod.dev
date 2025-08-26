/**
 * I strive to keep the `.eleventy.js` file clean and uncluttered. Most adjustments must be made in:
 *  - `./config/collections/index.js`
 *  - `./config/filters/index.js`
 *  - `./config/plugins/index.js`
 *  - `./config/shortcodes/index.js`
 *  - `./config/transforms/index.js`
 */

// JSDoc comment: Hint VS Code for eleventyConfig autocompletion. © Henry Desroches - https://gist.github.com/xdesro/69583b25d281d055cd12b144381123bf

/**
 *  @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 */
import 'dotenv/config';
import prettier from 'prettier';
import packageJson from './package.json' with { type: 'json' };

// get package.json
const packageVersion = packageJson.version;

// module import filters
import {
  limit,
  toHtml,
  where,
  toISOString,
  formatDate,
  toAbsoluteUrl,
  stripHtml,
  minifyCss,
  minifyJs,
  mdInline,
  splitlines,
  jsonToString,
  longAgo,
  dateDiff,
  excludeTag,
  dateForFeed,
  stripIndex,
  filterTagsFromFeeds
} from './config/filters/index.js';

import posseFilters from './config/filters/posse.js';

// module import shortcodes
import {
  imageShortcodePlaceholder,
  includeRaw,
  liteYoutube
} from './config/shortcodes/index.js';

// module import collections
import {
  getAllPosts,
  getAllSubscriptions,
  tagList,
  getAllBookmarks,
  getBookmarksFeed,
  getGraph,
  notesForFeed,
  bookmarksForFeed,
  postsForFeed
} from './config/collections/index.js';

// module import events
import {svgToJpeg} from './config/events/index.js';

// plugins
import {markdownLib} from './config/plugins/markdown.js';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import {slugifyString} from './config/utils/index.js';
import _ from 'lodash';
import pluginRss from '@11ty/eleventy-plugin-rss';
import inclusiveLangPlugin from '@11ty/eleventy-plugin-inclusive-language';
import postGraph from '@rknightuk/eleventy-plugin-post-graph';

export default async function(eleventyConfig) {
  const {RenderPlugin} = await import('@11ty/eleventy');
  // 	--------------------- Custom Watch Targets -----------------------
  eleventyConfig.addWatchTarget('./src/assets');
  eleventyConfig.addWatchTarget('./utils/*.js');

  // --------------------- layout aliases -----------------------
  eleventyConfig.addLayoutAlias('base', 'base.njk');
  eleventyConfig.addLayoutAlias('page', 'page.njk');
  eleventyConfig.addLayoutAlias('home', 'home.njk');
  eleventyConfig.addLayoutAlias('blog', 'blog.njk');
  eleventyConfig.addLayoutAlias('post', 'post.njk');
  eleventyConfig.addLayoutAlias('archive', 'archive.njk');
  eleventyConfig.addLayoutAlias('bookmark', 'bookmark.njk');
  eleventyConfig.addLayoutAlias('bookmarks', 'bookmarks.njk');
  eleventyConfig.addLayoutAlias('feed-json', 'feed-json.njk');
  eleventyConfig.addLayoutAlias('note', 'note.njk');

  // 	---------------------  Custom filters -----------------------
  eleventyConfig.addFilter('limit', limit);
  eleventyConfig.addFilter('where', where);
  eleventyConfig.addFilter('escape', _.escape);
  eleventyConfig.addFilter('toHtml', toHtml);
  eleventyConfig.addFilter('toIsoString', toISOString);
  eleventyConfig.addFilter('formatDate', formatDate);
  eleventyConfig.addFilter('toAbsoluteUrl', toAbsoluteUrl);
  eleventyConfig.addFilter('stripHtml', stripHtml);
  eleventyConfig.addFilter('slugify', slugifyString);
  eleventyConfig.addFilter('toJson', JSON.stringify);
  eleventyConfig.addFilter('fromJson', JSON.parse);
  eleventyConfig.addFilter('cssmin', minifyCss);
  eleventyConfig.addNunjucksAsyncFilter('jsmin', minifyJs);
  eleventyConfig.addFilter('md', mdInline);
  eleventyConfig.addFilter('splitlines', splitlines);
  eleventyConfig.addFilter('keys', Object.keys);
  eleventyConfig.addFilter('values', Object.values);
  eleventyConfig.addFilter('entries', Object.entries);
  eleventyConfig.addFilter('jsonToString', jsonToString);
  eleventyConfig.addFilter('longAgo', longAgo);
  eleventyConfig.addFilter('dateDiff', dateDiff);
  eleventyConfig.addFilter('excludeTag', excludeTag);
  eleventyConfig.addFilter('dateForFeed', dateForFeed);
  eleventyConfig.addFilter('stripIndex', stripIndex);
  eleventyConfig.addFilter('filterTagsFromFeeds', filterTagsFromFeeds);
  eleventyConfig.addNunjucksFilter('getKeyedData', function (varName) {
    return this.getVariables()[varName];
  });
  eleventyConfig.addNunjucksFilter('getKeyedPostData', function (varName, post) {
    return post.data[varName];
  });
  Object.keys(posseFilters).forEach(filterName => {
    eleventyConfig.addFilter(filterName, posseFilters[filterName]);
  });

  // 	--------------------- Custom shortcodes ---------------------
  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcodePlaceholder);
  eleventyConfig.addShortcode('youtube', liteYoutube);
  eleventyConfig.addShortcode('include_raw', includeRaw);
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`); // current year, stephanie eckles
  eleventyConfig.addShortcode('packageVersion', () => `v${packageVersion}`);

  // 	--------------------- Custom transforms ---------------------
  eleventyConfig.addPlugin((await import('./config/transforms/html-config.js')).default);

  // 	--------------------- Custom Template Languages ---------------------
  eleventyConfig.addPlugin((await import('./config/template-languages/css-config.js')).default);
  eleventyConfig.addPlugin((await import('./config/template-languages/js-config.js')).default);

  // 	--------------------- Custom collections -----------------------
  eleventyConfig.addCollection('posts', getAllPosts);
  eleventyConfig.addCollection('subscriptions', getAllSubscriptions);
  eleventyConfig.addCollection('tagList', tagList);
  eleventyConfig.addCollection('bookmarks', getAllBookmarks);
  eleventyConfig.addCollection('bookmarksFeed', getBookmarksFeed);
  eleventyConfig.addCollection('graph', getGraph);
  eleventyConfig.addCollection('notesForFeed', notesForFeed);
  eleventyConfig.addCollection('bookmarksForFeed', bookmarksForFeed);
  eleventyConfig.addCollection('postsForFeed', postsForFeed);

  // 	--------------------- Events ---------------------
  eleventyConfig.on('afterBuild', svgToJpeg);

  // 	--------------------- Plugins ---------------------
  eleventyConfig.addPlugin(RenderPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setLibrary('md', markdownLib);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(inclusiveLangPlugin, {
    words: 'simply,obviously,basically,of course,clearly,everyone knows'
  });
  //  eleventyConfig.addPlugin(bundlerPlugin);
  eleventyConfig.addPlugin(postGraph, {
    noStyles: true,
    sort: 'desc'
  });

  // 	--------------------- Passthrough File Copy -----------------------
  // same path
  ['src/assets/fonts/', 'src/assets/images/'].forEach(path =>
    eleventyConfig.addPassthroughCopy(path)
  );

  // social icons to root directory
  eleventyConfig.addPassthroughCopy({
    'src/assets/images/favicon/*': '/'
  });

  //  --------------------- transform -----------------------
  eleventyConfig.addTransform('prettier', function (content) {
    if ((this.page.outputPath || '').endsWith('.html')) {
      let prettified = prettier.format(content, {
        bracketSameLine: false,
        printWidth: 100,
        parser: 'html',
        tabWidth: 2
      });
      return prettified;
    }

    // If not an HTML output, return content as-is
    return content;
  });

  eleventyConfig.addBundle("js");

  // 	--------------------- general config -----------------------
  return {
    // Pre-process *.md, *.html and global data files files with: (default: `liquid`)
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',

    // Optional (default is set): If your site deploys to a subdirectory, change `pathPrefix`, for example with with GitHub pages
    pathPrefix: '/',

    dir: {
      output: 'dist',
      input: 'src',
      includes: '_includes',
      layouts: '_layouts'
    }
  };
}
