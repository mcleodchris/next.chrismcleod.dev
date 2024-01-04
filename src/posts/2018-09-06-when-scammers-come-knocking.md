---
title: "When Scammers Come Knocking…"
date: 2018-09-06
categories:
  - articles
  - notes
authors:
  - chris
archived: true
tags:
  - security
  - link
---

[Krebs on Security recently wrote about investigations into the wave of extortion spam](https://krebsonsecurity.com/2018/08/whos-behind-the-screencam-extortion-scam/) doing the rounds. As chance would have it, I recently started receiving these emails myself. I've had three, so far, over the last week or so. All from the same _@yahoo.jp_ email address (obviously not the real origin), and all with slight variations on the same message, and a unique Bitcoin wallet each time. For example:

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2018-09-03-09_14_5-Gmail.png", "A screenshot of a lengthy scam email attempting to extort me for Bitcoin through social engineering" %}

These are the first few mail systems used by the most recent message, before the message reaches my own setup:

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2018/09/2018-09-06-09_24_32-Original-Message.png", "screenshot of some email headers" %}

Interesting things to note:

- The password given must be from the [Tesco data breach](https://www.bbc.co.uk/news/business-37891742) - I remember that one as their sign-up form cut off part of the password I had typed in - I don't remember being a Tesco Bank customer, but I have used their online grocery store, and I assume it's all the same login system.
- The amount they want paid has decreased over time - it started at $3000, the most recent email is $1000
- Similarly, the number of friends they threaten to send their "recording" to has gone from 9 to 5. Perhaps the scammer is testing at what "level" they get the most returns?
- The English is good, but _not quite_ native-speaker level.

Given [I already know this is a scam](/blog/new-data-dump-powered-extortion-scams-popping-up/) (and I don't even have a webcam attached to my PC, for another thing… ?), I'm not exactly a prime "mark" for this. But I can easily see how some less clued-up person could be scared into handing over their savings.

_\[Addendum\] - as I've been writing this, a fourth email has arrived. Same sender, same basic message, but this time asking for $5000, and threatening to send to 14 friends._

**Update:-** I added some of the mail headers to the post, for a bit more information.
