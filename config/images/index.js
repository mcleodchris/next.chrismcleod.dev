import {loadManifest, buildImageIndex, setImageIndex} from './manifest.js';
import {imageDiagnostics, resetImageDiagnostics} from './picture.js';
import {enrichImages} from './enrich.js';
import {resolveSocialImage} from './social.js';
export default function imagesPlugin(config) {
  config.addWatchTarget('config/images/manifest.json');
  config.on('eleventy.before', async () => {
    setImageIndex(buildImageIndex(await loadManifest()));
    resetImageDiagnostics();
  });
  config.on('eleventy.after', () => {
    const messages = imageDiagnostics();
    if (messages.length)
      console.warn(`Image diagnostics (${messages.length}):\n${messages.join('\n')}`);
  });
  config.addFilter('enrichImages', enrichImages);
  config.addFilter('socialImage', resolveSocialImage);
  config.addTransform('cdn-images', function (content) {
    return this.page.outputPath?.endsWith('.html') ? enrichImages(content) : content;
  });
}
