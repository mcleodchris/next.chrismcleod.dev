const Image = require('@11ty/eleventy-img');
const path = require('path');
const htmlmin = require('html-minifier-terser');
const { stat } = require('fs');

function getFileName(id, src, width, format, options) {
  // id: hash of the original image
  // src: original image path
  // width: current width in px
  // format: current file format
  // options: set of options passed to the Image call
  const path = src.split('/');
  const filename = path.pop().split('.');
  const name = filename[0];

  return `${name}-${width}.${format}`;
}

const imageShortcodePlaceholder = async (
  src,
  alt,
  caption,
  sizes = '(min-width: 55rem) 820px, 100vw',
  classes = '',
  lazy = true
) => {
  if (!alt) {
    throw new Error(`Missing \`alt\` on myImage from: ${src}`);
  }

  let staticData = {};
  let widths = [320, 570, 820];
  let formats = ['avif', 'webp', 'jpeg'];

  const basePath = 'https://assets.chrism.cloud/chrismcleod.dev/assets/resized';

  formats.forEach((format) => {
    staticData[format] = [];
    widths.forEach((width) => {
      const fileName = getFileName(null, src, width, format, {});
      staticData[format].push({
        src: `${basePath}/${fileName}`,
        width,
        format,
        sourceType: `image/${format}`,
        srcset: `${basePath}/${fileName} ${width}w`,
      });
    });
  });

  let metadata = process.env.ELEVENTY_PRODUCTION ? staticData : await Image(src, {
    widths,
    formats,
    urlPath: '/assets/images/',
    outputDir: './dist/assets/images/',
    filenameFormat: getFileName,
  });

  let lowsrc = metadata.jpeg[metadata.jpeg.length - 1];

  // getting the url  to use
  let imgSrc = src;
  if (!imgSrc.startsWith('.') && !imgSrc.startsWith('http')) {
    const image = this.page.image;
    const pathParts = image.split('/');
    pathParts.pop();
    imgSrc = pathParts.join('/') + '/' + src;
  }

  return htmlmin.minify(
    `<figure>
     <picture>
    ${Object.values(metadata)
      .map(imageFormat => {
        return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat
          .map(entry => entry.srcset)
          .join(', ')}" sizes="${sizes}">`;
      })
      .join('\n')}
      <img
        src="${lowsrc.url}"
        width="${lowsrc.width}"
        height="${lowsrc.height}"
        alt="${alt}"
				${lazy ? 'loading="lazy"' : ''}
        decoding="async"
        class="${classes}">
    </picture>
    ${caption
      ? `<figcaption class="cluster font-display"><p>${caption}</p>
	</figcaption>`
      : ``
    }
</figure>`,
    { collapseWhitespace: true }
  );
};

module.exports = imageShortcodePlaceholder;
