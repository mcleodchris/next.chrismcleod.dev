---
title: "iCloud Photo Library is Great when it Works, But it Doesn't Work for Me"
date: 2015-07-30
categories:
  - articles
tags:
  - software
  - apple
  - cloud-computing
  - photos
  - user-experience
authors:
  - chris
archived: true
---

I've been using iCloud Photo Library (iCPL) for the last few months, basically since the day it went to Public Beta. It was one of the features I was most excited about for iOS 8 and OS X Yosemite. The idea is fantastic - all your photos available on all your (Apple) devices, and it's integrated with what is probably your most frquently used camera, so new photos are automatically added.

When it works, it's seamless and brilliant, and I can't say enough good things about it… but this morning I turned it off on my iPhone and won't be switching it back on any time soon.

---

Here are the two **major** problems I've had with it:

### 1\. It causes (most) apps accessing the photo library to run extremely slow

Anytime I open an app which wants to access the photo library, that app tends to hang for a few seconds. This is easiest to see in something like Instagram, where if you go to add a picture, the icon in the bottom left which lets you select an existing image will show as blank for several seconds while it loads the first thumbnails. I've seen similar behaviour in the stock Camera app, and numerous image editors.

### 2\. It absolutely destroys my mobile data allowance

I have a 4GB data allowance on my 4G data plan. When I have iCloud Photo Library enabled on my iPhone - even after syncing the entire library over WiFi before leaving the house - within a couple of days I will get a text message from my network telling me I've only got 200MB of my allowance left. This happens _even after disallowing the Photos app from using mobile data_, so it's obviously some other process running in the background. To be clear: without iCloud Photo Library turned on, I have never been close enough to my data cap to trigger a warning; with it turned on, I use up my entire allowance within a few days.

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2015/07/icloud_photo_data.jpg", "a series of SMS messages from my network provider, first warning me I was about to exceed my data allowance, then telling me I had exceeded the allowance. In between these messages are 2 replies from me requesting 1GB extra data each time" %}

---

The first problem of slowness has improved with the iOS 9 public betas, but #2 is still happening. A lot. It's probably cost me upwards of £60 in increased mobile phone bills over the last few months. And this is before we get to other issues, including: either iCPL/the new Photos app screwing up the metadata on a whole bunch of photos[^1]; occaisional sync conflicts[^2]; problems caused by turning it off because of the other issues[^3].

By and large, I get the impression I'm the outlier. For most people, iCloud Photo Library works without issue and they're happy with it. Hopefully it's the same for you! But for me it just doesn't work reliably enough without some serious downsides.

What's your experience of iCloud Photo Library been like? Let me know!

[^1]: I found this one out when I tried importing my library into Google Photos and Dropbox for redundancy. Roughly 2500 photos no longer have any date information associated with them, so both services sort them into the day they were uploaded, completely ruining any logical grouping.
[^2]: In iOS 8, if I quickly edited a new picture on your device, while it synced to your other devices, one of two things would happen; 1: only the edit would sync, or 2: your edit would be discarded when the sync finished.
[^3]: What _should_ happen is your iCPL photos are removed from the device, apart from the Camera Roll pictures on the device previously. Except, it usually turns into a crap-shoot as to which photos are kept. And sometimes, despite removing all these photos, the storage space isn't freed up afterwards. Which is awesome when you only have a 16GB device.
