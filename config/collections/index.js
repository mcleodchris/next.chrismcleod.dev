import {bookmarkUrl} from '../utils/content.js';

export const SYSTEM_TAGS = new Set([
  'all',
  'posts',
  'notes',
  'timeline',
  'bookmark',
  'bookmarks',
  'subscriptions',
  'tagList',
  'bookmarksFeed',
  'graph',
  'notesForFeed',
  'bookmarksForFeed',
  'postsForFeed',
  'likes'
]);
/** Returns all blog posts as a collection. */
const getAllPosts = collection => {
  const posts = collection.getFilteredByGlob('./src/posts/*.md');
  return posts.reverse();
};
const tagList = collection => {
  const tagsSet = new Set();
  getAllPosts(collection)
    .concat(getAllNotes(collection), getAllBookmarks(collection))
    .forEach(item => {
      if (!item.data.tags) return;
      item.data.tags
        .filter(tag => !SYSTEM_TAGS.has(tag))
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
      url: bookmarkUrl(bookmark.data),
      date: bookmark.data.date
    };
  });
};

// a new collection named graph, which combines posts and bookmarks
const getGraph = collection => {
  const posts = getAllPosts(collection);
  const bookmarks = getAllBookmarks(collection);
  const notes = getAllNotes(collection);
  return posts
    .concat(bookmarks)
    .concat(notes)
    .sort((a, b) => {
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

export {
  getAllNotes,
  getAllPosts,
  tagList,
  getAllBookmarks,
  getBookmarksFeed,
  getGraph,
  notesForFeed,
  bookmarksForFeed,
  postsForFeed
};

export default function collectionsPlugin(config) {
  for (const [name, fn] of Object.entries({
    posts: getAllPosts,
    tagList,
    bookmarks: getAllBookmarks,
    bookmarksFeed: getBookmarksFeed,
    graph: getGraph,
    notesForFeed,
    bookmarksForFeed,
    postsForFeed
  }))
    config.addCollection(name, fn);
}
