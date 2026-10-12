import packageJson from '../../package.json' with { type: 'json' };
import imageShortcode from './image/index.js';
import liteYoutube from './youtube-lite/index.js';
import postGraph from './post-graph/index.js';

export default eleventyConfig => {
  eleventyConfig.addShortcode('image', imageShortcode);
  eleventyConfig.addShortcode('youtube', liteYoutube);
  eleventyConfig.addShortcode('postGraph', postGraph);
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);
  eleventyConfig.addShortcode('packageVersion', () => `v${packageJson.version}`);
};
