---
title: 'The Road to Open-Sourcing "K" for WordPress'
date: 2019-01-02
categories:
  - articles
  - notes
tags:
  - blogging
  - indieweb
  - open-source
  - web-development
  - wordpress
authors:
  - chris
archived: true
---

I mentioned before the festive break that I was thinking about [open-sourcing "K"](/blog/open-sourcing-my-indieweb-wordpress-theme/), the custom theme I've been developing for this site. Since then, I've decided I'm going to do it, but I'm going to work to tidy things up beforehand. Some of this has already happened, some of it is yet to be done. For a bit of fun, I'm going to \[try to\] blog about it whenever I make some progress ?. All-in-all, I've identified three main themes I want to focus on before the intial public commits.

My first job is to make the theme more "generic." As I mentioned, the theme has been very much a hacking together of what I've needed, as I've needed it. This means a lot of it isn't as customisable as people expect a modern WordPress theme to be. For example:

- The site logo is an embeded SVG, rather than an image that can be swapped out in the WordPress Customiser.
- The sidebar was, until recently, entirely hardcoded HTML.

I've made some progress here - there's now a "widget area" in the sidebar - but my custom author [h-card](https://indieweb.org/h-card) is still mostly manual (although it does use a WordPress menu for the social profile links). I think I'm going to recreate this as a bundled widget. I could try using the IndieWeb h-card widget, but I liked having the flexibility of my manually crafted card, and the IndieWeb version doesn't support multiple profiles at the same service.

The second main focus is going to be standards support. I want the markup to be as fully compatible with MF2 and structured data as possible. I've spent hours debugging this so far, and I think I have it mostly sorted. [IndieWebify.me](https://IndieWebify.me) picks up everything I expect it to, and every parser/validator I've thrown at the different pages and types of content have come back correct to my eye. For some reason, [IndieNews](https://news.indieweb.org/en/) hasn't liked any of my submitted posts, but that's lower priority for now. I haven't done much with marking up elements like comments, but the main page/blog post/author details seem to be correct.

Finally, the third focus is on the code quality and maintenance. This loops back to the customisability/flexibility theme as well. By its cobbled-together nature, "K" has been a bit… loose in the quality of the PHP code, and the frontend files were/are a nightmare to maintain. Up to now I've used a hacked to pieces copy of Bootstrap with a bunch of customisations on top to provide the layout framework (literally _just_ the rules I needed, obtained through [UnCSS](https://uncss-online.com/)), and a similarly cutdown set of FontAwesome icons. That's fine for my use case - even if it has been a faff to add to the site - but it won't work for other people.

I've started adding a build system for these frontend files, but it does mean I'm probably going to have to include the entirety of the minimised version of Bootstrap, and the full FontAwesome SVG sprites. Unless someone has a good suggestion? [Unstyle has a CLI tool](https://github.com/uncss/uncss), but integrating that is probably a step beyind what's needed for the moment. I haven't added FontAwesome to the live site yet, but this page should be using the new style.css that's been compiled from SCSS.

On the PHP side I've started making sure it conforms to at least the [WordPress Coding Standards](https://make.wordpress.org/core/handbook/best-practices/coding-standards/php/). There's still a few files to update, but functions.php and most of the template files are done. After that I want to make sure everything is as modular as possible. I'll need to add files to handle the various post-types, error pages, and other screens a more rounded theme would handle. I'll also be bundling a selection of Post-Kinds templates, once I figure out how I want to display them on this site.

There are other things that will need done no doubt, but these are where I want to focus my efforts for now.

Not all of them need to be fully completed before "K" gets open-sourced, but I would feel a lot more comfortable if at least the first steps were taken along these paths. It is a little dependent on having enough free-time, but I've set a goal of uploading to GitHub by the end of the month.

If you have any suggestions, or other feedback, please do let me know -- either as a comment below, or on your own site.
