import Image from '@11ty/eleventy-img';
import path from 'path';
import htmlmin from 'html-minifier-terser';

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

// Legacy images whose basename is shared by another URL share one set of
// resized variants on the CDN, so those variants may show the wrong picture.
// Stopgap until the image manifest replaces this shortcode (exec plan M9).
const COLLIDING_BASENAMES = new Set([
  'image',
  'image-1',
  'image-2',
  'image-3',
  '970c78e0-a6bd-4c64-b434-699c3dc03a0c'
]);

const imageShortcodePlaceholder = async (
  src,
  alt,
  caption,
  sizes = '(min-width: 55rem) 820px, 100vw',
  classes = '',
  lazy = true,
  imgWidths = "320,570,820"
) => {
  if (!alt) {
    throw new Error(`Missing \`alt\` on myImage from: ${src}`);
  }

  let staticData = {};
  let widths = imgWidths.split(',').map((width) => parseInt(width));
  let formats = ['avif', 'webp', 'jpeg'];

  // TODO: This should be a configuration variable somewhere
  const basePath = 'https://assets.chrismcleod.dev/chrismcleod.dev/assets/resized';

  formats.forEach((format) => {
    staticData[format] = [];
    widths.forEach((width) => {
      const fileName = getFileName(null, src, width, format, {});
      staticData[format].push({
        url: `${basePath}/${fileName}`,
        width,
        format,
        sourceType: `image/${format}`,
        srcset: `${basePath}/${fileName} ${width}w`,
      });
    });
  });

  const basename = path.basename(src, path.extname(src));
  if (process.env.ELEVENTY_PRODUCTION && COLLIDING_BASENAMES.has(basename)) {
    return `<figure><img src="${src}" alt="${alt}" loading="lazy" decoding="async">${
      caption ? `<figcaption class="cluster font-display"><p>${caption}</p></figcaption>` : ''
    }</figure>`;
  }

  let metadata = process.env.ELEVENTY_PRODUCTION ? staticData : await Image(src, {
    widths,
    formats,
    urlPath: '/assets/images/',
    outputDir: './dist/assets/images/',
    filenameFormat: getFileName,
  });

  let lowsrc = metadata.jpeg[metadata.jpeg.length - 1];

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
        ${lowsrc.height ? `height="${lowsrc.height}"` : ''}
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

export default imageShortcodePlaceholder;
