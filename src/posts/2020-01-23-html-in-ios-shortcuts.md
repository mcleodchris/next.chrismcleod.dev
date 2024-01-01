---
title: "HTML in iOS Shortcuts"
date: 2020-01-23
categories:
  - notes
tags:
  - indieweb
  - ios
  - shortcuts
  - workflow
authors:
  - chris
archived: true
---

An iOS Shortcuts tidbit I figured out yesterday: if you start with a piece of HTML as your input, it will be converted by Shortcuts to its internal “Rich Text” data type by default.

To send that HTML _as HTML_ to another shortcut or an external service (such as a Micropub endpoint) then you need to convert the Rich Text back to HTML using a _Documents_ > _Make HTML from Rich Text_ action. If you don't do this, your endpoint or whatever that doesn't natively understand Shortcuts’ Rich Text format will receive the plain text value.

I really need to revisit my [IndieWeb iOS Shortcuts](https://mrkapowski.com/projects/indieweb-ios-shortcuts) article from last year. I've added and improved so much about my workflow since then.
