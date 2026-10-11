import {enrichImages} from './images/enrich.js';
import {resolveSocialImage} from './images/social.js';
import {bookmarkUrl} from './utils/content.js';
import {makeTootText, makeBlueskyText} from './filters/posse.js';
import {filterTagsFromFeeds, stripIndex} from './filters/index.js';
export function jsonFeedItem(post, meta) {
  const content = enrichImages(post.templateContent),
    tags = filterTagsFromFeeds(post.data.tags || []);
  const posse = {
    externalLink: post.data.layout === 'bookmark',
    layout: post.data.layout,
    type: post.data.type,
    title: post.data.title,
    author: post.data.author,
    bookmark: bookmarkUrl(post.data),
    content,
    permalink: stripIndex(post.url)
  };
  return {
    id: post.url,
    title: post.data.title || '',
    url: new URL(stripIndex(post.url), meta.url).href,
    content_html: content,
    summary: post.data.excerpt || '',
    image: post.data.image || '',
    ...(post.data.layout === 'bookmark' ? {external_url: bookmarkUrl(post.data)} : {}),
    _posse: {
      masto_text: makeTootText(posse),
      bsky_text: makeBlueskyText(posse),
      tags,
      opengraph: resolveSocialImage(post.data, meta)
    },
    date_published: post.date.toISOString(),
    tags
  };
}
export function createJsonFeed(feed, posts, meta) {
  if (!posts) throw new Error(`Missing feed collection: ${JSON.stringify(feed)}`);
  return {
    version: 'https://jsonfeed.org/version/1.1',
    user_comment:
      'This is a JSON feed. Subscribe by copying the URL from the address bar into your newsreader.',
    title: `${meta.blog.name} — ${feed.name} — JSON Feed`,
    description: meta.blog.description,
    home_page_url: meta.url,
    feed_url: new URL(feed.permalink, meta.url).href,
    authors: [{name: meta.author, url: meta.url, avatar: meta.indieweb.avatar}],
    items: posts.slice(0, feed.limit).map(post => jsonFeedItem(post, meta))
  };
}
