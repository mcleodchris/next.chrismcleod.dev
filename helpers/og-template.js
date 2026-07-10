/**
 * OpenGraph image SVG template.
 * Edit this file to change the visual design of generated OG images.
 * The generate-og-images.js script imports and calls renderOgTemplate().
 *
 * Design matches the site's Catppuccin Macchiato dark theme:
 *   Background:  #24273a  (machiatto-base)
 *   Title text:  #cad3f5  (machiatto-text)
 *   Muted text:  #8087a2  (machiatto-overlay1)
 *   Logo:        #ed8796  (machiatto-red)
 *   Display font: iA Writer Quattro S (must be installed — see generate-og-images.js)
 *   Base font:    iA Writer Duo S     (must be installed — see generate-og-images.js)
 */

const escapeXml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const splitlines = (input, maxCharLength) => {
  const parts = input.split(' ');
  return parts.reduce((acc, cur) => {
    if (!acc.length) return [cur];
    const last = acc[acc.length - 1];
    if (last.length + cur.length > maxCharLength) return [...acc, cur];
    acc[acc.length - 1] = last + ' ' + cur;
    return acc;
  }, []);
};

// Site logo mark path (viewBox 0 0 240 240)
const LOGO_PATH =
  'm2.5767341 152.85581 65.1450639 12.06461L100.86346 1.1214157l55.2141 156.0807543 67.4711-45.29252-20.47228 69.59851 34.65936-13.08196-34.16422 73.21373s-27.21487-.36145-27.00042-1.0922c.21447-.73075 16.57518-34.4208 16.36073-35.26618-.21447-.84539-23.64441 8.87535-23.64441 8.87535s13.13851-46.04073 13.18947-46.34814c.15607-.94127-39.63349 28.98664-39.63349 28.98664L106.81872 87.110445 88.38336 194.50414s-42.148805-8.82637-43.287071-7.92367c-1.138266.9027 26.254759 56.09622 26.254759 56.09622l-31.408671-.00001';

/**
 * Render an SVG string for an OG image.
 * @param {{ title: string, date: string, siteName: string, siteUrl: string }} data
 * @returns {string} SVG markup
 */
export function renderOgTemplate({ title, date, siteName, siteUrl }) {
  const lines = splitlines(title, 24);
  const nLines = Math.min(lines.length, 5);

  // Layout constants (all in px)
  const lineHeight = 88;
  const capTitle   = 59;  // cap-height of 82px title font
  const descTitle  = 22;  // descender of 82px title font
  const capDate    = 16;  // cap-height of 22px date font
  const descDate   = 5;   // descender of 22px date font
  const gapDateTitle = 30; // white-space between date descender and title cap
  const topMargin  = 40;
  const brandTop   = 543;

  // Height of the combined date + title block
  const blockHeight = capDate + descDate + gapDateTitle + capTitle
                    + (nLines - 1) * lineHeight + descTitle;

  // Vertically centre the block in the space above the brand bar
  const blockTop = (brandTop - topMargin - blockHeight) / 2 + topMargin;

  const dateBaseline       = Math.round(blockTop + capDate);
  const firstTitleBaseline = Math.round(dateBaseline + descDate + gapDateTitle + capTitle);

  const titleSpans = lines
    .slice(0, nLines)
    .map((line, i) => `    <tspan x="100" y="${firstTitleBaseline + i * lineHeight}">${escapeXml(line)}</tspan>`)
    .join('\n');

  const siteNameUpper = escapeXml(siteName.toUpperCase());

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="1200" height="628" viewBox="0 0 1200 628" version="1.1" xmlns="http://www.w3.org/2000/svg">

  <!-- Background: Catppuccin Macchiato base -->
  <rect x="0" y="0" width="1200" height="628" fill="#24273a"/>

  <!-- Date -->
  <text
    font-family="'iA Writer Duo S', 'Duo', Inter, 'Segoe UI', Roboto, sans-serif"
    font-size="22"
    font-weight="400"
    fill="#a6da95"
    letter-spacing="-0.5">
    <tspan x="100" y="${dateBaseline}">${escapeXml(date)}</tspan>
  </text>

  <!-- Post title: display font, site text colour -->
  <text
    font-family="'iA Writer Quattro S', 'Quattro', Redhat, 'Segoe UI', Roboto, sans-serif"
    font-size="82"
    font-weight="700"
    fill="#cad3f5"
    letter-spacing="-3">
${titleSpans}
  </text>

  <!-- Site logo mark: 22px tall, bottom-aligned with text baseline at y=578 -->
  <svg x="100" y="556" width="22" height="22" viewBox="0 0 240 240">
    <path d="${LOGO_PATH}" fill="#ed8796" fill-rule="evenodd" clip-rule="evenodd"/>
  </svg>

  <!-- Site name + URL on one line (text x offset = logo width + 8px gap) -->
  <text
    font-family="'iA Writer Duo S', 'Duo', Inter, 'Segoe UI', Roboto, sans-serif"
    x="130" y="578">
    <tspan font-size="22" font-weight="700" fill="#cad3f5" letter-spacing="-0.5">${siteNameUpper}</tspan><tspan dx="10" font-size="18" font-weight="400" fill="#a6da95" letter-spacing="-0.3">${escapeXml(siteUrl)}</tspan>
  </text>

</svg>`;
}
