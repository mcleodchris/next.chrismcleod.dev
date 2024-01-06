---
title: New Year, Old Posts
date: 2024-01-01T23:32Z
tags:
  - blogging
  - site-meta
---
In a case of history repeating itself not [once](https://chrismcleod.dev/blog/regarding-the-thoughtful-cultivation-of-the-archived-internet/) - but [three](https://chrismcleod.dev/blog/reclaiming-history) [times](https://chrismcleod.dev/rewriting-history)! - I've been working through the process of adding "historical" blog posts to my blog. These are posts I have written on previous iterations of my blog, in this case on several different domains, and stretch back over 20 years. Most of the earliest posts have been pulled from The Internet Archive, because younger me didn't think about backups - not that any I'd taken would have lasted this long!

It's a work-in-progress, but I've added in the region of 470 posts today. Most of the links and images should be working, but there's a high chance something will be broken; I'll be doing regular sweeps to fix up anything I find. There are still over 2000 "short form" and other, more esoteric, posts to sort through. Most of these are some form of[ IndieWeb "post kind"](https://indieweb.org/posts#Types_of_Posts) that will need a bit more work to bring across, and may require some further changes to the site itself to accommodate.

Beyond fixing formatting/images, I'm purposefully not editing the content itself. Even though I'm a very different person than I was when I some of these posts were written, it feels like it would be wrong to start rewriting the past. Instead, I'm putting a big disclaimer at the top of any post that's older than 3 years. I'm still fiddling with the exact wording, but if you look at [any old post](/blog/page-1/) you should see a representative example.

For context, I was still a teenager when I wrote the earliest post I've been able to recover, and I don't think the word "blog" had caught on yet.

In terms of technical process, it was very similar to when [I migrated this site from Wordpress to Eleventy](https://chrismcleod.dev/blog/i-rebuilt-my-blog-and-didnt-write-about-it/). It just required a bit of extra work up front. I'd lost the Wordpress backups I'd made of my previous blog[^1], but still had a disk image backup of the server itself. I ended up using this backup to create a Digital Ocean droplet that represented the old server before I shut it down. With a few configuration tweaks I was able to access Wordpress and make a new backup of the site content. While the server was online, I also grabbed a copy of the uploaded media.

With that kerfuffle out of the way, I followed the same steps as my last migration - it just ended up with an order of magnitude more posts to sort through and clean up! It quickly became apparent I was missing a lot of images from 2017 and earlier - roughly when I had made another, earlier server migration. Thankfully, I *did* still have a backup of those images to hand, so just had to match up the files to the right place.

So. Will this be the last time I go through this exercise? The Magic 8-Ball says "eh, probably not…" but if nothing else it's been a great excuse to go back, read, and reflect on some of the earliest things I've written online and just how far I've come since then.

[^1]: There *is* also a [static HTML archived copy](https://mrkapowski.com/) I could refer to, but that wouldn't help much with getting the content into Markdown for Eleventy. It was useful reference for fixing post where the export was missing some data due to the Wordpress plugins I was using.