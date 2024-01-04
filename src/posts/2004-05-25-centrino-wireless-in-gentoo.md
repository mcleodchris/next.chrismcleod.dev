---
title: "Centrino Wireless in Gentoo"
date: 2004-05-25
categories:
  - articles
authors:
  - chris
archived: true
tags:
  - personal
  - linux
  - laptops
  - how-to
---

Centrino is the big thing in laptops at the moment. Longer battery times despite more powerful processors and inbuilt 802.11b wireless. Unfortunately, Intel have yet to provide Linux support for the wireless component of Centrino and are a little cagey as to when it will be available.

Thankfully, the open-source community is a crafty community. [NdisWrapper](https://web.archive.org/web/20050414015522/http://ndiswrapper.sourceforge.net/) provides a method of loading Windows drivers to enable the wireless card.

At the time of writing, there are ebuilds in portage for NdisWrapper (latest version is 0.6-rc1). Unfortunately, they seem to be quite buggy and I’ve yet to get them to work. Instead, what I found to work best was to get the latest version from the NdisWrapper site and compile it from that source. At this time, the latest version is 0.7. Then follow the steps below to release yourself from your cat-5 tether! _Note 1: as a prerequisite, you need to `emerge wireless-tools`._

### The Driver

1. Download the latest source tarball to your system from the [Ndiswrapper Sourceforge Project](https://web.archive.org/web/20050414015522/http://sourceforge.net/projects/ndiswrapper/) and unpack the archive.
2. For the Intel PRO/Wireless 2100 (standard Centrino wireless card), download [this driver](ftp://ftp.support.acer-euro.com/notebook/TravelMate_80x/driver/winxp/intel2100b.zip). Otherwise, consult the NdisWrapper homepage.
3. Open up a terminal and `su` to root then `cd` to the directory you extracted the source to.
4. `make install`
5. Unpack the Windows driver and check for a .inf file. In the above package, it should be “w70n51.ini”.
6. `ndiswrapper -i /path/to/win/driver.inf`
7. Once that’s done, type `ndiswrapper -l`. The name of the inf file should be listed. If not, you may have mistyped the path, so try again.
8. `modprobe ndiswrapper` to load the driver. Providing there are no errors, typing `dmesg` should return “wlan0: ndiswrapper ethernet device…”

### Configuring Your Card

The next bit will either be straight-forward or trial and error. It just depends on your setup. I had a bit of bother getting the right combination of authentication settings before I got my card to work.

`iwconfig` should list your card and its current settings, which will be all empty. To change this, you need to do the following:

1. `iwconfig wlan0 mode Managed` if you use and access point. Otherwise, set mode to “adhoc”.
2. `iwconfig wlan0 key restricted <wifi key>` will set your authentication key (hex format). Pass the `-s` option after key to type the key in ascii format. Depending on your setup, you may have to subsitute “restricted” for “open”.
3. `iwconfig wlan0 essid your_essid` sets your network ID.
4. `ifconfig wlan0 up` should now bring your wifi card online. If not, fiddle around with the settings above. Also take a look at the other options you can set through iwconfig.
5. DHCP users should type in `dhcpcd wlan0` to assign an I.P. to your card.
6. Alternatively, to assign a fixed I.P. you need to copy `/etc/init.d/net.eth0` to `/etc/init.d/net.wlan0` and edit accordingly. Then type in `/etc/init.d/net.wlan0 start`.

If you were to `ping` Google or similar, you should see your connection working.

### Final Steps

The tricky bit is now out of the way. All that should be left to do, is to get the card to come back up at boot time:

1. Add `ndiswrapper` to `/etc/modules.autoload.d/kernel-<kernel version>`
2. If using DHCP, add the five steps in “Configuring Your Card” (above) to `/etc/init.d/local.start`.
3. Otherwise, you’ll probably want to add the net.wlan0 file to startup with `rc-update add net.wlan0 default`.

That should be it! I’ve been happily connecting with the card in my Samsung x10 since I reinstalled Gentoo about a month ago. One point – DHCP users might want to try the net.wlan0 method of configuring/bringing the card up/down instead of using local.start. It seems to be the “correct” way to do it and a lot “cleaner”._However_, I had no success getting this method to work with Ndiswrapper 0.7 (0.4 worked, IIRC). That’s not to say it won’t work for you, it just didn’t work for me… Give it a try by all means, then let me know how it went by leaving a comment.
