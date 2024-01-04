---
title: "Accessible, Unobtrusive New Windows with jQuery"
date: 2006-10-30
categories:
  - articles
  - code-development
tags:
  - javascript
  - programming
authors:
  - chris
archived: true
---

I loves me some [jQuery](http://www.jquery.com/) – without it I probably wouldn’t write any JavaScript at all (seriously, I *hate* the stuff). Anyway, today I needed to add some “open in new window” links to an internal application using jQuery. Being the Standardista I am, I wanted to make it **a)**Accessible, and **b)** [Unobtrusive](http://onlinetools.org/articles/unobtrusivejavascript/) . If the user has JavaScript disabled (it happens, even on “controlled”, intranet environments), the link should just go to the new page anyway — new window be damned.

My first attempt (below) didn’t work as expected. The following code takes all `<a>` tags with a class of “newwindow” and applies an onclick event to open a new window.

```js
$(function(){
  $('a.newwindow').click(function(){
    var w = window.open($(this).href(), 'newWindow', '');
    return false;
  });
});
```

Nothing would happen with the above, because of the `return false;`. Removing `return false;` would open a new window, but also send the opening window to the new page. In the end, the following worked the way I wanted:

```js
$(function(){
  $('a.newwindow').click(function(){
    var w = newWindow($(this).href(), 'newWindow', '');
    return false;
  });
});
function newWindow(url, wName, opts){
  w = window.open(url, wName, opts);
  return true;
}
```

Basically the “heavy lifting” was moved to a seperate function. It’s slightly longer to type, but not exactly finger-breaking stuff. No doubt some bright-spark could tell me an _even better_way (feel free!), but this’ll do for now.
