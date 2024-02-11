---
title: More Words on Webmentions (and Backfeed)
date: 2024-02-11T13:42Z
tags:
  - indieweb
  - webmentions
  - backfeed
---
## Webmentions aren't actually the problem
After my earlier[ post on webmentions](https://chrismcleod.dev/blog/some-words-on-webmentions/), <a href="https://campegg.com/2024/02/11/over-the-last.html" class="u-in-reply-to">Cam kindly reminded me that the bit I felt uneasy about is actually <em>backfeed</em></a>. To quote the IndieWeb wiki:

> **Backfeed** is the process of syndicating [interactions](https://indieweb.org/interactions "interactions") on your [POSSE](https://indieweb.org/POSSE "POSSE") copies _back_ (AKA reverse syndicating) to your original posts.

It's interesting reading the [discussion section](https://indieweb.org/backfeed#Discussion) on the wiki page, as it acknowledges some of the concerns that have come up of late, but ultimately, skims over them.

The list of "pro" reasons for backfeed mentions making it easier for people to reply, particularly those who are less technical. However true this might be, I believe it's probably equally true that the less technical someone is the then less likely they will understand *why* their words are appearing on a different site. Their expectations[^1] are almost certainly "I replied/liked/whatever on Site A (more likely *App* A), so it's not going to appear on Site B". Is it right we're[^2] subverting these expectations in an effort to make blogs and personal websites "more social"?

Aside from the privacy and implementation concerns noted in the last post, Cam noted in his own post that another problem backfeed can lead to is [context collapse](https://indieweb.org/context_collapse). This isn't a problem I have much experience with (so can't really talk to it) but I thought it worth noting here for completeness.

## This is not a new discussion
Terrence[ wrote about the ethics of this topic](https://shkspr.mobi/blog/2022/12/the-ethics-of-syndicating-comments-using-webmentions/) in 2022. His concerns were/are pretty much identical to my own. Bix wrote similarly [on the integration of ActivityPub into everything](https://bix.blog/2024/01/11/activitypub-is-to-the-indieweb-as-a-i-is-to-silicon-valley/) just last month. Sebastian wrote [an in-depth look at the problem](https://sebastiangreger.net/2018/05/indieweb-privacy-challenge-webmentions-backfeeds-gdpr/) - particularly through the lens of GDPR - back in 2018! There will be many more posts out there about the issues - and no doubt, potential solutions - to the problems with backfeed as a concept. If you know of any good ones, please send it my way [on Mastodon](https://mastodon.online/@mstrkapowski).

## It's on us as webmasters
(Yeah, I cited [the deep magic](https://thehistoryoftheweb.com/postscript/what-happened-to-the-webmaster/). Substitute for "site admin" or "site owner" if you prefer.)

How we handle the issues that have been raised is ultimately on us: the people who build and run the websites who integrate these features. We have to be more thoughtful about these things rather than rushing to "oh, cool new technology". I didn't really pay the issues much heed when I first implemented backfeed in 2019, but I should have.

There might come a day when users expect their details, words, and actions could show up on other sites they weren't aware of. ActivityPub and other forms of the Fediverse and federation might herald that future. But I don't think we're there yet, and I'm not convinced everyone will buy into it. I've seen enough threads on Bluesky where someone reacts with abject horror when they learn that [basically *everything* on Bluesky is public](https://bsky.social/about/blog/5-19-2023-user-faq), and similar threads when someone learns just how far public posts on Mastodon can reach.

By all means send and receive webmentions. Even backfeed interactions onto your site. Just be mindful of how you do it and whether displaying all the data you receive is the best thing to do.

{% image "https://assets.chrism.cloud/chrismcleod.dev/can_vs_should.jpg", "Dr Ian Malcolm in Jurassic park: You were so preoccupied with whether or not you could, you didn’t stop to think if you should" %}

## A quick clarification: I ❤️ Brid.gy
I wrote my last post pretty quickly and late at night, immediately before going to bed. After a re-read this morning I felt that it occasionally came across as me having a go at Brid.gy. That wasn't my intent; I admire the technical feat of what Brid.gy achieves and could achieve in the future, and I respect that it is an open service helping to link disparate parts of the internet together, for free. My issues really lie with the *consumption* of what Brid.gy provides, rather than Brid.gy itself.

[^1]: Yes, this is a massive generalisation, but I like to think it comes from a place of experience.
[^2]: I'll use "we" and "us" a fair bit in this post. It's largely the "[royal we](https://en.wikipedia.org/wiki/Royal_we)". As I've said before: I ain't the boss of you.