import {createJsonFeed} from '../../config/feeds.js';
export default class {
  data() {
    return {
      pagination: {data: 'feeds', size: 1, alias: 'feed'},
      permalink: data => data.feed.permalink,
      eleventyExcludeFromCollections: true,
      excludeFromSitemap: true,
      layout: null
    };
  }
  render({feed, collections, meta}) {
    return JSON.stringify(
      createJsonFeed(feed, collections[feed.collectionName], meta),
      null,
      2
    );
  }
}
