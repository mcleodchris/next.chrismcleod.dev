---
title: "IE Weirdness"
date: 2003-11-26
categories:
  - articles
authors:
  - chris
archived: true
---

Internet Explorer is not known for it's strict adherence to [web standards](https://web.archive.org/web/20041111031319/http://webstandards.org/ "Web Standards"). However, recently it's been acting even stranger than normal.

For example, font keywords are completely screwed up. IE6 should act the same as Firebird in this area. However, no matter what I try, IE on my machine will not adhere to anything other than `font-size: small` or larger.

[The box model](https://web.archive.org/web/20041111031319/http://tantek.com/CSS/Examples/boxmodelhack.html "Box Model explanation and fix for IE wierdness") is even more broken than normal as well. Weird margins keep cropping up all over the place, which is a nightmare when trying to write new [e107 themes](https://web.archive.org/web/20041111031319/http://www.e107themes.org/ "e107 themes")!

It's only just started recently, so I'll maybe spend some time investigating whether it's the latest IE security patch that's caused it...
