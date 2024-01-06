---
title: "Block Ads and Other Web Nasties with a Hosts File"
date: 2012-01-15
categories:
  - articles
tags:
  - ad-blocking
  - networking
  - tip
authors:
  - chris
archived: true
---

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2012/01/screen-shot-2012-01-15-at-21-49-39.png",  "Screen Shot of my Hosts File" %}

After getting fed-up of not being able to read sites in Reeder on my Mac without getting bombarded with ads I looked around for a good [hosts file](http://en.wikipedia.org/wiki/Hosts_%28file%29) I could use to block the buggers at the network level, rather than rely on plugins such as [AdBlock](http://adblockplus.org/ "Adblock Plus") at the application level.

I tried a couple, but [the file available at Someone Who Cares](http://someonewhocares.org/hosts/) was the most comprehensive and most up to date I could find.

So what does it do? Basically it takes a (huge) list of known ad/spy/malware [domain names](http://en.wikipedia.org/wiki/Domain_name "Domain name") and tells your computer their IP address is 127.0.0.1, i.e. your own computer, rather than their actual [IP addresses](http://en.wikipedia.org/wiki/IP_address "IP address"), so their scripts/ads/viruses/trackers/etc won't ever load. As a side effect, ad-enabled websites *should* load faster.
