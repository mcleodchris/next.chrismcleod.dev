---
title: "Improve Your HTC Desire HD Battery Life"
date: 2011-03-13
categories:
  - articles
tags:
  - android
  - desire-hd
  - htc
  - kernel
  - patch
  - rom
authors:
  - chris
archived: true
---

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/battery_usage-scaled500.png", "Battery_usage" %}

Android phones generally don't get a lot of battery life. Judging by some of the forum threads and blog posts I've read, 20 hours or so is about the average. With the stock I've occaisionally had it scrape past that, but not by much. Using a lighter-weight Sense-based ROM I was able to get around 36 hours of charge

If you switch the Desire HD to a ROM without HTC Sense (such as CyanogenMod 7)you'll find your battery life reduced even further. There is a battery drain issue with all custom, non-Sense ROMs for the DHD, due to a bug in the open-source code controlling the aic3254 chip used for processing sound (the closed-source HTC driver doesn't have the issue). Once the chip comes on it doesn't switch off, consuming power at a steady rate.

Help is at hand though. This weekend I have managed over 50 hours since my last full charge, without turning off WiFi/GPS/Sync, etc. Thanks to the efforts of the XDA community there are two fixes for the power drain issue.

The first, which I've tried over this weekend is [the kernel patch from "mad murdoch"](http://forum.xda-developers.com/showthread.php?t=984337). I applied this to a fresh [Cyanogen(mod) 7 RC 2](http://forum.xda-developers.com/showthread.php?t=957336) installation using the ROM Manager app. Once installed I rebooted the phone again into recovery mode and used the menu to delete the battery statistics (under the advanced menu). I then installed [CurrentWidget](https://market.android.com/details?id=com.manor.currentwidget) from the marketplace and plugged the phone in to charge. What CurrentWidget lets you see is when the battery is *really* 100% full, not just when the phone reports 100%. The widget will show a slowly decreasing number of mA going into the phone - your battery isn't fully charged until this drops to zero. In my case this was nearly 2 hours after the phone was reporting a full charge.

[The second fix is from "hrkfdn", and is also a kernel patch](http://forum.xda-developers.com/showthread.php?t=931946). This patch is supposed to be better than mad-murdoch's, but i haven't tested it yet - both fixes are incompatible, so it would probably require wiping my phone yet again, and right now I can't be bothered!

There is one caveat to these fixes in that they both still require a (one time) workaround to switch off the offending radio chip after it has been switched on for the first time. Thankfully the workaround is very simple - merely open then close Google Voice Search. Perform this after making your first call or playing music for the first time and the chip will power up and power down like it is supposed to until the phone is next rebooted.
