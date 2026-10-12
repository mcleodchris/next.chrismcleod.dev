/*
 * A GitHub-style grid per year, newest year first, with a highlighted square
 * for each day that has a post. Styled by src/assets/css/blocks/postgraph.css.
 * Based on @rknightuk/eleventy-plugin-post-graph by Robb Knight (ISC), which
 * this site used with `noStyles: true, sort: 'desc'`.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 24 * 60 * 60 * 1000;

/** The day of the year, from 1, in local time. */
const dayOfYear = date =>
  Math.round(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 1)) / DAY_MS
  ) + 1;

const isLeapYear = year => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const yearGraph = (year, postDays) => {
  // Monday-first rows, so the first column starts with blanks before 1 January.
  const offset = (new Date(year, 0, 1).getDay() + 6) % 7;
  const blanks = '<div class="epg__box epg__box--empty"></div>'.repeat(offset);
  const days = Array.from({ length: isLeapYear(year) ? 366 : 365 }, (_, index) =>
    postDays.has(index + 1) ? '<div class="epg__box epg__hasPost"></div>' : '<div class="epg__box"></div>'
  ).join('');
  const months = MONTHS.map(month => `<div>${month}</div>`).join('');
  return `<div class="epg"><div class="epg__year">${year}</div><div class="epg__months">${months}</div><div class="epg__squares">${blanks}${days}</div></div>`;
};

const postGraph = posts => {
  const postDaysByYear = new Map();
  for (const post of posts) {
    const date = new Date(post.date || post.data.date);
    const year = date.getFullYear();
    if (!postDaysByYear.has(year)) postDaysByYear.set(year, new Set());
    postDaysByYear.get(year).add(dayOfYear(date));
  }
  return [...postDaysByYear.keys()]
    .sort((a, b) => b - a)
    .map(year => yearGraph(year, postDaysByYear.get(year)))
    .join('');
};

export default postGraph;
