import { absoluteUrl } from '@11ty/eleventy-plugin-rss';

/** The JSON Feed (https://jsonfeed.org/version/1.1) for each entry in `feeds`. */
export default class JsonFeed {
  data() {
    return {
      pagination: { data: 'feeds', size: 1, alias: 'feed' },
      permalink: data => `/follow/${data.feed.key}/feed.json`,
      eleventyExcludeFromCollections: true,
      excludeFromSitemap: true
    };
  }

  render({ feed, meta, collections, page }) {
    const items = collections[feed.collection].slice(0, feed.limit).map(post => {
      const tags = this.filterTagsFromFeeds(post.data.tags);
      const isBookmark = post.data.layout === 'bookmark';
      const posse = {
        externalLink: isBookmark,
        layout: post.data.layout,
        type: post.data.type,
        title: post.data.title,
        author: post.data.author,
        bookmark: post.data.bookmarkOf,
        content: post.templateContent,
        permalink: this.stripIndex(post.url)
      };
      return {
        id: post.url ?? '',
        title: post.data.title ?? '',
        url: absoluteUrl(this.stripIndex(post.url), meta.url),
        content_html: post.templateContent,
        summary: post.data.excerpt ?? '',
        image: post.data.image ? this.url(post.data.image) : '',
        ...(isBookmark && { external_url: this.url(post.data.bookmarkOf ?? '') }),
        _posse: {
          masto_text: this.makeTootText(posse),
          bsky_text: this.makeBlueskyText(posse),
          tags,
          opengraph: this.socialImageUrl(post.data)
        },
        date_published: this.dateForFeed(post.date),
        tags
      };
    });

    return JSON.stringify(
      {
        version: 'https://jsonfeed.org/version/1.1',
        user_comment:
          'This is a JSON feed. Subscribe by copying the URL from the address bar into your newsreader.',
        title: `${meta.blog.name} — ${feed.name} — JSON Feed`,
        description: meta.siteDescription,
        home_page_url: meta.url,
        feed_url: absoluteUrl(page.url, meta.url),
        authors: [{ name: meta.author, url: meta.url, avatar: meta.indieweb.avatar }],
        items
      },
      null,
      2
    );
  }
}
