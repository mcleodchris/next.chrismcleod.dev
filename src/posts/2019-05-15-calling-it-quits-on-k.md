---
title: 'Calling it Quits on "K"'
date: 2019-05-15
categories:
  - code-development
tags:
  - development
  - k-theme
  - wordpress
  - wordpress-themes
authors:
  - chris
archived: true
---

I've taken the decision to switch my site away from [the custom theme called "K"](/blog/open-sourcing-my-indieweb-wordpress-theme/) I was building, and for now I'm using the excellent [Autonomie](https://github.com/pfefferle/Autonomie) by [Matthias Pfefferle](https://notiz.blog/) instead[1](#footnote "go to footnote"). Development of K had already slowed to a standstill, and realistically, I’m not going to go back to it anytime soon. It feels a little like a failure, a little like giving up, but I think it's ultimately the right thing to do.

I made a lot of mistakes while building K, which overcomplicated things, made development more difficult, and ultimately led me into a dead-end. I thought "for simplicity" that I would use [the Bootstrap frontend framework](https://getbootstrap.com/), as it would give me a robust foundation to build on. It did, but I had to bend and twist WordPress in increasingly hacky ways to get the output to “play nice.” A large chunk of the K codebase was being taken up by code solely tasked with massaging the output of WordPress to add the right Bootstrap classes or container markup. It felt increasingly fragile and hacky, and it was a bad sign. K would work for my setup, but I couldn’t ensure it would work for everyone.

Bootstrap added other complications: to properly manage my CSS “overrides” I had to create a build system that would compile a whole lot of SASS files together. When I started K, the CSS was stripped down to the bare minimum needed, and came to a few KB. After a while I ended up including the whole Bootstrap framework, just to make the build process easier.

There were no “options” to speak of, so it couldn’t be tailored to suit someone else using the WordPress customiser. I didn’t even want to think about Gutenberg support.

[Microformats always felt like whack-a-mole](/blog/k-theme-mf2-markup-update/). I'd get them working, then make adjustments somewhere else, and promptly see things break again. I put this on my need to make so many adjustments to the WordPress output - inadvertant issues kept creeping in.

Then there were the visual design choices. K grew out of the simple design I employed when I was writing 1-2 short posts a month, in the traditional format. In that scenario it worked fine. Once I started to use the various post kinds, things became more problematic. Now I was posting several posts per day, most of which weren’t in a traditional blog format. The home page became cluttered; it started to remind me of a badly thought-out notification area, rather than a well designed blog. The archive page was a disaster and I had no good ideas on how to fix it. There were a thousand other little niggles.

None of this is meant as a knock against Bootstrap, or WordPress, or build systems, or any other tool or technology I used to get to this point. K failed because of my decisions, rather than deficiencies in the tools. There were things I liked about K… it used zero JavaScript, and I did my best to stop unnecessary plugin resources from loading. Markup was as minimal as I could make it (within the constraints of what I could remove from WordPress output, microformats, and what Bootstrap needed). It worked well across browsers and devices (thanks Bootstrap!), and the accent colours were fun. I learned a lot about the excellent [Post Kinds plugin](https://wordpress.org/plugins/indieweb-post-kinds/) during the development process. I’m filing it away as a failed experiment, which I’ll learn from and apply the lessons to the IndieWeb WordPress theme I'm still intending to create. One that will hopefully work for more people than just me ?

[I put the source code to K on GitHub](https://github.com/MrKapowski/k-theme) right back [near the start of the project](/blog/k-theme-status-update-2019-01-09/). If you want to take a look, steal any code, rework it into something usable - feel more than welcome to!

1 As a result, a couple of things that were setup specifically for K are broken. I'll look into fixing those over the next few days. [⤴️](#footnote-link "return to top")
