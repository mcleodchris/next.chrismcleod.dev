---
title: "Notes from installing Manjaro Linux"
date: 2019-04-26
categories:
  - articles
  - notes
tags:
  - linux
  - manjaro
  - notes
authors:
  - chris
archived: true
---

[I mentioned](/blog/i-miss-linux/) that I was thinking about installing [Manjaro Linux](https://manjaro.org/)... well I went ahead and did it. Not even just a little, by dual-booting with Windows 10. No, I wiped everything and just went for it as my one and only operating system. What follows is my notes from the install, so if I want to get back to where I was at some point in the future, I can retrace my steps.

## "Live USB" Installer

Due to having a [Broadcom wireless adapter](https://wiki.archlinux.org/index.php/Broadcom_wireless) in my self-built PC, the networking didn't work "out of the box" for me. Which was a surprise, because it _did_ work the last time I installed Linux. From what I've read, kernel 3 worked fine, but kernel 4 (on the Live image) has some problems with these cards, due to their drivers. This actually stumped me for a while, but in the end... iPhone tethering to the rescue! Put an iPhone into "hotspot" mode, then plug it in to the PC via USB, and Manjaro picks it up as a working network adapter pretty much instantly. It worked over Bluetooth as well. I'll admit I was impressed by this.

This let me connect to the internet and test how to get the WiFi card working. Once I had a plan for that, it was on to the installation

## Installation

Other than the network adapter, everything else about the installation was a breeze. Manjaro came pre-installed with the proprietary Nvidia graphics driver, and after picking a few options (user account, disk partitioning), the installer formatted the disk, set everything up, and prompted me to reboot within a couple of minutes.

## Post Installation

So here's where I had to fix a couple of things.

### Network Drivers

With the iPhone still tethered, the process was something like this:

- Perform a full system update using the package manager
- Use the Manjaro Kernel Manager to install and switch to the latest Linux 5.0 kernel
- Uninstall the broadcom-wl driver package
- Reboot
- Install the broadcom-wl-dkms drivers
- Reboot
- Configure the network connection in the connection manager

I configured my VPN by downloading [the profiles from NordVPN](https://nordvpn.com/tutorials/linux/openvpn/), imported one of them, then set my WiFi connection to automatically connect to the VPN when the network started up.

### Blank Screen during/after boot

I encountered a really strange issue where the login screen would not show after boot, and the system would appear to hang until I pressed some keys. It wasn't a huge deal, once I figured out to press something, but it did start to niggle and made my system feel slower. After a lot of searching I came across [this thread talking about similar symptoms](https://forum.manjaro.org/t/nag-old-problem-still-here-with-login-screen-not-appearing-before-you-press-move-something/80276/7). I installed the recommended package [haveged](https://wiki.archlinux.org/index.php/Haveged), enabled the service, rebooted, and the problem was instantly fixed. After a little more reading, I replaced haveged with [rng-tools](https://wiki.archlinux.org/index.php/Rng-tools), and everything has been fine since.

### Other tweaks

I followed some of the suggestions from [this video](https://www.youtube.com/watch?v=BcDGVcO_tZU&t=1s) - namely install the fonts, reduce "swappiness", install Pamac and a firewall.

## Look and Feel

This was my first time using KDE as my desktop environment, so I was keen to spend some time customising it to my liking. So far I've settled on the "Adapta Breeze Nokto" theme, some additional icons, and played around with the panel + widget setup. It's not fancy, but my desktop currently looks like this:

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/04/Screenshot_20190426_160751.jpg", "Manjaro linux desktop showing the file explorer and terminal applications" %}

I'm generally a fan of darker themes, as they're less of a strain on my eyes.

## Other Random Notes

So far I've only installed a couple of extra software packages and tweaked a couple of small things.

- I installed [Lutris](http://lutris.net/), for running Blizzard games. Hearthstone and World of Warcraft run flawlessly in my limited testing.
- [Visual Studio Code](https://wiki.archlinux.org/index.php/Visual_Studio_Code) was also installed, for pretty much anything involving an editor.
- Steam came pre-installed. A quick check shows around half my existing library is already compatible with Linux; the rest I'll check through "Steam Play" and Proton.
- I added a "bootsplash" loading screen using the (kinda vague) instructions in [this thread](https://forum.manjaro.org/t/bootsplash-provided-by-the-kernel/34467). Basically: install a suitable theme, edit a kernel hook and rebuild the kernel, then add an option to GRUB. Given the speed everything loads at, this might be unnecessary - it's shown for at most 1.5 seconds.
- On SSD-based systems, enable the fstrim.timer service to enable TRIM support (recommended).
- With the Nvidia driver, get better looking scrolling in Firefox by enabling layers.acceleration.force-enabled in about:config.

That's all my notes for now. No doubt I'll post up more as I get more comfortable with the OS and explore the capabilities a bit more ?
