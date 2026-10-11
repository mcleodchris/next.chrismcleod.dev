import meta from './meta.js';

/**
 * Every published feed. Each entry is served at /follow/<key>/feed.{atom,rss,json};
 * an entry with `legacy` is also served as an older Atom feed whose contract
 * (URL, id, title, entry count and entry links) predates the /follow/ feeds.
 */
export default [
  {
    key: 'blog',
    name: 'Blog Posts',
    label: 'main blog feed',
    collection: 'posts',
    limit: 24,
    legacy: {
      url: '/feed.xml',
      limit: 24,
      id: `${meta.url}/`,
      title: meta.blog.name,
      subtitle: meta.blog.description,
      entryLink: 'permalink',
      footer: false
    }
  },
  {
    key: 'bookmarks',
    name: 'Bookmarks',
    label: 'bookmarks feed',
    collection: 'allBookmarks',
    limit: 50,
    legacy: {
      url: '/bookmarks/feed.xml',
      limit: 24,
      id: `${meta.url}/`,
      title: "Chris McLeod's bookmarks",
      subtitle: 'Links saved by Chris McLeod',
      entryLink: 'bookmarkOf',
      footer: true
    }
  },
  { key: 'notes', name: 'Notes', label: 'notes feed', collection: 'allNotes', limit: 50 }
];
