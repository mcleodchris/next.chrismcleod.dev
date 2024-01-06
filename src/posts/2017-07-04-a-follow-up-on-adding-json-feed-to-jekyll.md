---
title: "A Follow-Up on Adding JSON Feed to Jekyll"
date: 2017-07-04
categories:
  - articles
  - notes
authors:
  - chris
archived: true
tags:
  - jekyll
  - blogging
  - how-to
  - feeds
---

After [my last post](/blog/add-json-feed-to-a-jekyll-site/), I came across [some discussion](https://github.com/jekyll/jekyll-feed/issues/172) about implementing JSON Feed, and whether using a template is a good way to implement JSON Feed in a site. The concensus seems to be “No,” with one of the authors of the spec [weighing in](https://github.com/brentsimmons/JSONFeed/issues/106#issuecomment-311705850). For the most part, I do agree – a template is more likely to break under some edge case than a proper serializer – but until there is more support for the spec I see it as a pragmattic short-term solution. So proceed at your own risk for now!
