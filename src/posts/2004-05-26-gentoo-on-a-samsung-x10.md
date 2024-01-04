---
title: "Gentoo on a Samsung x10"
date: 2004-05-26
categories:
  - articles
authors:
  - chris
archived: true
tags:
  - personal
  - linux
  - laptops
---

_Last Updated: 27/May/2004_

The Samsung X10 was, for a long time, the thinnest notebook available. It’s also silver and all shiny. Obviously, I just had to have one! Specifically, the XTC1400 which boasts a Pentium-M 1.4GHz, 512Mb RAM, 40GB disk, CD-RW and wireless networking (it’s a Centrino notebook).

By default, it comes with WinXP Professional. Obviously, that just will not do! Unfortunately, it’s not the easiest laptop in the world to install Linux on. I’ve done a number of installs with several distros and have had wildly differing results – even between reinstalls of the same distro! Eventually though, Gentoo won the day…

Not that it was an easy process, mind you. Indeed, as I type this, a few features are still not working (read: ACPI). But by and large, the laptop is fully usable for day-to-day tasks. Even my Girlfriend can use it, so it must be ok!

Here’s a quick run-down:

- **Kernel** – currently 2.6.6 love4. Seems very stable and relatively nippy. **Edit 27/May/2004** – Now using 2.6.1 + a handful of patches.
- **Display** – The biggest stumbling block for the X10 at one point. Using XOrg X11 \+ the latest Nvidia Kernel & GLX (5336) from Portage works a treat.
- **Sound** – ALSA’s a bit temperamental at the moment. I had it fully working at one point, but forgot the fix when I did a reinstall. Normal users get a “Cannot find /dev/mixer” error. I know it’s fixable though, but I want to get other pieces working first.
- **Networking** – The wired LAN card works a treat straight off the bat. The WiFi card took a bit of work though. Read [this post on Centrino Wireless + Gentoo](/2004/05/25/centrino-wireless-in-gentoo/) to get it working. I’ve had no need to use the modem, so I don’t have a clue if that works or not… From what I’ve read, it might only work with a 2.4 kernel.
- **ACPI** – The major stumbling block at the moment. Some things are working, others aren’t – at the moment, only the AC adapter and battery aren’t being picked up. The problem lies with the common (missing?) ECDT error. I’ve tried adding the several potential patches to the kernel, but none have ever installed properly. **Edit 27/May/2004** – fixed by reverting to 2.6.1 kernel + patches. Guide Coming Soon.
- **Speedstep** – I’m not going to try the CPU frequency scaling until I’ve gotten ACPI properly working. Just in case.
- **Touchpad** – Using the Synaptics touchpad driver, everything works apart from the scrollwheel/middle button. No matter of tinkering could get this to work. The driver does provide features that make up for this, but in the end, I installed a MS Bluetooth mouse instead… (guide coming soon)
- **Keyboard** – Not tried to get the extra keys going yet. Last time I installed I couldn’t get them working, but I didn’t exactly try hard.

Currently I’m running Gnome 2.6 and find it very responsive. Apps load up quite fast, although I’ve not been doing anything particularly strenious with the machine since I installed Gentoo.

This page will be updated as I get more things working (and write the guides for the fixes)
