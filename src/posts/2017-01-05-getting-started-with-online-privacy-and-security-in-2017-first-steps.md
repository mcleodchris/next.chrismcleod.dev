---
title: "Getting Started with Online Privacy and Security in 2017 - First Steps"
date: 2017-01-05
categories:
  - articles
tags:
  - browsers
  - chrome
  - duckduckgo
  - firefox
  - google
  - internet
  - privacy
  - search-engine
  - technology
  - web-browser
authors:
  - chris
archived: true
---

So after the preamble, which should give you a frame of reference to what I'm aiming to do in this mini-series of posts about improving my online privacy and security, this short post will talk about the first steps I'm taking to tighten everything up. As this is all at the very beginning of my learning journey, all of these might change in the future. If they do, I will update the post and add a comment below.

In this post I look at two of the fundamentals of privacy on the web: the web browser and search engine. I'm mainly looking at the desktop for now, rather than mobile, mainly because it's simpler to focus on one thing while I wrap my head around this stuff!

## A Change of Browser

I've been using Chrome for years, after it usurped Firefox as the "fast, alternative" browser for Windows. These days, Chrome has become seriously bloated - it's routinely consuming multiple gigabytes of RAM on my desktop. It may be (usually) fast despite of that, but it slows the rest of the computer. What's more, it's so deeply wired into Google's ecosystem that it's arguably as much a data hoover for Google as it is a browser.

So I was in the market for a new browser to begin with, and I was looking into alternatives like Chromium or Opera. But once I started diving into things a bit more, pretty much every recommendation for privacy-minded software recommended [good-old Firefox](https://www.firefox.com/), so that's what I've gone with. I followed [the configuration guide at PrivacyTools.io](https://www.privacytools.io/#about_config), as well as:

- Turn on Do Not Track
- Set Firefox to never remember my browsing/download/search/form history
- Never accept third-party cookies
- Only keep cookies until I close the browser
- Never remember logins for sites
- Turned off Firefox Health Report, Telemetry, and Crash Reporter

### Extensions

Most of the extensions I had installed in Chrome were privacy-minded anyway, so were equally applicable to Firefox. Some additions came recommended. At the moment I am using the following:

- [uBlock Origin](https://addons.mozilla.org/firefox/addon/ublock-origin/)
- [HTTPS Anywhere](https://www.eff.org/https-everywhere)
- [Self-Destructing Cookies](https://addons.mozilla.org/firefox/addon/self-destructing-cookies/) (possibly redundant due to browser settings)
- [Decentraleyes](https://addons.mozilla.org/firefox/addon/decentraleyes/)
- [Privacy Badger](https://www.eff.org/privacybadger) (possibly redundant)
- [Random Agent Spoofer](https://addons.mozilla.org/en-US/firefox/addon/random-agent-spoofer/)
- [1Password](https://agilebits.com/onepassword/extensions)
- [Google Search Link Fix](https://addons.mozilla.org/en-US/firefox/addon/google-search-link-fix/) (just in case… see the search engine section)

### Mobile

The situation on mobile (in my case, iOS) is a bit less clear. For now I'm not using the Chrome iOS app, reverting to Safari with the addition of a content blocker.

### Downsides

The biggest issue with the above setup is it removes a few conveniences: remembering pinned tabs between browser sessions; having to login to websites _every_ time you visit; having to retrace your steps to find a page in the future, if you don't bookmark it at the time… that sort of thing. I might do a little tuning on this, relaxing the settings a little, but overall I think this might be one of those things that I need to live with.

## A Change of Search Engine

Apart from a brief flirtation with [DuckDuckGo](https://start.duckduckgo.com/) a few years back, I've always used Google as my search engine. It's constantly been the most reliable, fastest, and all-round best at what it does.

Even so, I've never been 100% happy with the fact that Google collects just about every data point they can, that it's all wrapped up in your Google account, linked to everything you do in their other services, and made available for advertisement targetting (amongst who knows how many other things). As someone who's [had a Gmail account since they were invite only](http://chrismcleod.me/2004/06/25/gmail-or-die/), I _know_ Google has a fucktonne of data on me already; the genie is well and truly out of the bottle in that regard.

That doesn't mean I can't stop giving them _more_ data. Sure, they'll get the odd bit here and there when I use YouTube, or the odd email that hits my old, pretty much unused Gmail account, but that's really it - if I change my search engine to somewhere else.

The obvious thing to do would be to revert back to DuckDuckGo, as I already have experience of it, and it's accurate enough… but I wanted to try something different for the moment, while I'm still in the learning phase of this little project.

I tried all [the recommendations at PrivacyTools.io](https://www.privacytools.io/#search). [Searx](https://searx.me/) generally gave me terrible results, but is an interesting idea; [Qwant](https://www.qwant.com) gave me some decent web results, but the included News results were mostly irrelevant, and I couldn't find a way to turn these off. [StartPage](https://www.startpage.com) had been recommended in other places too, and overall was the best performing of the bunch - possibly not surprising, as it's effectively a proxy for Google search, so seems like a win-win in this case. For now, I've set it as the default search engine in Firefox.

### Mobile

For searches on my iPhone, I've set the default search engine to DuckDuckGo, as it's the best of those available.
