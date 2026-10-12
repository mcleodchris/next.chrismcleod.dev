import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { designTokensCss } from './design-tokens.js';

/** `@import-glob 'blocks/*.css';` becomes an `@import` of each matching file, in name order. */
const importGlob = {
  postcssPlugin: 'import-glob',
  Once(root, { result, AtRule }) {
    const base = path.dirname(result.opts.from);
    root.walkAtRules('import-glob', rule => {
      const pattern = rule.params.replace(/^['"]|['"]$/g, '');
      const files = fs.globSync(pattern, { cwd: base }).sort();
      rule.replaceWith(files.map(file => new AtRule({ name: 'import', params: `'${file}'`, source: rule.source })));
    });
  }
};

/** `@design-tokens;` becomes the design tokens as `:root` custom properties. */
const designTokens = {
  postcssPlugin: 'design-tokens',
  Once(root) {
    root.walkAtRules('design-tokens', rule => {
      rule.replaceWith(postcss.parse(designTokensCss()).nodes);
    });
  }
};

// CSS and JavaScript as first-class citizens in Eleventy: https://pepelsbey.dev/articles/eleventy-css-js/
export default eleventyConfig => {
  eleventyConfig.addTemplateFormats('css');

  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (content, path) => {
      if (path !== './src/assets/css/global.css') {
        return;
      }

      return async () => {
        let output = await postcss([importGlob, postcssImport, designTokens, autoprefixer, cssnano]).process(content, {
          from: path
        });

        return output.css;
      };
    }
  });
};
