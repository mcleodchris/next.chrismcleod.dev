---
title: "Improved Footnotes in Textpattern"
date: 2005-09-01
categories:
  - articles
authors:
  - chris
archived: true
---

Footnotes seem to be all the rage at the moment. While some other CMS may require a plugin to get them working, we Textpattern users have been able to create them since day 1. However, the problem with the footnotes Textpattern generates, is that once you’re down there, you have to manually scroll back up the page o where you were. Wouldn’t it be nice if we could have “return links” like at [Daring Fireball](http://daringfireball.net/2005/07/footnotes)? Well, it’s easy enough to do and requires only a minor change to the code[^1]. Simply change the following two lines of code to read as below:

**475:** `$content = '<sup>' . $fns<sup><a href="#fn1" id="fn1-link">1</a></sup> . '</sup> ' . $content ."<a href="#fn$fns<sup><a href="#fn1" id="fn1-link">1</a></sup>-link">↩</a>";`

**729:** `'<sup><a href="#fn$1" id="fn$1-link">$1</a></sup>$2', $text);`

[^1]: Note that I’m still running RC3 on this site, so line numbers might be slightly out compared to 4.0[^2]
[^2]: **Update** – in TXP 4.0, these lines are **482** and **736** respectively.
