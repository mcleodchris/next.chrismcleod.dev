---
title: "e107 + Blogging Continued..."
date: 2003-11-06
categories:
  - articles
authors:
  - chris
archived: true
tags:
  - personal
  - site-meta
  - blogging
---

Bit of a long one tonight...

I've been thinking a lot over the last couple of days about the site and the systems behind it. Mainly due to the lack of net access.

[E107](https://web.archive.org/web/20041125020658/http://www.e107.org/ "e107 - can you really be bothered to code one yourself?") is a great CMS - it's fast, reliable, got a great community, pretty secure, easy to extend... but it's grown into a system that no longer really works for personal sites. Sure, you can use the news section as a blog, but it just feels wrong, somehow. That's why I moved on to the blogging tools for a while. [Nucleus](https://web.archive.org/web/20041125020658/http://www.nucleuscms.org/ "Nucleus") first, then [MovableType](http://www.movabletype.org/ "MovableType"). MovableType is a great blog system - it's pretty fast, reliable, customizable, got a tonne of features (I could not maintain this site without the XMLRPC interface), a large community... But it didn't provide everything I wanted for the site. Plus, I could only get it installed in a subdirectory, which meant a splash page of some sorts - not something I often like.

So that led me to write MT107, the simple set of scripts that I use to interface the two systems. It's far from ideal at it. For a start, it has no provisions for comments or trackbacks. It also has to be set up _just right_ or the page formatting will be all to heck. Templates have to be changed and so on and so forth.

Thinking it over, I broke down the reasons why I wanted to interface the two systems.

1. I wanted to keep my existing posts when I re-implimented e107
2. I love using [w.Bloggar](https://web.archive.org/web/20041125020658/http://www.wbloggar.com/ "w.Bloggar") to write new entries. I reckon I wouldn't update the site if I had to log into an admin area all the time.
3. I liked the formatted text (proper paragraphs, etc) that MT gives you, over e107's simple parsing
4. I wanted to stay within the "Blog Set". That means I wanted to keep using a blogging tool to maintain a blog. Not a news system.

At first this was fine. By "at first", I mean during the 6 weeks between development of the site starting and this week. But now I realise that I miss certain things about past blogging tools. I miss the "fancy URL's" feature of Nucleus. I miss being able to have comments. I miss (proper) permalinks. I'm even half considering wanting to use trackbacks.

All the above, I could find a way to do in MT107. But it'd be fiddly and it would mean limiting myself and anyone who uses MT107 to having to set things up "a certain way" for them to work. I don't want that. In the end I decided that what I want is a blog system that:

1. Uses XMLRPC, so I can post from w.bloggar;
2. Integrates with e107 (as a plugin);
3. Allows comments;
4. Can use "fancy URL's";
5. Has permalinks (on a per entry basis)
6. will let me export my existing posts to without data loss
7. Otherwise works like MT

Guess that's a tall order. Guess what? I can't see anything out there that does what I want. Guess what that means? Possibly another coding project. Or maybe I should give it a rest and just be happy with what I have...
