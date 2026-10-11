import slugify from 'slugify';

/** Converts string to a slug form. */
const slugifyString = str => {
  return slugify(str, {
    replacement: '-',
    remove: /[#,&,+()$~%.'":*?<>{}]/g,
    lower: true
  });
};

/**
 * The path Sequoia publishes a post's AT Protocol record under. Sequoia
 * (sequoia-cli 0.5.7, `resolvePathTemplate`) slugifies `{title}` its own way,
 * which differs from `slugifyString` for titles with punctuation, so the two
 * URLs can disagree; the redirects collection bridges the difference.
 */
const sequoiaPath = (template, title) => {
  const slug = String(title ?? '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
  const result = template.replace(/\{title\}/g, slug);
  return result.startsWith('/') ? result : `/${result}`;
};

/** throw an error if the provided argument is not of the expected. */
const throwIfNotType = (arg, expectedType) => {
  if (typeof arg !== expectedType) {
    throw new Error(
      `Expected argument of type ${expectedType} but instead got ${arg} (${typeof arg})`
    );
  }
};

export {
  slugifyString,
  sequoiaPath,
  throwIfNotType
};
