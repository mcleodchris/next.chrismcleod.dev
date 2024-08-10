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
      .filter(tag => !['posts', 'all', 'notes', 'timeline'].includes(tag))
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

// a new collection named graph, which combines posts and bookmarks
const getGraph = collection => {
  const posts = getAllPosts(collection);
  const bookmarks = getAllBookmarks(collection);
  const notes = notesForFeed(collection);
  return posts.concat(bookmarks).concat(notes).sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });
};

const getAllNotes = collection => {
  const posts = collection.getFilteredByGlob('./src/notes/*.md');
  return posts.reverse();
};
const notesForFeed = collection => {
  const posts = getAllNotes(collection);
  return posts.slice(0, 50);
};
const bookmarksForFeed = collection => {
  const bookmarks = getAllBookmarks(collection);
  return bookmarks.slice(0, 50);
};
const postsForFeed = collection => {
  const posts = getAllPosts(collection);
  return posts.slice(0, 24);
};



module.exports = {
  getAllPosts,
  getAllSubscriptions,
  tagList,
  getAllBookmarks,
  getBookmarksFeed,
  getGraph,
  notesForFeed,
  bookmarksForFeed,
  postsForFeed
};
