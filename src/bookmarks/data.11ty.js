import {bookmarkUrl} from '../../config/utils/content.js';
export default class {
  data() {
    return {
      permalink: '/bookmarks/data.json',
      eleventyExcludeFromCollections: true,
      excludeFromSitemap: true,
      layout: null
    };
  }
  render({collections, meta}) {
    return JSON.stringify(
      {
        bookmarks: collections.bookmarks.map(post => ({
          title: post.data.title,
          url: bookmarkUrl(post.data),
          tags: post.data.tags.filter(t => t !== 'bookmark'),
          date: post.date.toISOString(),
          permalink: new URL(post.url, meta.url).href
        }))
      },
      null,
      2
    );
  }
}
