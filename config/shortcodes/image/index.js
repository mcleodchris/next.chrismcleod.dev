import { renderPicture } from '../../images/picture.js';

/**
 * {% image src, alt, caption, sizes, classes, lazy %} for the few images that
 * need a class or eager loading; content uses Markdown images. A seventh
 * argument (a list of widths) is accepted and ignored: the image manifest
 * says which widths exist.
 */
const imageShortcode = (
  src,
  alt,
  caption,
  sizes = '(min-width: 55rem) 820px, 100vw',
  classes = '',
  lazy = true
) => {
  if (!alt) {
    throw new Error(`Missing \`alt\` on image from: ${src}`);
  }
  const picture = renderPicture({
    src,
    alt,
    className: classes || undefined,
    loading: lazy ? 'lazy' : 'eager',
    sizes: sizes || undefined
  });
  return `<figure>${picture}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
};

export default imageShortcode;
