---
title: '"K" Theme Update 24-Jan-2019'
date: 2019-01-24
categories:
  - articles
  - notes
tags:
  - programming
  - indieweb
  - wordpress
authors:
  - chris
archived: true
---

I've been chipping away at several things over the last two weeks, mostly focussing on markup, presentation, and theme file organisation. I want to get these finalised before I look at theme customisation options. If you've visited the home page, you might have noticed the display of certain post types has been evolving, as I search for a pleasing balance of information, appearance, and not overwhelming a visitor with a wall of text. I don't think I'm quite there yet, so expect a few more iterations. My current thinking is to treat the home page a bit like an "activity feed," where action-type posts such as Likes are displayed in summary manner to give more emphasis to the written posts.

Of course, if you're subscribed to the site RSS or JSON feeds in a reader of some description, you've probably not seen any difference!

The most challenging issue I'm facing is the markup of posts and other page elements to be compliant with the specs of [h-entry](http://microformats.org/wiki/h-entry), [h-card](http://microformats.org/wiki/h-card), and the various post kinds such as: [Like](https://indieweb.org/likes), [Bookmark](https://indieweb.org/bookmark), [Reply](https://indieweb.org/reply), [Repost](https://indieweb.org/repost), and so on.

Everytime I think I have the markup nailed down, something comes along to show me it's broken in some way. I liked a post on [Aaron's site](http://aaronparecki.com/) earlier, and instead of showing as the like I intended it became a regular webmention showing my avatar as a photo, as I've clearly messed up the h-card and u-like-of markup in the last round of edits. So sorry to Aaron for mistakenly filling his responses with my face! The [Pin13 parser](http://pin13.net/mf2/?url=https%3A%2F%2Fmrkapowski.com%2F2019%2F01%2F6532.html) shows the right elements as being present, but [IndieWebify.me](https://indiewebify.me/validate-h-entry/?url=https%3A%2F%2Fmrkapowski.com%2F2019%2F01%2F6532.html) and [Webmention.io](https://webmention.io/aaronpk/webmention/Dim9AB0WsqfwYrcvjKR5) both fail to pick them up. I'm guessing it's an issue with how I've nested things, and/or some stray classes from previous experiments that I've not tidied up? I'll try to get some time to look into it more tonight.

For other - minor - examples, IndieWebring also refuses to pick up my representitive h-card, even though [IndieWebify.me](https://indiewebify.me/validate-h-card/?url=https%3A%2F%2Fmrkapowski.com) tells me I have this setup correctly. [Aperture](http://aperture.p3k.io/) doesn't seem to pick up anything other than my h-card when I use the microformats feed instead of RSS or JSON.

If the markup isn't right then IndieWeb features are unlikely to work correctly - so fixing this is key for an "IndieWeb integrated" theme.

As an aside, and while I'm on the subject of frustrations, I'm having a hell of a time with the Webmentions plugin. Most of the time it feels like they just don't get sent, as I frequently have to manually ping sites (such as with the earlier like post). There's a chance this is related to the above markup issues; if the receiving site can't parse the post that mentioned it, it might just throw the mention away? That feels like a bit of a stretch though.

I need to come up with a better way of testing these things, rather than "just give it a try on here and see if it's worked or not..."

But anyway, "K" is progressing, even if it sometimes feels like one step forward/two steps back. I'd hoped to have a proper "release" ready for some time in February, but at the moment I think March or April are more likely. I'm only getting an hour or two a week to tinker at the moment, and I know I'm going to be busier with other things in February.

Syndicated to [IndieNews](https://news.indieweb.org/en) (hopefully!)

**Updated to add** - IndieNews still doesn't like my site. "Error: no_link_found", every time.
