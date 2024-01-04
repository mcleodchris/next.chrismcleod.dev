---
title: "Experiences with Cloudflare blocking Bridgy"
date: 2019-01-21
categories:
  - articles
  - notes
tags:
  - brid-gy
  - indieweb
  - syndication
authors:
  - chris
archived: true
---

I just had a weird issue where Cloudflare was blocking [Bridgy](https://brid.gy/) from syndicating posts from my site.

Attempting to syndicate from either my WordPress editor, or the Bridgy user page would result in an error like this:

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/01/89DA13CB-BB69-457C-B224-6789015F158B.jpeg", "Bridgy Error: Error: <!-- Access denied I mrkapowski.com used Cloudflare to restrict access body{margin:0;padding:0} <!-- <!-- Please enable cookies. Error 1010 Ray D: 49cce1e12cad5552 • 2019-01-21 21:30:29 UTC Access denied What happened? The owner of this website (mrkapowski.com) has banned your access based on your browser's signature (49cce1e12cad5552-ua48). Cloudflare Ray D: 49cce1e12cad5552 • Your IP: 35.187.132.5 • Performance & security by Cloudflare window._cf_translation = {}; HTTP Error 403: Forbidden" %}.

Now, I’ve never consciously set anything to say “don’t let Bridgy access my site,” have few settings turned on, and haven’t logged in to Cloudflare in months, so it felt like it must’ve been that some rule update on the Cloudflare side that started flagging the requests as potentially malicious. Unfortunately, Cloudflare’s settings are rather opaque - especially on the free tier. More annoyingly, the “Ray ID” in the error didn’t match anything in the limited logs I do get access to.

But, I’m nothing if not persistent… after a bit of trial and error - switching things off and testing again with Bridgy - and I was able to track down the culprit setting, in the “Scrape Shield” section of the control panel, labelled “Server-side Excludes”:

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/03/23580C6D-110F-4B15-945C-11F233A12CC8.png", "Screenshot of the server-side excludes toggle" %}

With this turned off, Bridgy could syndicate my posts again.

I’m starting to wonder if this setting is a contributing factor to the issues I’ve had where Webmentions and associated posts like Replies, Likes, and others seemingly haven’t worked? Perhaps someone with more experience with Cloudflare or the various IndieWeb tools could shed some light?

At the very least, I hope this post saves someone a bit of head-scratching if they suddenly find their Bridgy integration stops working.
