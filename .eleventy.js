import { RenderPlugin } from '@11ty/eleventy';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import pluginRss from '@11ty/eleventy-plugin-rss';
import inclusiveLangPlugin from '@11ty/eleventy-plugin-inclusive-language';
import postGraph from '@rknightuk/eleventy-plugin-post-graph';

import collections from './config/collections/index.js';
import filters from './config/filters/index.js';
import shortcodes from './config/shortcodes/index.js';
import images from './config/images/index.js';
import cssLanguage from './config/template-languages/css-config.js';
import jsLanguage from './config/template-languages/js-config.js';
import { markdownLib } from './config/plugins/markdown.js';

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.addWatchTarget('./src/assets');

  eleventyConfig.addPlugin(collections);
  eleventyConfig.addPlugin(filters);
  eleventyConfig.addPlugin(shortcodes);
  eleventyConfig.addPlugin(images);
  eleventyConfig.addPlugin(cssLanguage);
  eleventyConfig.addPlugin(jsLanguage);

  eleventyConfig.setLibrary('md', markdownLib);
  eleventyConfig.addPlugin(RenderPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(inclusiveLangPlugin, {
    words: 'simply,obviously,basically,of course,clearly,everyone knows'
  });
  eleventyConfig.addPlugin(postGraph, { noStyles: true, sort: 'desc' });
  eleventyConfig.addBundle('js');

  eleventyConfig.addPassthroughCopy('src/assets/fonts/');
  eleventyConfig.addPassthroughCopy('src/assets/images/');
  eleventyConfig.addPassthroughCopy({ 'src/assets/images/favicon/*': '/' });

  return {
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    dir: {
      output: 'dist',
      input: 'src',
      includes: '_includes',
      layouts: '_layouts'
    }
  };
}
