---
title: "Useful Alias Commands"
date: 2004-05-16
categories:
  - articles
authors:
  - chris
archived: true
---

If – like me – you do a lot of “tinkering” with your Gentoo installation, you’ll invariably end up typing a lot of commands over and over again.

Aliases save you from having to remember/repeatedly type in these commands. Aliases, in case you are new to them, are command line shortcuts. As such, they can save you a fair bit of time when working in the terminal.

To set up an alias, you use the `alias` command: `alias aliasname='command'`

There are a couple of Gentoo specific aliases that I have set up:

- `unstablemerge`—a shortcut to `ACCEPT_KEYWORDS="~x86" emerge`
- `retrymerge`—saves typing in `emerge --resume`
- `rc-add`—instead of `rc-update add`
- `rc-del`—instead of `rc-update delete`

Got any more? Leave ‘em in the comments!
