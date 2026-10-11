import imageShortcodePlaceholder from './image/index.js';
import liteYoutube from './youtube-lite/index.js';
export {imageShortcodePlaceholder, liteYoutube};
export default function shortcodesPlugin(config) {
  config.addNunjucksAsyncShortcode('image', imageShortcodePlaceholder);
  config.addShortcode('youtube', liteYoutube);
}
