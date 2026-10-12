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

const monthName = { MMMM: new Intl.DateTimeFormat('en', { month: 'long' }), MMM: new Intl.DateTimeFormat('en', { month: 'short' }) };
const ordinalSuffix = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
const ordinalRules = new Intl.PluralRules('en', { type: 'ordinal' });
const pad = value => String(value).padStart(2, '0');

const dateTokens = {
  YYYY: date => String(date.getFullYear()),
  MMMM: date => monthName.MMMM.format(date),
  MMM: date => monthName.MMM.format(date),
  MM: date => pad(date.getMonth() + 1),
  Do: date => `${date.getDate()}${ordinalSuffix[ordinalRules.select(date.getDate())]}`,
  DD: date => pad(date.getDate()),
  D: date => String(date.getDate()),
  HH: date => pad(date.getHours()),
  h: date => String(date.getHours() % 12 || 12),
  mm: date => pad(date.getMinutes()),
  a: date => (date.getHours() < 12 ? 'am' : 'pm')
};

/**
 * Formats a date in local time with dayjs-style tokens (YYYY, MMMM, MMM, MM,
 * Do, DD, D, HH, h, mm, a); text in [brackets] is kept as it is. As with
 * dayjs, no date means now, and an invalid one gives "Invalid Date".
 */
const formatDate = (value, format) => {
  const date = value === undefined ? new Date() : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Invalid Date';
  return format.replace(/\[([^\]]*)]|YYYY|MMMM|MMM|MM|Do|DD|D|HH|h|mm|a/g, (token, literal) =>
    literal ?? dateTokens[token](date)
  );
};

export {
  slugifyString,
  sequoiaPath,
  formatDate
};
