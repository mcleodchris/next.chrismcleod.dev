import markdownIt from 'markdown-it';
import markdownItPrism from 'markdown-it-prism';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItClass from '@toycode/markdown-it-class';
import markdownItLinkAttributes from 'markdown-it-link-attributes';
import markdownItFootnote from 'markdown-it-footnote';
import markdownitMark from 'markdown-it-mark';
import markdownitAbbr from 'markdown-it-abbr';
import markdownItGithubAlerts from 'markdown-it-github-alerts';
import markdownItImageFigures from 'markdown-it-image-figures';
import { slug } from '../identity/index.js';
import { isCdnImage } from '../images/manifest.js';
import { renderPicture } from '../images/picture.js';

export const markdownLib = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
})
  .disable('code')
  .use(markdownItPrism, {
    defaultLanguage: 'plaintext'
  })
  .use(markdownItAnchor, {
    slugify: slug,
    tabIndex: false,
    permalink: markdownItAnchor.permalink.headerLink({
      class: 'heading-anchor'
    })
  })
  .use(markdownItClass, {
    ol: 'list',
    ul: 'list'
  })
  .use(markdownItLinkAttributes, [
    {
      // match external links
      matcher(href) {
        return href.match(/^https?:\/\//);
      },
      attrs: {
        target: '_blank',
        rel: 'noopener'
      }
    }
  ])
  .use(markdownItFootnote)
  .use(markdownitMark)
  .use(markdownitAbbr)
  .use(markdownItGithubAlerts)
  // A paragraph holding only an image becomes a <figure>; its title, the caption.
  .use(markdownItImageFigures, { figcaption: 'title' });

// CDN images become responsive <picture> markup from the image manifest. This
// runs when Markdown is rendered, so feeds get the same markup as pages.
const defaultImageRule = markdownLib.renderer.rules.image;
markdownLib.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const src = token.attrGet('src');
  if (!isCdnImage(src)) {
    token.attrSet('loading', 'lazy');
    token.attrSet('decoding', 'async');
    return defaultImageRule(tokens, idx, options, env, self);
  }
  return renderPicture({ src, alt: self.renderInlineAsText(token.children, options, env) });
};

export default markdownLib;
