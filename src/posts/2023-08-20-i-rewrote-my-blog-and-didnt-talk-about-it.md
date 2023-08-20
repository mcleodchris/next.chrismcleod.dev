---
title: I Rebuilt My Blog and Didn't Write About It
date: 2023-08-10
tags:
  - blog
  - blogging
  - meta
authors:
  - chris
gradient: true
---

Until now.

Sorry, it's tradition. If someone redesigns/redevelops their blog and doesn't blog about it, _did it even happen_?

Regular visitors (if there is such a thing) will already know this, but if you follow via [RSS](/feed.xml) you might not know that this site has a new lick of ~~paint~~ CSS. Not only that, but there's a new underlying system and hosting platform. In summary:

- WordPress is out; [Eleventy](https://www.11ty.dev/) is in.
- Instead of [hosting on my own VPS](https://www.digitalocean.com/) for ~£20 a month, I'm hosting for free on [Netlify](https://www.netlify.com/).
- The site is based on the excellent [Eleventy Excellent](https://eleventy-excellent.netlify.app/) starter, by [Lene Saile](https://www.lenesaile.com/). I've made a few tweaks here and there to make things _just so_ for my tastes, but full credit goes to Lene for providing such a good foundation.

## Why Eleventy?

In short: it's very fast, flexible, and doesn't railroad you into a particular way of building your site. The [documentation](https://www.11ty.dev/docs/) is good, and ultimately: _I just really like working with it_.

The community around Eleventy has come up with a variety of "[Starters](https://www.11ty.dev/docs/starter/)", which are a kind of template to help get your site up and running. They're not just "templates" in the sense of how the site looks, but also how it is structured under the hood, build-time optimisations… the works! They can be as simple or as complicated as you want.

I evaluated a few different Starters, Initially I was just looking for something simple, that optimised the output HTML and CSS at build-time, but not much more than that. Then I found Eleventy Excellent and new it was the one for me. In Lene's own words:

> This (opiniated) [Eleventy](https://www.11ty.dev/) starter is based on [Andy Bell’s](https://mastodon.social/@andy@bell.bz) talk ‘Be the browser’s mentor, not its micromanager’ and it’s companion website [buildexcellentwebsit.es](http://buildexcellentwebsit.es/).

Andy's talk was actually going to be the basis for how I built this site, so to find someone who had already done the hard work was fortuitous! That it looked good, was easily customisable, and fast, were all extra cherries on top 🥳

## Getting content out of WordPress

Getting my content out of WordPress and into nice, simple Markdown was probably the most time-consuming part of this whole process. Although, to be honest, it wasn't that difficult compared to what I'd braced myself for.

There are already a few WordPress to Markdown converters available. Most are a Node package that can be run against your WordPress export on the command-line. I tried out a couple, comparing the output, and finally settled on [flowershow/wordpress-to-markdown)](https://github.com/flowershow/wordpress-to-markdown). This generates a bunch of .md and downloads image files from posts into a directory structure.

From there began the laborious job of cleaning up the output to match the blog setup, change the image references from Markdown to the [Eleventy Image](https://www.11ty.dev/docs/plugins/image/) short-code, and update the image paths to point to the Azure storage blob I'm using to hold my master copies. After a couple of sessions working on it in a Starbucks, everything was building exactly as I wanted it

## Why Netlify and not Azure Static Web Apps?

If you've read [my previous post on SWA](https://chrismcleod.dev/blog/azure-static-web-apps-are-awesome!/), you'll know I'm a huge fan of Azure Static Web Apps. So it might be a surprise that I opted for hosting with Netlify instead. In a lot of ways the services are functionally identical - free hosting for static sites, with a CI/CD pipeline from GitHub that automatically builds and deploys your site whenever changes are pushed to the repository.

Honestly, it came down to just one thing - limits on the size of the compiled site "bundle", including media files. SWA has a limit of 250MB per site on the Free tier. Netlify doesn't. Although I knew the static HTML would be a tiny fraction of that limit, the cached images in multiple formats would take me closer. I don't think I'm realistically I would hit the limit any time soon[^1], but there would always be a ceiling I'd have to remember about as the content grows. So Netlify it was.

[^1]: As it stands, the development build for the entire site is only ~21MB, including images - which take up >20MB. Yay HTML.

I might revisit this, and have everything on Azure, but I'm not in a rush.

## Interesting Technical Details

Honestly, the majority of the technical underpinnings are pretty boring. To understand the HTML/CSS, I recommend taking a look at the starter repository and talk which inspired it. Both are linked at the top of this post. I think the most interesting thing is how I'm handling images:

1. As mentioned above, masters are stored in Azure storage, with a CDN attached to make it easier to reference in posts.
2. When writing a post I include a short-code which links out to the CDN version of the image.
3. At build time, Eleventy Image downloads the master, resizes it to the specified responsive sizes, and generates optimised versions in various formats like AVIF. These are then cached by the build to prevent excessive work/traffic.
4. The short-code is replaced with `<picture>` tags for proper responsive image support

It's pretty cool all-in-all, and makes posting images pretty trivial. I just have to upload to Azure, then link from a post, and Eleventy then does all the "right things" with regards to optimisations.

## What's next?

Hopefully just writing more! I've added a dark mode and links page generated from Feedbin subscriptions, so I think the only things I still want to add are:

- Search - I might end up using Azure Cognitive Search for this, but not 100% decided yet
- Bringing in content from old iterations of my blog. I've been writing online since before it was called "blogging", and I've got a bunch of good stuff in the archives that's not on this site. I'll need to do some editorialising to bring in the "greatest hits" in a way that makes sense, but I'd like to expand the content so it's not just the last couple of years.
