import packageJson from '../../package.json' with { type: 'json' };
import imageShortcodePlaceholder from './image/index.js';
import liteYoutube from './youtube-lite/index.js';

export default eleventyConfig => {
  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcodePlaceholder);
  eleventyConfig.addShortcode('youtube', liteYoutube);
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);
  eleventyConfig.addShortcode('packageVersion', () => `v${packageJson.version}`);
};
