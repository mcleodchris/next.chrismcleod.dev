---
title: "Adding Instagram to a Social Reader"
date: 2019-06-06
categories:
  - notes
tags:
  - indie-reader
  - indieweb
  - instagram
  - microsub
  - monocle
  - silo-quit
  - social-reader
  - soft-quit
authors:
  - chris
archived: true
---

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/06/B8D9D1F5-A102-4FAA-A8DE-66C12BCC96F3-e1559823306749.png", "Screenshot of my Instagram feed, showing a model lounging under the sun on some rainbow-painted stairs; Photo by Donna Murray Photography" %}

[I mentioned yesterday](https://mrkapowski.com/2019/06/bollocks-to-this-instagram-ad-hellhole) my frustrations with Instagram were at an all-time high, and I wanted to "soft quit" the app by adding my follows as a source in Monocle. I didn't find any existing guide on how to do this (sorry if I missed yours!), but I did get two [useful](https://doubleloop.net/2019/06/05/5725/) [suggestions](https://stephenpieper.net/monocle-instagram/) about tools to enable this: [Instagram Atom](https://instagram-atom.appspot.com/), and [Granary](https://granary.io).

I use Granary already, to pipe Twitter into Monocle, so that was my preferred option. The short guide below documents the steps I took to get things set up.

## Step 1. Get your Instagram session ID

Instagram doesn't offer much of an API anymore, so to let Granary do the magic, we need to get our Instagram session ID. To do this:

- Login to Instagram through a desktop web browser
- Use the developer tools to inspect the cookies set by Instagram. Look for a cookie called "sessionid" and copy the value of it:

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/06/2019-06-06-09_06_19-Window.png", "screenshot of DevTools showing the UI after following the above 2 steps" %}

## Step 2. Link up Granary

Head over to [Granary](https://granary.io). Click on the Instagram login button, and authorise Granary if you need to. When you return to Granary, there will be a couple of form fields you can fill in.

- Enter your Instagram username
- Select @friends from the dropdown
- Change the format to html/atom/json
- Enter your copied session id in the cookie field

Click "GET", and Granary will generate a preview of your feed and give you a link:

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/06/2019-06-06-09_07_14-Window.png", "alt temporarily text not available" %}

Copy that link.

## Step 3. Add to Microsub

You need to add the URL you've copied from Granary as a source in whatever Microsub server you use. I use Aperture, so I added a new Instagram channel with my feed as a source. I'm going to assume you know how to do this for your server of choice.

## Step 4. Enjoy

All being well, you should now have an Instagram feed in Monocle/your chosen social reader.

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/06/2019-06-06-08_42_17-Window.png", "alt temporarily text not available" %}

With all this set up, I can now add the Instagram app to the "To Quit" folder on my iPhone.

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/06/4D659326-056C-4612-897B-F282A8EF3D51.jpeg", "Screenshot of my iOS “to quit” folder, containing a handful of silo apps" %}

## Caveats

There's a couple of limitations with "using" Instagram in a reader:

- No syndication - to my knowledge, it's not possible to syndicate any of your response (likes, replies, etc) back to Instagram. So if you want to let your Instagram-only friend know you liked their photo, into the app you go.
- Session expiry - I don't know yet if the session id we got in Step 1 will expire. If it does, you'll probably need to redo creating and adding your feed.
- Multi-accounts - if, like me, you have more than one Instagram account, and want to add both, there are some hoops to jump through. I found you need to add the second account using a second browser/new private browsing session, or some wires will get crossed somewhere and you'll need to setup both feeds all over again.
