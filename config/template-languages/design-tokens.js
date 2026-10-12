/** © Andy Bell - https://buildexcellentwebsit.es/ (fluid values and token naming) */

import slugify from 'slugify';
import colorTokens from '../../src/_data/designTokens/colors.json' with { type: 'json' };
import fontTokens from '../../src/_data/designTokens/fonts.json' with { type: 'json' };
import spacingTokens from '../../src/_data/designTokens/spacing.json' with { type: 'json' };
import textSizeTokens from '../../src/_data/designTokens/text-sizes.json' with { type: 'json' };
import viewports from '../../src/_data/designTokens/viewports.json' with { type: 'json' };

const ROOT_SIZE = 16;

/**
 * Turns {name, min, max} tokens into {name, value} pairs whose value is a
 * clamp() that scales fluidly between the minimum and maximum viewports.
 */
const clampGenerator = tokens =>
  tokens.map(({ name, min, max }) => {
    if (min === max) {
      return { name, value: `${min / ROOT_SIZE}rem` };
    }

    // Convert the min and max sizes, and the pixel viewport sizes, to rems
    const minSize = min / ROOT_SIZE;
    const maxSize = max / ROOT_SIZE;
    const minViewport = viewports.min / ROOT_SIZE;
    const maxViewport = viewports.max / ROOT_SIZE;

    // Slope and intersection allow us to have a fluid value but also keep that sensible
    const slope = (maxSize - minSize) / (maxViewport - minViewport);
    const intersection = -1 * minViewport * slope + minSize;

    return {
      name,
      value: `clamp(${minSize}rem, ${intersection.toFixed(2)}rem + ${(slope * 100).toFixed(2)}vw, ${maxSize}rem)`
    };
  });

const groups = [
  { prefix: 'color', tokens: colorTokens.items },
  { prefix: 'space', tokens: clampGenerator(spacingTokens.items) },
  { prefix: 'size', tokens: clampGenerator(textSizeTokens.items) },
  { prefix: 'font', tokens: fontTokens.items }
];

/** The design tokens in src/_data/designTokens as `:root` custom properties, e.g. `--space-xs`. */
export const designTokensCss = () => {
  const properties = groups.flatMap(({ prefix, tokens }) =>
    tokens.map(({ name, value }) => `--${prefix}-${slugify(name, { lower: true })}: ${value};`)
  );
  return `:root {\n  ${properties.join('\n  ')}\n}`;
};
