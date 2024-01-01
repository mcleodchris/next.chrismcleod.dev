---
title: "Sunday Reads: Securing Servers and NSA-proof Email"
date: 2013-09-15
categories:
  - articles
tags:
  - brian-kennedy
  - devops
  - drew-crawford
  - edward-snowden
  - email
  - gchq
  - google
  - google-apps
  - http-secure
  - internet
  - linux
  - linux-servers
  - national-security-agency
  - operations
  - prism
  - security
  - servers
  - software
  - technology
authors:
  - chris
archived: true
---

For someone who's primarily a developer/support person, I spend a lot of time setting up and configuring - [or fixing](http://chrismcleod.me/2013/09/04/developers-and-ring-rust/) - servers. I guess this came from an eagerness to learn and I got tarred with the "Linux/Server" Guy brushes at some point!

My interest in Operations has had an uptick again recently, so I've been doing a bit of reading of late. This morning, while waiting on news about some work-related activities I've come across a couple of interesting articles:

[My First 5 Minutes On A Server; Or, Essential Security for Linux Servers](http://plusbryan.com/my-first-5-minutes-on-a-server-or-essential-security-for-linux-servers) by Brian Kennedy is a fantastic little quick-start for securing a Linux server. It's not everything you need to do, but as noted in the article, it sets the foundations for a secure server which is easy to keep secure. Do these steps first, then go about securing any additional services you need to run.

One thing I've been wondering about, is setting up my own email system, rather than run on [Google Apps](http://www.google.com/apps/ "Google Apps"). As convenient as the Google platform is, I do sometimes think I'm trusting them with a bit too much of my information. Recent revelations about the [NSA](http://en.wikipedia.org/wiki/NSA)/[GCHQ](http://en.wikipedia.org/wiki/GCHQ), [PRISM](<http://en.wikipedia.org/wiki/PRISM_(surveillance_program)>), and whatever-comes-next, from [Edward Snowden](http://en.wikipedia.org/wiki/Edward_Snowden) haven't done much to allay those worries.

But Google Apps is *convenient*. It wraps my mail, calander, contacts, and many other things into a nice package that is available everywhere and syncs across platform, with Push notifications, search, and other modern conveniences... but never the less, I've been thinking about how I could move away from the "Do-No-Evil" Empire, which is why Drew Crawford's excellent, in-depth article "[NSA-proof your e-mail in 2 hours](http://sealedabstract.com/code/nsa-proof-your-e-mail-in-2-hours/)" was a great find. I might spin up an instance on my dormant Joyent account and give it a try on one of my spare domains, so I can evaluate the process and benefits before deciding on moving my primary mail domain.

Other topics which have crossed my path this weekend are system configuration, maintenance, and automation using tools such as [Chef](http://www.opscode.com/chef/) and [Puppet](http://puppetlabs.com/). The idea of taking a known-good environment and replicating it with just a few commands is definitely appealing - particularly when it comes to tasks such as setting up development/test environments! I haven't gone too far into these topics yet, but I'm hoping to find the time in the next few weeks to go through some of the [articles](http://www.opinionatedprogrammer.com/2011/06/chef-solo-tutorial-managing-a-single-server-with-chef/) I've [found](http://gettingstartedwithchef.com/).
