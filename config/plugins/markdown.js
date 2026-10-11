import markdownIt from 'markdown-it';
import markdownItPrism from 'markdown-it-prism';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItClass from '@toycode/markdown-it-class';
import markdownItLinkAttributes from 'markdown-it-link-attributes';
import markdownItFootnote from 'markdown-it-footnote';
import markdownitMark from 'markdown-it-mark';
import markdownitAbbr from 'markdown-it-abbr';
import markdownItGithubAlerts from 'markdown-it-github-alerts';
import {slugifyString} from '../utils/index.js';

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
    slugify: slugifyString,
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
  .use(markdownItGithubAlerts);

export default markdownLib;

// Only standalone image paragraphs become figures; inline titles remain ordinary attributes.
markdownLib.core.ruler.after('inline', 'image-figures', state => {
  for (let i = 0; i < state.tokens.length - 2; i++) {
    const [open, inline, close] = state.tokens.slice(i, i + 3);
    if (
      open.type !== 'paragraph_open' ||
      open.hidden ||
      close.type !== 'paragraph_close' ||
      inline.type !== 'inline' ||
      inline.children?.length !== 1 ||
      inline.children[0].type !== 'image'
    )
      continue;
    open.tag = close.tag = 'figure';
    const image = inline.children[0],
      title = image.attrGet('title');
    if (title) {
      image.attrs = image.attrs.filter(([name]) => name !== 'title');
      const caption = new state.Token('html_inline', '', 0);
      caption.content = `<figcaption class="cluster font-display"><p>${markdownLib.utils.escapeHtml(title)}</p></figcaption>`;
      inline.children.push(caption);
    }
  }
});

// markdown-it leaves escaped punctuation/entity tokens inside image alt children.
// Its default text renderer ignores text_special there; retain those characters.
const renderImage = markdownLib.renderer.rules.image;
markdownLib.renderer.rules.image = (tokens, index, options, env, renderer) => {
  const normalise = children => {
    for (const token of children || []) {
      if (token.type === 'text_special') token.type = 'text';
      normalise(token.children);
    }
  };
  normalise(tokens[index].children);
  return renderImage(tokens, index, options, env, renderer);
};
