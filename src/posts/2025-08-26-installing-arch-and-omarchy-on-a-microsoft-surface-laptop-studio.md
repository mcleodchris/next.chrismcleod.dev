---
id: 0f5c874c-d63b-43dc-b44f-b10b9340cd45
date: 2025-08-26T19:28:13.309Z
title: Installing Arch and Omarchy on a Microsoft Surface Laptop Studio
tags:
  - linux
  - arch-linux
  - omarchy
  - guide
  - surface
  - laptop
---


My three year-old Surface Laptop Studio (first generation) has been starting to feel a bit long in the tooth as Windows 11 has continued to grow fatter. It's that slow, creeping, feeling you get when a device isn't quite "good enough" anymore. You probably know what I mean; things take longer to open than you remember, and there's just a little bit more "friction" using the device than you'd like. It's small things - a few extra seconds here, a loading spinner there.

Even though I don't use the Surface all that much now, I didn't want to leave it in it's current state. In my experience, there's few more frustrating computing experiences than coming back to a Windows laptop after you've not used it for several weeks/months... only to have it grind to a complete halt when you eventually do power it on as it spends the next hour or more trying to catch-up on updates on the system and applications. So, a switch to Linux was on the cards - ideally lightweight and ready to go for any light dev work I pick it up for.

For approximately the last 3(?) weeks, my YouTube recommendations have been filled with videos talking about Omarchy as the best developer Linux experience on the go. I was skeptical, but I figured I'd try it out, see if it lived up to the hype. Because we're talking about Microsoft hardware, it wasn't the super-simple installation it _could_ have been, but it wasn't too bad. Fiddly enough I figured I'd write it up below.

This blog post won't be a review of Omarchy, or otherwise give my thoughts and feelings - that might come later, once I've had more time with it - it's just documentation in case I need to run through the installation again.

## A Quick Note Up-front
I did this installation over the weekend of 23rd/24th August 2025. Then, on Tuesday - after I'd written 95% of the guide - I discovered the Omarchy project released their own custom ISO which greatly simplifies a few things. I haven't tried out their new installer, but steps 2 & 3 would still be required to get Surface hardware working properly, so I reckon most of this guide holds up. The only real difference is in which installer image you download and replacing Step 1 with their new guided installation.

## Step 0: Preparation
First thing's first, you'll need the latest [Arch Linux installation medium](https://archlinux.org/download/) burned to a USB stick. I used [Rufus](https://rufus.ie/en/) to create the installer USB on [a Sandisk Type-C drive](https://amzn.to/45NiUkv).

Secondly, you will need to disable Secure Boot in the laptop's firmware. From Windows, hold down the Shift key while clicking on Reboot in the start menu. This will restart you into the firmware control panel. Select Security, then turn off Secure Boot by clicking the "Change configuration" button. Select "None", then OK.

> [!Note] Secure Boot
>
> Turning off Secure Boot will put a big, scary-looking, red bar across the top of your laptop's boot screen. It's fine, we'll fix it in step 2.

While we're in the firmware, go back to Boot Configuration and reorder the devices so USB Storage is at the top of the list. I found it a little fiddly to get it to move, but it did eventually drag into the right place.

With your installation medium inserted into the laptop, click on Exit, then Restart Now.

> [!warning] Warning!
> 
> We're going to enable LUKS disk encryption. The built-in keyboard **will not work for entering the encryption key at boot** until after [Step 3](#step-3-surface-hardware). You should keep a wired keyboard handy and plugged in to the laptop.

## Step 1: Minimal Arch Install
Honestly, [the Manual Installation section of the Omarchy manual](https://learn.omacom.io/2/the-omarchy-manual/96/manual-installation) is nice and clear, and covers the most important parts. The main differences to note are:

- For bootloader I "chose" systemd-boot (the default). I say "chose", but really it's I glossed over this entry in the table and didn't realise it recommended Limine instead. You can pick Limine if you want, but I can't help you configure it.
- Additional packages - I added `nano` and `sbctl` (see Step 2).


## Step 2: Secure Boot
This part should be possible to do `chroot`'d into your system from the install media, but I rebooted and logged in as `root`.

Secure Boot was the part I struggled with the most, and it genuinely took me _hours_ to get a working setup. Luckily for you, it should only take a few minutes as a result of that :)

Get the current status of Secure Boot, using `sbctl`. It should look similar to the following:
```bash
sbctl status
Installed:   ✘ Sbctl is not installed
Setup Mode:  ✘ Enabled
Secure Boot: ✘ Disabled
```

Create custom secure boot keys:

```bash
sbctl create-keys
Created Owner UUID 0f5c874c-d63b-43dc-b44f-b10b9340cd45
Creating secure boot keys...✔
Secure boot keys created!
```

Enroll custom secure boot keys, passing the `--microsoft` flag:

```bash
sbctl enroll-keys --microsoft
Enrolling keys to EFI variables...✔
Enrolled keys to the EFI variables!
```

Check the status. It should show as not in setup mode anymore:

```bash
sbctl status
Installed:   ✔ Sbctl is installed
Owner GUID:  0f5c874c-d63b-43dc-b44f-b10b9340cd45
Setup Mode:  ✔ Disabled
Secure Boot: ✘ Disabled
```

**IMPORTANT** Secure Boot is now enabled, but DO NOT reboot yet. You still need to sign the bootloader files, so if you reboot now you won't be able to load Arch until you turn it off again.

`sbctl` includes a `sign-all` command, but it silently failed for me, and didn't sign anything. Instead, check which files you need to sign with `sbctl verify`. A bunch of .img files might be listed as errors, but in my experience, that's fine; I've removed them from the output below:

```bash
sbctl verify
✘ /boot/EFI/BOOT/BOOTX64.EFI is not signed
✘ /boot/EFI/systemd/systemd-bootx64.efi is not signed
✘ /boot/vmlinuz-linux is not signed
```

Sign each of those files in turn:
```bash
sbctl sign /boot/EFI/BOOT/BOOTX64.EFI
sbctl sign /boot/EFI/systemd/systemd-bootx64.efi
sbctl sign /boot/vmlinuz-linux
```

That should be everything you need. It was for me, anyway. The best part is: future kernel updates will automatically be signed, so you shouldn't need touch this again. `sbctl verify` should show the files as signed:

```bash
sbctl verify
✔ /boot/EFI/BOOT/BOOTX64.EFI is signed
✔ /boot/EFI/systemd/systemd-bootx64.efi is signed
✔ /boot/vmlinuz-linux is signed
```

You can add an entry for `linux-surface-fallback` if you want, b ut I didn't bother. At this stage, it should be safe to reboot. Arch should load, and the big red bar should be gone. Login as `root` for Step 3.

## Step 3: Surface Hardware
> [!Note] Note
> 
> I've only been concerned with getting the keyboard/trackpad working, so haven't properly tested things like the webcam yet. The touchscreen seems to work, but I've done the most basic of checking. Refer to the [linux-surface Wiki](https://github.com/linux-surface/linux-surface/wiki/Home) if you need help with any of this.

### Add the Kernel Repository and Install Packages
[Refer to the Wiki](https://github.com/linux-surface/linux-surface/wiki/Home) for the latest steps. The steps I followed are repeated below for posterity:

First you need to import the keys we use to sign packages.

```bash
curl -s https://raw.githubusercontent.com/linux-surface/linux-surface/master/pkg/keys/surface.asc \
| sudo pacman-key --add -
```

It is recommended to check and verify the fingerprint of the key.

```bash
pacman-key --finger 56C464BAAC421453
```

Finally, you must locally sign the imported key.

```bash
pacman-key --lsign-key 56C464BAAC421453
```

You can now add the repository by adding the following to the end of /etc/pacman.conf

```plaintext
[linux-surface]
Server = https://pkg.surfacelinux.com/arch/
```

After doing that you need to refresh the repository metadata, then you can install the linux-surface kernel and its dependencies.

```bash
pacman -Syu
pacman -S linux-surface linux-surface-headers iptsd libcamera libcamera-tools
```

### Add the Boot Loader Entries
As mentioned, I went with the Arch default of Systemd-boot for the bootloader, so this step might not be needed if you chose the recommended Limine. I can't help you with that, sorry.

Systemd-boot doesn't auto-detect new kernels like I remember GRUB doing in other distros, and it is configured differently to the GRUB I've used to since my youth[^1]. This means we have a little work to do.

First, list out the entries you do have, which will probably be just the defaults:
```bash
ls -l /boot/loader/entries

2025-08-24_08-39-03_linux-fallback.conf
2025-08-24_08-39-03_linux.conf
```

Copy the `..._linux.conf` file to `..._linux-surface.conf`, then open it to edit[^2]:
```bash
cp /boot/loader/entries/2025-08-24_08-39-03_linux.conf /boot/loader/entries/2025-08-24_08-39-03_linux-surface.conf
nano /boot/loader/entries/2025-08-24_08-39-03_linux-surface.conf
```
Inside the file, edit the title, then update the paths to the correct vmlinuz and img files. Mine looks like this (I've omitted any lines I didn't edit, so leave the rest of the file as-is, especially the `options` line):
```plaintext
title   Arch Linux (linux-surface) 
linux   /vmlinuz-linux-surface
initrd  /initramfs-linux-surface.img
```

Save and exit.

### Enable the Keyboard for LUKS Decryption
You must be booted into the `linux-surface` kernel for the next steps to work, so if you haven't already, reboot and be sure to select the correct kernel in the boot menu. You can check if you're in the right kernel with `uname -a` - if you are, it will have `surface` somewhere in the output.

Enabling the keyboard early enough that it can be used to enter the LUKS password requires editing how kernel modules are loaded, then regenerating the kernel image. This sounds scarier than it is.

First, we need to edit `/etc/mkinitcpio.conf`.
```bash
nano /etc/mkinitcpio.conf
```

Refer to this page on Disk Encryption in the linux-surface documentation for what you need to add to the `MODULES=()` section. For thoroughness, I added basically everything, so my entry looks something like this (I've removed unrelated entries that were already there):

```bash
MODULES=(pinctrl_tigerlake surface_aggregator surface_aggregator_registry surface_aggregator_hub surface_hid_core surface_hid surface_kbd intel_lpss_pci 8250_dw)
```

Regenerate your kernel images:

```bash
mkinitcpio -P
```

This will churn away for quite some time, but eventually you'll be returned to the prompt. You can restart now, and _should_ be able to type the LUKS decryption password with the built-in keyboard.

Login as your regular user (e.g. `chris`, or whatever) for the remaining steps.

## Step 4: Omarchy
This is the hardest part of the whole setup process. Only kidding, it's one line:

```bash
curl -fsSL https://omarchy.org/install | bash
```

Follow the prompts and by the end of it you should be loaded into the default Omarchy experience. Refer to the [Omarchy Manual](https://learn.omacom.io/2/the-omarchy-manual) to see what customisations you might want to do. For example, I uninstalled Spotify, swapped the email and calendar shortcuts to Fastmail, passwords to Bitwarden, etc.

[^1]: No, seriously. I first encountered GRUB in circa 1997.
[^2]: The datetime file name prefix probably isn't required, but it had taken so long to get to this point I didn't even think about using the basic `linux-surface.conf`.