const kinds = [
  {kind: 'blog', name: 'Blog Posts', collectionName: 'postsForFeed', limit: 24},
  {kind: 'notes', name: 'Notes', collectionName: 'notesForFeed', limit: 50},
  {kind: 'bookmarks', name: 'Bookmarks', collectionName: 'bookmarksForFeed', limit: 50}
];
const feeds = kinds.map(f => ({...f, permalink: `/follow/${f.kind}/feed.json`}));
export const xmlFeeds = kinds
  .flatMap(f =>
    ['atom', 'rss'].map(format => ({
      ...f,
      format,
      permalink: `/follow/${f.kind}/feed.${format}`
    }))
  )
  .concat([
    {...kinds[0], format: 'atom', legacy: true, permalink: '/feed.xml'},
    {
      ...kinds[2],
      format: 'atom',
      collectionName: 'bookmarks',
      limit: 24,
      legacy: true,
      permalink: '/bookmarks/feed.xml'
    }
  ]);
export const discoveryFeeds = kinds
  .flatMap(f =>
    ['atom', 'rss', 'json'].map(format => ({
      title: `chrismcleod.dev: ${f.kind === 'blog' ? 'main blog' : f.kind} feed (${format === 'atom' ? 'Atom' : format.toUpperCase()})`,
      url: `/follow/${f.kind}/feed.${format}`,
      type: {atom: 'atom+xml', rss: 'rss+xml', json: 'feed+json'}[format]
    }))
  )
  .sort((a, b) => {
    const order = ['blog', 'bookmarks', 'notes'];
    return order.indexOf(a.url.split('/')[2]) - order.indexOf(b.url.split('/')[2]);
  });
export default feeds;
