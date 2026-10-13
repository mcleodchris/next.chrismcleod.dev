
// CSS and JavaScript as first-class citizens in Eleventy: https://pepelsbey.dev/articles/eleventy-css-js/

import esbuild from 'esbuild';

export default eleventyConfig => {
  eleventyConfig.addTemplateFormats('js');
  // Directory data files are data, not templates of this format.
  eleventyConfig.ignores.add('./src/**/*.11tydata.js');

  eleventyConfig.addExtension('js', {
    outputFileExtension: 'js',
    compile: async (content, path) => {
      if (path !== './src/assets/scripts/app.js') {
        return;
      }

      return async () => {
        let output = await esbuild.build({
          target: 'es2020',
          entryPoints: [path],
          minify: true,
          bundle: true,
          write: false
        });

        return output.outputFiles[0].text;
      };
    }
  });
};
