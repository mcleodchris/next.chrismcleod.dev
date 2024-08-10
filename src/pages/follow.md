---
title: Follow
permalink: /follow/index.html
description: All the ways you can follow me online
layout: page
---

## Follow this Blog

I post a growing range of differnt "things" on this site. While there is no "all in one" feed (yet), you can follow each of the differnt post types through one of these feeds:

| Post Type         | RSS feed            | JSON feed             | Atom feed             |
|-------------------|---------------------|-----------------------|-----------------------|
| Blog posts        | [Feed][blogrss]     | [Feed][blogjson]      | [Feed][blogatom]      |
| Bookmarks         | [Feed][bookmarksrss]| [Feed][bookmarksjson] | [Feed][bookmarksatom] |
| Short-form posts  | [Feed][notesrss]    | [Feed][notesjson]     | [Feed][notesjson]     |
|                   |                     |                       |                       |

To follow one of these feeds, copy the address using your browser, and paste it into your feed reader of choice.

The missing formats will be added as soon as I work through the technicalities, and any new post types will be added in time.

## Follow me Elsewhere

I'm not a big social media guy these days, but I do keep a couple of accounts active, mostly for reposting links to this blog and finding "neat stuff". You can find me in the following places:

- [{{meta.meta_data.fediverseCreator}}][masto] (Mastodon)
- [{{meta.meta_data.githubCreator}}][gh] (GitHub)
- [{{meta.meta_data.blueskyCreator}}][bsky] (BlueSky)


[blogatom]: {{meta.url}}/follow/blog/feed.atom
[blogrss]: {{meta.url}}/follow/blog/feed.rss
[blogjson]: {{meta.url}}/follow/blog/feed.json
[bookmarksjson]: {{meta.url}}/follow/bookmarks/feed.json
[bookmarksatom]: {{meta.url}}/follow/bookmarks/feed.atom
[bookmarksrss]: {{meta.url}}/follow/bookmarks/feed.rss
[notesjson]: {{meta.url}}/follow/notes/feed.json
[notesatom]: {{meta.url}}/follow/notes/feed.atom
[notesrss]: {{meta.url}}/follow/notes/feed.rss
[masto]: {{meta.meta_data.mastodonProfile}}
[gh]: {{meta.meta_data.githubProfile}}
[bsky]: {{meta.meta_data.blueskyProfile}}

{% include '../_layouts/footer.njk' %}