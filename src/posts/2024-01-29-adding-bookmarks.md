---
title: Adding a Bookmarks Page
date: 2024-01-29T17:00Z
tags:
  - site-meta
  - bookmarks
---
I mentioned over on [The Underground](https://theunderground.blog/) that one thing I wanted to add to my site, to "do more" with it, was a space to collect bookmarks and fun links I com across. Well, I've added a quick and dirty "first draft" of the feature over on the new [/bookmarks](https://chrismcleod.dev/bookmarks/) page. It's even got its [own feed](https://chrismcleod.dev/bookmarks/feed.xml) you can use to follow along at home.

I'd had the idea for the page a while ago, but the real motivation to get it done came with a recent push to get more people sharing links they'd enjoyed on their website more often (See, for example: [Cassidy](https://blog.cassidoo.co/post/human-curation/), [Hidde](https://hidde.blog/sharing-links/), and [Joan](https://joanwestenberg.com/blog/curation-is-the-last-best-hope-of-intelligent-discourse)). I wanted to have a way of sharing these links that in a way that didn't need me to dedicate a whole blog post to them[^1], giving me the opportunity to be more spontaneous about it.

## Fun(?) Technical Notes:

When I add a bookmark it should trigger a webmention to the page in question (if it supports webmentions), and if the other site supports microformats then it should show up as an IndieWeb "bookmark-of". This was by far the most fiddly bit to get right.

In terms of adding bookmarks - I'm using a combination of IndieKit and a "bookmark on my site" iOS shortcut I made using the guide I wrote a few years back: [IndieWeb Sharing with iOS Shortcuts](https://chrismcleod.dev/blog/indieweb-sharing-with-ios-shortcuts/) . Hurrah for blog archives, otherwise I'd have had to figure this out again from scratch! I have a few minor niggles to iron out, but adding bookmarks is overall pretty easy for me to do.

[^1]: I am thinking about automating some sort of "weekly round-up post" that will include bookmarks + other content I add to the site. But not yet, as I don't quite have everything in place as I'd like it.
