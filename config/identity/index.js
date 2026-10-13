/**
 * Identity: every name a Post or Bookmark goes by (see CONTEXT.md). The Slug,
 * URL, content file name, Preview image name and Sequoia path all follow from
 * the kind and the title; nothing else in the site derives them.
 */

import slugify from 'slugify';
import sequoiaConfig from '../../sequoia.json' with { type: 'json' };

/** Kinds of content named by their title, and where their pages live. */
const KINDS = {
  post: { urlBase: '/blog/', hasPreviewImage: true, syndicated: true },
  bookmark: { urlBase: '/bookmarks/', hasPreviewImage: false, syndicated: false }
};

const PREVIEW_IMAGE_SUFFIX = '-preview.jpeg';

const kindOf = kind => {
  const definition = KINDS[kind];
  if (!definition) throw new Error(`Unknown kind "${kind}"; expected one of ${Object.keys(KINDS).join(', ')}`);
  return definition;
};

/** The Slug rule: lower case, URL-safe text. Also names heading anchors and tags. */
export const slug = text =>
  slugify(String(text ?? ''), {
    replacement: '-',
    remove: /[#,&,+()$~%.'":*?<>{}]/g,
    lower: true
  });

/** The Slug as one path segment: `/` and `\` would otherwise start a folder. */
const fileSlug = text => slug(String(text ?? '').replace(/[/\\]+/g, '-'));

/**
 * The path Sequoia publishes a Post's AT Protocol record under. Sequoia
 * (sequoia-cli 0.5.7, `resolvePathTemplate`) slugifies `{title}` its own way,
 * so this can differ from the Post's URL; the redirects collection bridges them.
 */
const sequoiaPath = title => {
  const sequoiaSlug = String(title ?? '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
  const result = sequoiaConfig.pathTemplate.replace(/\{title\}/g, sequoiaSlug);
  return result.startsWith('/') ? result : `/${result}`;
};

/**
 * The Identity of a Post or Bookmark with this title. `previewImage` and
 * `sequoiaPath` exist only for Posts; `fileName(date)` takes a `YYYY-MM-DD` date.
 */
export const identity = (kind, title) => {
  const { urlBase, hasPreviewImage, syndicated } = kindOf(kind);
  const urlSlug = slug(title);
  const nameSlug = fileSlug(title);
  return {
    slug: urlSlug,
    url: `${urlBase}${urlSlug}/`,
    fileName: date => `${date}-${nameSlug}.md`,
    ...(hasPreviewImage && { previewImage: `${nameSlug}${PREVIEW_IMAGE_SUFFIX}` }),
    ...(syndicated && { sequoiaPath: sequoiaPath(title) })
  };
};
