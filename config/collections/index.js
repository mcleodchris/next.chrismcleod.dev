const {get} = require('lodash');

/** Returns all blog posts as a collection. */
const getAllPosts = collection => {
  const posts = collection.getFilteredByGlob('./src/posts/*.md');
  return posts.reverse();
};
const getAllSubscriptions = collection => {
  const subscriptions = collection.getFilteredByGlob('./src/subscriptions/*.md');
  // sort subscriptions by category, alphabetically
  subscriptions.sort((a, b) => {
    if (a.data.category > b.data.category) return 1;
    if (a.data.category < b.data.category) return -1;
    return 0;
  });
  return subscriptions;
};

const tagList = collection => {
  const tagsSet = new Set();
  getAllPosts(collection).forEach(item => {
    if (!item.data.tags) return;
    item.data.tags
      .filter(tag => !['posts', 'all'].includes(tag))
      .forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort((tag1, tag2) => {
    if (
      collection.getFilteredByTag(tag1).length > collection.getFilteredByTag(tag2).length
    )
      return -1;
    if (
      collection.getFilteredByTag(tag1).length < collection.getFilteredByTag(tag2).length
    )
      return 1;
    return 0;
  });
};

const getAllBookmarks = collection => {
  const posts = collection.getFilteredByGlob('./src/bookmarks/*.md');
  return posts.reverse();
};

const getBookmarksFeed = collection => {
  const bookmarks = getAllBookmarks(collection);
  return bookmarks.map(bookmark => {
    return {
      title: bookmark.data.title,
      permalink: bookmark.url,
      tags: bookmark.data.tags,
      url: bookmark.data['bookmark-of'],
      date: bookmark.data.date
    };
  });
};

module.exports = {
  getAllPosts,
  getAllSubscriptions,
  tagList,
  getAllBookmarks,
  getBookmarksFeed
};
