---
title: Post Restoration Project - Dealing with WordPress Post-Kinds Data
date: 2024-06-07T12:10Z
tags:
  - personal
  - site-meta
  - wordpress
  - javascript

---

At the start of the year [I restored a lot of old posts](https://chrismcleod.dev/blog/new-year-old-posts/) to this site from a WordPress backup. While this worked great for posts that had "standard" content, I was missing hundreds of posts and even more metadata that relied on the [IndieWeb](https://indieweb.org/Post_Kinds_Plugin) Post-Kinds [plugin for WordPress](https://wordpress.org/plugins/indieweb-post-kinds/). In the export file this plugin data is largely stored as [serialised PHP data](https://www.php.net/manual/en/function.serialize.php) structures within the XML.

[The tool I used](https://github.com/lonekorean/wordpress-export-to-markdown/tree/master) to convert the export didn't know how to handle this data, so [I've started a project to build a tool which can](https://github.com/mcleodchris/wordpress-mf2-to-markdown). It's in _very_ early stages (literally just a couple of files that aren't joined up yet), but I think I've got one of the harder parts done - a utility function to parse the serialised PHP data into a usable JavaScript object:

{% image https://assets.chrism.cloud/chrismcleod.dev/assets/de777bd1-48de-45c6-97b2-c1c4fded82e9.jpg, "a screenshot of a code editor with a dark theme. It displays JavaScript code for a test suite using the Mocha framework. The test is named “unserialie objects using sample data,” and it includes input data which is a string of serialised PHP data, and the expected output which is a JavaScript object. Test coverage for the file is shown as 97.7%" %}

There's a lot still to do, and it's going to take me a while to get there, but I'm one step closer to restoring the missing posts.