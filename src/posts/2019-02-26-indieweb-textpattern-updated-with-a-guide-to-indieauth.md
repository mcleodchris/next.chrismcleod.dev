---
title: "#IndieWeb Textpattern Updated with a Guide to IndieAuth"
date: 2019-02-26
categories:
  - notes
tags:
  - indieauth
  - indieweb
  - textpattern
authors:
  - chris
archived: true
---

_Editors Note: The links to #Indieweb Textpattern do not work. I am working to port that content over to this site. This page will be updated when that work is complete._

I've just posted the second how-to article to [IndieWeb Textpattern](https://txp.kpw.fyi/) - [preparing your site for IndieAuth](https://txp.kpw.fyi/articles/step-2-preparing-for-indieauth).

This one took a bit longer to write than I anticipated. IndieAuth is a slightly weird concept to describe and write about in easy to understand terms. I'm trying to keep the level I'm pitching IndieWeb Textpattern at to be pretty low, so I found myself going back and revising things several times. On the plus side, writing about these topics is reinforcing how they work in my mind. Practice and documenting things have always been my best teacher ?

While I was researching the article I discovered that [IndieLogin](https://indielogin.com/) doesn't necessarily check for an `authorization_endpoint link` at URLs marked as `rel="me"` - something which was unexpected behaviour. I'd planned to use this site as my example authentication provider, but couldn't and reverted to using Github. I've added this to my list of things to investigate.

If you're interested, here's the current content plan for the site, although I'll be adding more articles as I re-familiarise myself with developing Textpattern plugins, and open up more integrations.

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/02/2019-02-26-10_07_55-Articles-IndieWeb-Textpattern-_-Textpattern-CMS.png", "a table of draft articles in the Textpattern CMS admin panel" %}
