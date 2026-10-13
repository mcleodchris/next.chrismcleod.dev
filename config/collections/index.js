import { identity } from '../identity/index.js';

/** Tags added by directory data to group content, rather than to describe a topic. */
const SYSTEM_TAGS = ['posts', 'timeline', 'bookmark', 'notes', 'all'];

/** Returns all blog posts as a collection. */
const getAllPosts = collection => {
  const posts = collection.getFilteredByGlob('./src/posts/*.md');
  return posts.reverse();
};
const tagList = collection => {
  const tagsSet = new Set();
  getAllPosts(collection).forEach(item => {
    if (!item.data.tags) return;
    item.data.tags
      .filter(tag => !SYSTEM_TAGS.includes(tag))
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

// Posts, bookmarks and notes, newest first, for the archive's activity graph.
const getGraph = collection => {
  const posts = getAllPosts(collection);
  const bookmarks = getAllBookmarks(collection);
  const notes = getAllNotes(collection);
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

/** Every topic tag used by any item, alphabetically: one tag page each. */
const contentTags = collection => {
  const tags = new Set();
  collection.getAll().forEach(item => {
    [].concat(item.data.tags ?? []).forEach(tag => tags.add(tag));
  });
  SYSTEM_TAGS.forEach(tag => tags.delete(tag));
  return [...tags].sort((a, b) => a.localeCompare(b));
};

/**
 * Old URLs that should forward to a page: every `redirectFrom` path, plus the
 * URL Sequoia advertises for a post when it differs from the post's own URL.
 */
const redirects = collection => {
  const items = collection.getAll().filter(item => item.url);
  const taken = new Set(items.map(item => item.url));
  const result = [];
  const add = (from, to) => {
    if (taken.has(from)) return;
    taken.add(from);
    result.push({ from, to });
  };
  items.forEach(item => {
    [].concat(item.data.redirectFrom ?? []).filter(Boolean).forEach(from => add(from, item.url));
  });
  items
    .filter(item => item.inputPath.startsWith('./src/posts/'))
    .forEach(item => {
      add(`${identity('post', item.data.title).sequoiaPath}/`, item.url);
    });
  return result;
};



export { SYSTEM_TAGS };

export default eleventyConfig => {
  eleventyConfig.addCollection('posts', getAllPosts);
  eleventyConfig.addCollection('allBookmarks', getAllBookmarks);
  eleventyConfig.addCollection('allNotes', getAllNotes);
  eleventyConfig.addCollection('tagList', tagList);
  eleventyConfig.addCollection('contentTags', contentTags);
  eleventyConfig.addCollection('graph', getGraph);
  eleventyConfig.addCollection('redirects', redirects);
};
