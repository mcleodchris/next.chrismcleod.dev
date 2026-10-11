import {renderPicture, renderFigure, DEFAULT_SIZES} from '../../images/picture.js';
export default async function imageShortcodePlaceholder(
  src,
  alt = '',
  caption,
  sizes = DEFAULT_SIZES,
  classes = '',
  lazy = true,
  imgWidths
) {
  return renderFigure(
    renderPicture({
      src,
      alt,
      sizes,
      className: classes,
      loading: lazy ? 'lazy' : 'eager',
      widths: imgWidths
    }),
    caption
  );
}
