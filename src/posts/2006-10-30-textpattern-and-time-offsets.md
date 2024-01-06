---
title: "Textpattern and Time Offsets"
date: 2006-10-30
categories:
  - articles
tags:
  - dates-are-hard
  - textpattern
  - blogging
  - blogging-tools
authors:
  - chris
archived: true
---

There’s a bit of a long-standing bug in [Textpattern](https://web.archive.org/web/20061105184141/http://www.textpattern.com/), and its handling of time zones. It’s a bit of a head-scratcher to get your head around, so bear with me. It’s probably best described with a simple example, so here goes:

- Our writer/site admin lives in the UK. It is British Summertime. His time zone is therefore GMT+1.
- Textpattern is installed on [a server in Australia](https://web.archive.org/web/20061105184141/http://www.segpub.com.au/). Its time zone is GMT+10.
- The site admin sets the time zone in TXP to his own GMT+1 and writes a few articles.
- British Summertime ends, so the writer’s time zone is now just GMT. Daylight Savings Time (or whatever) starts in Australia, making it GMT +11.
- All the date-based permalinks in TXP go all to hell. Most appear a day out of line.
- New stuff that gets written is inaccessible as TXP can’t decide if the publish time has passed or not.

It’s a strange one, and a bit of a pain in the ass. There’s been some discussion in [this forum thread](https://web.archive.org/web/20061105184141/http://forum.textpattern.com/viewtopic.php?pid=110870), but no consensus on how to fix it or even if it _is_ a bug. The common workaround – which isn’t an ideal one for many people – is to just keep to one time zone and ignore anything like DST, BST or other “time modifiers”.
