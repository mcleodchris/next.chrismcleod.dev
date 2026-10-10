import { resetManifestCache } from './manifest.js';
import { reportMissingImages } from './picture.js';

/** Re-reads data/images.json on every build, including development rebuilds. */
export default eleventyConfig => {
  // The folder, not the file: images:sync replaces the file by renaming,
  // which a watch on the file itself stops following.
  eleventyConfig.addWatchTarget('./data/');
  eleventyConfig.on('eleventy.before', resetManifestCache);
  eleventyConfig.on('eleventy.after', reportMissingImages);
};
