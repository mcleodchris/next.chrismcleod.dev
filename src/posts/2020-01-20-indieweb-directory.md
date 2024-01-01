---
title: "Indieweb Directory"
date: 2020-01-20
categories:
  - notes
tags:
  - directory
  - discovery
  - indieweb
  - project
authors:
  - chris
archived: true
---

This post has two main purposes in my mind: write an idea down, in case I find myself able to return to it; put the idea “out there,” in case anyone else wants to pick it up and run with it.

About a year ago I had the nebulous idea for a simple #Indieweb directory built around webmention:

- sites would add themselves by creating a post which sends a webmention to the directory.
- The directory would retrieve and parse the post to retrieve site name, base url, feed links, etc.
- Any tags and categories marked with `p-category` would be used for directory classification and organisation.
- There would be a simple administrative queue for approvals and data cleanup (parsing errors and the like). Sites wouldn't appear until they were approved.
- Site owners could preview what an unapproved directory listing would look like by signing in with IndieAuth. They'd also be able to delist themselves/make changes (also possible through webmention).

I never had a chance to get further than very initial experiments with this, so I'm wondering if I should just let the domain (indieweb.directory) expire in a couple of days, or renew it “just in case.” I can't see me having any extra free time this year to actually do something with the idea.
