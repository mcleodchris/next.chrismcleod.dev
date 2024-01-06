---
title: "Open-Sourcing My IndieWeb Wordpress Theme?"
date: 2018-12-20
categories:
  - articles
  - notes
tags:
  - indieweb
  - open-source
  - wordpress
authors:
  - chris
archived: true
---

As I’ve been experimenting more with IndieWeb ideas on this site, I've been kicking around the idea of open sourcing the custom theme I use to power this site (currently called "K"). Part of this is from a desire to start sharing useful code again. I haven't really put anything out there in years now. Once upon a time, long before the rise of Github, any code I wrote for myself would at least have ended up as a downloadable .zip file.

The other reason I've been giving myself, is to add to the pool of [MF2](https://indieweb.org/microformats)\-compatible themes available, in an effort to give people more options for deploying Indieweb sites. Right now, the [Indeweb wiki](https://indieweb.org/) only [lists a handful of themes](https://indieweb.org/WordPress/Themes) as compatible out of the box, so the more that can be added, the better it will be for growing the community.

The thing is, the theme is very much not ready for other people to lay eyes on, in its current state:

- I (currently) do a bunch of non-standard things under the hood.
- I'm also not doing a bunch of theme "best practices". Simply because I've not needed to.
- I've not really cared much about testing in browsers beyond the ones I use day to day.
- A lot of the code has been cobbled together as and when I've needed it, so there are loads of "standard" features straight-up not implemented.
- There's a tonne of things hard-coded specifically for me. Those would have to be stripped out or altered to be configurable. That's more code I'd have to write.
- I've hacked up a bunch of dependencies, in the name of optimisation for my own needs. A public release would need to include the full code of these dependencies, or it'll severely restrict anyone who wants to use the theme.

All in all, there's quite a lot to do to make the theme usable by anyone who isn't me. My natural instinct is to hold it back until it's "ready" but as I've been typing this out, I've been wondering if I should just go ahead and put the code [on Github](https://github.com/MrKapowski) anyway?
