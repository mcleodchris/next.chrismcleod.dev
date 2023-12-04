---
title: So About That Feed Reader-Only Blog Idea
date: 2023-12-04T12:32Z
tags:
  - blogs
  - blogging
  - social-media
  - feeds
  - experiment
gradient: "true"
---
In my last post I included a footnote about a RSS-only blog idea I’d had ages ago and not done anything with:

> This reminds me of the time I mused about setting up a site that was only an RSS feed. No web pages beyond the bare minimum needed for feed discovery, or maybe a splash to let people know what’s going on. The idea never came to anything, but _maybe_…?

Well, thanks to some encouragement from Robb, I’m giving it a try. Say hello to [theunderground.blog][ug][^1]. As I mention in the first entry (issue?) there's a lot I'm still figuring out, but the more boring technical aspects are largely in place. I literally took the Eleventy template for my site, stripped it back to just the Atom feed and a minimal home page, then called it a day. The most interesting part of it was getting Eleventy to delete all of the rendered posts after build so that there really wouldn't be any permalinks that snuck through.

I treated Entry #1 as if it were almost an old-style email newsletter[^2], with a quick introduction blurb and then some interesting links, and honestly - I really enjoyed the format and will probably continue with it. I haven't figured out what cadence posts will be; I'm not really a daily blogger any more, but somewhere between twice weekly and twice monthly will be where we land. It will probably evolve over time too, but we'll have to see. It's very early days!

The email newsletter comparison is probably the best mental model for a feed-only format. I can't directly link to any entries, and I have little to no control over how it will be presented by clients. I just write, publish, then hope it lands in your feeds correctly. At least there's no DKIM or SPF or spam filters to worry about. That "no linking" thing is the biggest brain twister I've come across so far. I'm so used to just tossing a link out to a post I've written it's second nature, and I can't do that here. It's [the homepage][ug] or [the feed][uf], or nothing! By its nature, entries might also be somewhat ephemeral. If you subscribe after, say, Entry #100, then I cannot be sure a feed reader will import right the way back to the beginning. It's going to be an interesting journey of discovery.

So please [subscribe][uf] to find out where this little experiment ends up going, and if you have any feedback, you *should* be able to webmention this post now, or find other contact details at the bottom of the first entry over on theunderground.blog.

[ug]: https://theunderground.blog
[uf]:https://theunderground.blog/feed.xml

[^1]: I’m still figuring out the "branding" - theunderground.blog? The Underground Blog? The Underground? TheUnderground? You get the idea! Some of them veer a bit too close to music "zine".
[^2]: Not your new-fangled ones like Substack or Buttondown that also give you a web version of each issue as an archive copy.
