import { identity } from '../../config/identity/index.js';

export default {
  layout: 'bookmark',
  tags: ['bookmark', 'timeline'],
  permalink: data => `${identity('bookmark', data.title).url}index.html`,
  eleventyComputed: {
    feedFooter:
      "[{{ title }}]({{ bookmarkOf | url }}), bookmarked {{ date | formatDate('MMMM D, YYYY') }} on [Chris McLeod's bookmark page](/bookmarks)."
  }
};
