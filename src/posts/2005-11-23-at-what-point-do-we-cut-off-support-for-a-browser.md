---
title: "At What Point do We Cut off Support for a Browser?"
date: 2005-11-23
categories:
  - articles
tags:
  - camino
  - firefox
  - google-chrome
  - internet-explorer
  - netnewswire
  - opera
  - safari
  - web-browser
authors:
  - chris
archived: true
---

I know, I know, in theory we should be developing sites that work in *every* browser and not just targeting specific applications. [However, the reality isn’t quite there yet](http://www.andybudd.com/archives/2005/01/most_common_browser_bugs/index.php). Support for the different [web standards](http://www.webstandards.org/) varies massively from vendor to vendor.

Usually we make the decision on how much effort we put into making a site work in a particular browser down to the visitor statistics of that site. If your site only receives a handful of visits from a certain browser, why spend hours – or even days – trying to work around its faults?

So my question is this: just how low should the numbers be before a particular browser gets ‘cut off’? Take, for example, the top 5 browsers in Pixel Meadow’s Mint logs:

1. Firefox (54%)
2. Safari (31%)
3. Internet Explorer (8%)
4. NetNewsWire, Camino & Opera (2%)
5. Shrook (1%)

From those numbers it’s clear that I need to support Firefox and Safari (which by extension means support for NetNewsWire and Camino), but what of IE, Opera and Shrook? Do I go out of my way to make sure any future revisions of Pixel Meadow work fully in these browsers, or do I just make sure they’ll degrade gracefully if need be?

Of course, this is assuming an existing site… It stands to reason that a new site with no clear visitor demographics should target as wide as possible until their visitor statistics are known.
