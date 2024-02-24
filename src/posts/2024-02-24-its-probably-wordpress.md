---
title: It's Probably WordPress
date: 2024-02-24T23:46:00
tags:
  - blogging
  - tip
---

I can't remember when exactly I started doing this, but if I come across a website that doesn't [explicitly advertise an RSS feed](https://rknight.me/blog/please-expose-your-rss/), I try appending `/feed/` to the domain[^1]. For example https://example.com/feed/. A lot of the time - possibly the majority in the last few years - this returns an RSS feed. This has been particularly handy for sites like local or industry-specific news sites that would prefer me to sign up to a subscription or account I just don't want.

Why does this work? Because, for better or worse, it's probably WordPress under the hood. WordPress is [reckoned to power over 40% of all websites](https://w3techs.com/technologies/details/cm-wordpress). WordPress exposes the default feed on the `/feed/` path[^2].

The point is, if you come across a site you'd like to subscribe to, and can't find a link to the feed, it's worth trying this trick just in case. After all, it's probably WordPress.

[^1]: You can also try looking at the page source for clues. Most CMS software or their plugins fill their output HTML with something that will tell you what created the page. From there you should be able to find out what the default feed URL should be.
[^2]: As a bonus tip, [Ghost](https://ghost.org/) uses `/rss/`.
