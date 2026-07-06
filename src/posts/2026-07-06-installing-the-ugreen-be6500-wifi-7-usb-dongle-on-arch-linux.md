---
id: 802202ff-9bc4-4382-bf14-250f16329273
date: 2026-07-06T19:53:47.890Z
title: Installing the UGREEN BE6500 WiFi 7 USB Dongle on Arch Linux
tags:
  - linux
  - arch
  - wifi
  - howto
---

I had a problem where the integrated WiFi 7 adapter on my MSI motherboard would randomly just... disappear... from the system. As in, completely drop off the PCI bus and not show up again until I'd completed a couple of rounds of clearing the CMOS, and even then, it was a bit temperamental as to how many times I'd need to go through the dance. Annoyingly there was no rhyme or reason as to when this would happen. Could be 6 days between episodes, could be 6 weeks or more. Thankfully there was a dedicated button on the back of the motherboard and I didn't have to open up the case and mess with jumpers every time, but it was still a faff.

After losing a couple of hours to the latest failure, I broke and bought a USB WiFi dongle, specifically, [this UGREEN dongle](https://amzn.to/4bqHwmI) (affiliate link). Now, I admit, I didn't do as much research as I might normally do if I was less annoyed, but I trusted in the modern state of Linux distros and WiFi drivers. It couldn't be as bad as the days of [ndis_wrapper](https://en.wikipedia.org/wiki/NDISwrapper) and loading Intel's Windows drivers on Gentoo, as [I remember doing in the early 2000's](https://chrismcleod.dev/blog/gentoo-on-a-samsung-x10/), could it?

No. It was **nowhere** near as bad as that! While I did have to compile a couple of modules, and run a few commands, it was pretty uneventful.

_Note: the following is what I did to get this working **on my PC**. Your mileage may vary._

## Install pre-requisites:
```bash
uname -r # get your current kernel
yay linux-headers # pick the version matching your kernel
yay dkms
yay usb_modeswitch # stops the dongle showing up in "CDROM mode"
```
You can use `pacman` if you prefer, but I used `yay`.

## Clone the driver/firmware repo
```bash
git clone https://github.com/morrownr/rtw89
cd rtw89
```

## Remove any out of date/default drivers (optional, but recommended)
```bash
sudo make cleanup_target_system
```

## Build and install using dkms
```bash
sudo dkms install $PWD
sudo make install_fw
```

## Copy the module configuration
```bash
sudo cp -v rtw89.conf /etc/modprobe.d/
```

## Load the drivers
```bash
sudo modprobe rtw89_core_git
sudo modprobe rtw89_8922au_git
```

## Check the adaptor is showing 
```bash
lsusb
  ...
  Bus 002 Device 003: ID 0bda:8912 Realtek Semiconductor Corp. 802.11be WLAN Adapter
  ...
  
ip link show
  ...
  wlan1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state DOWN mode DORMANT group default qlen 1000 link/ether...
  ...
```

You'll notice there the adaptor is showing up, but not connected. That's fine. In my case the integrated adaptor was still running as `wlan0`, was connected, and I hadn't configured a connection for `wlan1`.

## Next steps
From here, I went through the following steps:

1. Reboot
2. Checked the adaptor was still showing up as expected after the reboot
3. Reboot into the BIOS/EFI Firmware
4. Disable the WiFi functionality of the integrated card (I kept Bluetooth switched on)
5. Saved and rebooted

Logging back into Plasma, WiFi connected as usual. Checking `ip link show` listed only `wlan0`, but that's because the USB adaptor was now the only one on the PC. Checking on my router, just to be sure, showed the connected device manufacturer as UGREEN instead of MSI - success!

## Final note: This might not be needed in the future
Going by [this Issue on a repo related to the driver I used](https://github.com/morrownr/USB-WiFi/issues/720), the `rtl8922au` drivers will be integrated into the Linux kernel itself, starting with Linux 7.2. That should make many adaptors based on the Realtek 8912/8922 chips "plug and play" for the most part. I imagine it will probably need a few months and patches to truly settle down, but it's a great step forward.