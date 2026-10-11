/**
 * I strive to keep the `.eleventy.js` file clean and uncluttered. Most adjustments must be made in:
 *  - `./config/collections/index.js`
 *  - `./config/filters/index.js`
 *  - `./config/plugins/index.js`
 *  - `./config/shortcodes/index.js`
 *  - `./config/assets/index.js` and `./config/images/index.js`
 */

// JSDoc comment: Hint VS Code for eleventyConfig autocompletion. © Henry Desroches - https://gist.github.com/xdesro/69583b25d281d055cd12b144381123bf

/**
 *  @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 */
import assetsPlugin from './config/assets/index.js';
import {resetHobbySnapshot} from './config/data/hobby.js';
import packageJson from './package.json' with {type: 'json'};

// get package.json
const packageVersion = packageJson.version;

import filtersPlugin, {dateToRfc822} from './config/filters/index.js';

import posseFilters from './config/filters/posse.js';

// module import shortcodes
import shortcodesPlugin from './config/shortcodes/index.js';

import collectionsPlugin from './config/collections/index.js';
import imagesPlugin from './config/images/index.js';
import redirectsPlugin from './config/redirects.js';

// OG image generation is handled by helpers/generate-og-images.js (run separately)

// plugins
import {markdownLib} from './config/plugins/markdown.js';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import pluginRss from '@11ty/eleventy-plugin-rss';
import inclusiveLangPlugin from '@11ty/eleventy-plugin-inclusive-language';
import postGraph from '@rknightuk/eleventy-plugin-post-graph';

export default async function (eleventyConfig) {
  const {RenderPlugin} = await import('@11ty/eleventy');
  // 	--------------------- Custom Watch Targets -----------------------
  eleventyConfig.addWatchTarget('./src/assets');
  eleventyConfig.addWatchTarget('./data/');
  eleventyConfig.on('eleventy.before', resetHobbySnapshot);

  // --------------------- layout aliases -----------------------
  eleventyConfig.addLayoutAlias('base', 'base.njk');
  eleventyConfig.addLayoutAlias('page', 'page.njk');
  eleventyConfig.addLayoutAlias('home', 'home.njk');
  eleventyConfig.addLayoutAlias('blog', 'blog.njk');
  eleventyConfig.addLayoutAlias('post', 'post.njk');
  eleventyConfig.addLayoutAlias('archive', 'archive.njk');
  eleventyConfig.addLayoutAlias('bookmark', 'bookmark.njk');
  eleventyConfig.addLayoutAlias('bookmarks', 'bookmarks.njk');
  eleventyConfig.addLayoutAlias('note', 'note.njk');

  // 	---------------------  Custom filters -----------------------
  eleventyConfig.addPlugin(filtersPlugin);
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
  eleventyConfig.addPlugin(shortcodesPlugin);
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`); // current year, stephanie eckles
  eleventyConfig.addShortcode('packageVersion', () => `v${packageVersion}`);

  eleventyConfig.addPlugin(assetsPlugin);

  eleventyConfig.addPlugin(collectionsPlugin);
  eleventyConfig.addPlugin(imagesPlugin);
  eleventyConfig.addPlugin(redirectsPlugin);

  // 	--------------------- Plugins ---------------------
  eleventyConfig.addPlugin(RenderPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setLibrary('md', markdownLib);
  eleventyConfig.addPlugin(pluginRss);
  // The plugin's local-zone RFC822 formatter loses the summer-time offset.
  eleventyConfig.addFilter('dateToRfc822', dateToRfc822);
  eleventyConfig.addPlugin(inclusiveLangPlugin, {
    words: 'simply,obviously,basically,of course,clearly,everyone knows'
  });
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

  eleventyConfig.addBundle('js');

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
