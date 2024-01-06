---
title: 'ActivityPub vs Jetpack Boost'
date: 2023-01-04
categories:
  - general-life
tags:
  - activitypub
  - site-meta
  - wordpress
authors:
  - chris
redirectFrom: ['/2023/01/04/activitypub-vs-jetpack-boost/']
---

I just had an interesting issue where [the ActivityPub plugin](https://wordpress.org/plugins/activitypub/) started reporting that my author page on both this site and [Worlds In Miniature](https://worldsinminiature.com/) was no longer serving valid JSON, and so was inaccessible:

{% image "https://assets.chrism.cloud/chrismcleod.dev/2023/01/image-1.png", "a screenshot of part of the Wordpress site health screen. It shows 1 Critical issue reported by the ActivityPub plugin: 'Author URL is not accessible'" %}

Sure enough, checking the URL with cURL, or [an HTTP client like Thunder](https://www.thunderclient.com/) gave a 200 response but no response body. It had been several days since I had last made any changes behind the scenes, and everything had been working in the interim, so I was a bit stumped.

Anyway, after a bit of digging around, I came upon [this thread](https://wordpress.org/support/topic/author-page-json-not-in-expected-place/) and specifically [this post](https://wordpress.org/support/topic/author-page-json-not-in-expected-place/#post-15692287) which pointed me to the problem: [Jetpack Boost](https://jetpack.com/boost/). It wasn't the most recent plugin I'd installed, and - as I mentioned - things had been working fine since I had installed it… but something had happened in the background which had broken things, and turning off Jetpack Boost as a first test **instantly** solved the problem.

Later in the thread the problem is tracked down to specifically the "Defer non-essential JavaScript" option, so if you're having trouble with ActivityPub, and have Jetpack Boost installed, turn this option off to fix the conflict.

{% image "https://assets.chrism.cloud/chrismcleod.dev/2023/01/image-2.png", "A screenshot of the Jetpack Boost options screen, showing the 3 available settings. Optimize CSS Loading is turned on, and a progress bar shows it is generating 'Critical CSS'. Defer Non-Essential JavaScript is turned off. Lazy Image Loading is turned on" %}
