---
title: "Archive Digging"
date: 2004-12-07
categories:
  - articles
authors:
  - chris
archived: true
tags:
  - site-meta
  - web-design
---

When I implemented dated URLs for the blog, I [mentioned](/2004/11/21/minor-site-tweaks/ "Minor Site Tweaks") that I had a particular idea that I wanted to implement. This idea is simple enough – an easy, convenient way for a reader to find entries in the archives. The basics of the idea are explained, in [Michael’s](https://web.archive.org/web/20060223182810/http://binarybonsai.com/) [discussion on his recent redesign](https://web.archive.org/web/20060223182810/http://binarybonsai.com/archives/2004/11/21/freya-dissection/). He calls it a “Digging archive system”, for lack of a better term. Think of it as a “lite” version of Apple’s Finder, but for you weblog archives.

Since Michael explained what he was looking, I’ve been thinking about the problem a lot. It’s an incredibly cool/good idea. The trick is implementing it. The page shouldn’t reload as you dig through the archives, which excludes a purely server-side solution. That leaves XMLHttpRequest (ala [Livesearch](https://web.archive.org/web/20060223182810/http://blog4.bitflux.ch/wiki/LiveSearch)) or preloading _all_ the data on the page when it loads.

As cool as XMLHttpRequest is, I can’t think of an efficient, graceful method of achieving the desired look ‘n’ feel (if anyone wants to show me a way, feel free!). Instead, I’ve been leaning towards a mixture of CSS and DOM to provide a solution

By using nested lists, we can build up a semantic structure of the archives. In my example it is structured by date, but I can also imagine things working for the standard section/category structure of a standard Textpattern site. Consider this (very) basic structure:

\[image lost\]

Obviously this would be far larger depending on the size of the archives. The classes are there to allow you to style the lists in case javascript is turned off. If javascript is available, we add a second class to the <`ul>` elements, otherwise they are left alone. Graceful degredation is _good_. In the same vein, the idea is to _not_ have to use `onclick="..."` attributes in our XHTML, but to use DOM to add the event listeners. Gotta keep the code clean!

I can imagine the system working like this:

- The latest year/month/posts are displayed by default
- Only years/months that have posts are listed.
- When a reader clicks on a month, the relevant posts are displayed and previously displayed posts are hidden
- When a reader clicks on a year, all the previously displayed months are hidden and the relevant months are displayed
- Clicking on a post title takes the reader to the entry.

Toggling the visibility of a list is handled by setting its display property to either “none” or “block”. All other layout is controlled by the stylesheet. So we could end up with something that looks like the following (top is what it looks like with javascript enabled, bottom is how it would display otherwise, if CSS is still enabled) –

\[image lost\]

That’s the theory, anyway. The problem is that I haven’t got that much in the way of DOM/Javascript “m4d sk1llz”. Is there anyone out there that might be able to point me in the right direction or otherwise help out?
