---
title: "K Theme Status Update 2019-01-09"
date: 2019-01-09
categories:
  - articles
  - notes
authors:
  - chris
archived: true
tags:
  - blogging
  - indieweb
  - open-source
  - wordpress
---

I've been [chipping away at K](/blog/the-road-to-open-sourcing-k-for-wordpress/) as time allows over the last week. It's still a long way from where I'd like it to be, but it's getting there...

- All theme files should be compliant with the WordPress Coding Standards, apart from a few instances where I'm planning to rewrite what's there.
- I've made little tweaks here and there to the markup output by the theme, and plan to revisit this continually. I made a [test post to indieweb.xyz](https://indieweb.xyz/en/indieweb), but it didn't quite parse correctly last time. This post should also be submitted - fingers crossed it goes better this time! I'm also curious if [IndieNews](https://news.indieweb.org/en) posting will be more successful.
- Files have been refactored (albeit not yet fully _reorganised_), with a goal of splitting up what was a growing, monolithic functions.php into smaller logical chunks.
- I'm wrestling with how to handle all of the different kinds of posts the theme will support, from a markup and display point of view. My biggest headache at the moment is the treatment of post titles. I might write another post on this topic.
- I've been working on making plug-in support more optional than I had it at the outset. I make heavy use of [Post Kinds](https://github.com/dshanske/indieweb-post-kinds) and other [IndieWeb plug-ins](https://github.com/indieweb/wordpress-indieweb), but don't want the theme to necessarily rely on them.
- Oh, and [the source code is now available on GitHub](https://github.com/MrKapowski/k-theme), in the spirit of "[selfdogfooding](https://indieweb.org/selfdogfood)". I came to the realisation there wasn't anything to be gained by holding the code back, and I even ran the risk of never releasing anything if I waited until it was "ready."

I'm learning quite a bit through this exercise, which is great. It's reinvigorated some of my love of code tinkering; I'm finding that some evenings I'm more keen to sit down at a keyboard than I am to sit at my hobby station, which is something that's not happened in a long time!

_**Update 09:26** - IndieNews submission is still failing, unfortunately. Indieweb.xyz seems to be working, but I had to force a Webmention._
