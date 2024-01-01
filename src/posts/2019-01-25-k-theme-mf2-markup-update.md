---
title: '"K" Theme MF2 Markup Update'
date: 2019-01-25
categories:
  - articles
  - notes
tags:
  - development
  - indieweb
  - k-theme
  - mf2
  - theme
  - wordpress
authors:
  - chris
archived: true
---

(Skip to the end for the TL;DR summary)

After an evening of debugging and rewriting sections of the HTML in ["K"](/blog/the-road-to-open-sourcing-k-for-wordpress/), I think I've fixed the markup and parsing issues [I mentioned yesterday](/blog/k-theme-update-24-jan-2019/).

It turns out that [X-Ray](https://xray.p3k.io/), the parsing engine used by IndieNews, Aperture, and probably others, was only finding the sidebar h-card in my markup. The rest of the content was being ignored. I'm not entirely sure why this is, to be honest, but it gave me a place to start.

Working from the (admittedly shakey) basis that if the parser was only going to find one mf2 entity on the page, then I'd want it to be the main h-feed or h-entry… so I started moving around some blocks of HTML and a few classes, and stripped out a few likely redundant pieces of HTML.

This… worked! The feed would show up in the X-Ray output instead of the h-card, and wasn't all that different in the Pin13 parser compared to yesterday's results. But it was far from ideal. The authorship information on every feed entry was screwed up; I'd made a change yesterday so only one full h-card was on the page (the sidebar) and [followed the recommendation](https://indieweb.org/authorship) to markup the h-entry author details with `u-author` instead. Now came the conundrum: do I add back in a dedicated h-card to every h-entry, and by doing so re-break some of the other parsers looking for a single "representitive" h-card? I tried out adding them back in, just to see what happened. X-Ray was still fixed, but IndieWebify.me complained about it, and the IndieWeb Webring still couldn't work out who I was.

I could have left it here. X-Ray was the main target, IndieWebify might not have liked it but could at least still see some details, and IndieWeb Webring was a "nice to have" in a way. But truth be told, it would have nagged at me. What if these "minor" issues were the proverbial [canary](https://en.wiktionary.org/wiki/canary_in_a_coal_mine)? I want to achieve the widest possible compatibility now, to reduce potential issues at a later date.

It was around about this point that I remembered that an h-feed itself [could have its own embedded h-card](http://microformats.org/wiki/h-feed#Core_Properties), which could potentially solve the issue. After moving my 'h-feed' class to the `body` element, instead of the `main` I'd been using up to then (so now it would use the sidebar h-card to represent the feed), it more or less did solve the issue.

It threw me at first that X-Ray didn't list a separate h-card item like Pin13 did, but instead used the feed h-card for the authorship of every nested h-entry. Removing the now redundant author h-card from the entries stopped IndieWebify from grousing about these multiples. Oh, and here's my new profile page on the [IndieWeb Webring](https://xn--sr8hvo.ws/%F0%9F%92%8B%F0%9F%92%A4%F0%9F%8F%8E). Even my test microformat-based feed in Aperture/Monocle started displaying posts almost immediately after applying the change.

So, **TL;DR**: I moved my main h-card inside the h-feed, instead of it being a distinct entity on the page. By doing so I fixed pretty much all of the microformat parsing issues I was experiencing, which means "K" has taken a big leap forward… and I can stop pulling my hair out ?

Shared to [IndieNews](https://news.indieweb.org/en) (maybe) and [IndieWeb.xyz](https://indieweb.xyz/en/indieweb).
