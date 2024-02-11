---
title: Some Words on Webmentions
date: 2024-02-11T00:11Z
tags:
  - blogging
  - indieweb
  - webmentions
  - blogging-tools
---
[Webmentions](https://indieweb.org/Webmention) are one of those things I like the *idea* of, but not always the *practicalities* of - particularly in the [extended IndieWeb sense of it](https://indieweb.org/responses). The idea of sending and receiving Likes and other interactions to/from other websites is pretty cool in theory, and helps bring that sense of community that is sometimes lacking in the modern version of the blogosphere. Time was you'd get a trackback/pingback from a response to a post you'd written, go check out the response post on the author's site, then continue the conversation on your own blog. This back-and-forth was key to building up ties within groups and sub-groups on different topics. Webmentions are, at their core, just an iteration on the core technology behind that.

However, there are pretty significant problems with Webmentions as they stand. [Wouter lists a bunch of issues he came across](https://brainbaking.com/post/2023/05/why-i-retired-my-webmention-server/), and I can empathise with all of them, even if I haven't experienced each and every item on the list. The points about microformats and Brid.gy (4 & 5) definitely hit home.

Microformats is by far the biggest pain in the arse (in my humble opinion) to get right if you want to use the IndieWeb formats. Not insurmountable, but definitely fiddly. When I recently implemented my Bookmarks page, getting the requisite microformats *just right* to show as a "bookmark-of" took by far the longest time of all the work involved. And absolutely, Brid.gy far and away accounts for the vast majority of webmentions I receive; I guess it's to be expected when it pulls in all the interactions from social media for you.

However, [Robb hits on the biggest potential issue with the way most sites implement webmentions: privacy](https://rknight.me/blog/mastodon-webmentions-and-privacy/). It's something I first noticed on an old version of my blog: if Brid.gy (or another bridge service) sends social media interactions to your site, and your site is setup to save and display those interactions, then the person interacting with you has - probably inadvertently - had their details and words published to your site. They then lose all control over what is or isn't displayed. If they should later delete their interaction it is highly unlikely in the current implementations of the various bits of software involved that the deletion will be replicated back to your site. I had more than one instance where a Twitter mutual were shocked to discover some of their replies/likes at the bottom of some of my posts. Most didn't mind, but a couple really didn't like it so I went ahead and deleted the data for them manually.

It was these interactions which led to me not adding webmentions at all to this site for a long time after it went live, despite wanting to. Even now I can send and receive, nothing is displayed anywhere on the site itself.

So what do we do about these concerns around webmentions? Or rather, what am *I* going to do[^1]? Well, I still hold to the promise of webmentions as a community building tool. I still want to receive them, even if the ones I care about get drowned out. They let me know where people are linking to my site from, and to an extent, what posts have resonated. In that vein, I still plan to send them - to let other people know when I link to them - though I might not spend any time sweating to get the microformats right. But what I'm *not going to do* is display my webmentions publicly. I had been considering it for a while, but the recent discussion has made up my mind against it. At most I *might* display a simple count of the different types of webmention a post has received.

To be 100% transparent though: for my own convenience I am planning on adding a private dashboard that will display webmentions in a nice UI, but for my eyes only. Azure SWA lets me lock particular sections of my site behind role-based authentication, so I will be taking advantage of that. If only because the RSS feed from webmention.io isn't always the clearest thing to read. One feature I'm definitely implementing is a filter to let me hide Brid.gy webmentions and focus on webmentions from blogs.

[^1]: I ain't the boss of you, so you do what you will.