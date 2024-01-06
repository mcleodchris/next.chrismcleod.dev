---
title: 'Use Rsync to copy large folders on Windows'
date: 2022-03-12
categories:
  - general-life
tags:
  - software
  - tip
  - linux
authors:
  - chris
redirectFrom: ['/2022/03/12/use-rsync-to-copy-large-folders-on-windows/']
---

This post will fall into the “well duh…” category for a lot of people, but sometimes we need a reminder.

{% image "https://assets.chrism.cloud/chrismcleod.dev/2022/03/image.png", "a screenshot of file names scrolling past in a terminal window", "rsync in action"%}

I got myself a new laptop recently (more on that another day), and wanted to back up files from my old desktop to a portable drive, potentially for loading onto the new device. The main thing I wanted to back up was my photo library; most of the rest of my files are in the cloud/git repos, but I have a large “pre-cloud” library of family photos and consolidated backups from old computers that I’ve not managed to sort through and upload anywhere yet, so I wanted to make sure I had a copy of it. The library is hundreds of GB of various file types, from media to all sorts of metadata files used by the likes of iPhoto.

Try as I might, I could not get the library to transfer using the Windows 10 file explorer. Transfer speeds were abysmal (less than 20Kb/s for a USB-C drive capable of ~1Gb/s), and it would keep hanging on various files. When this happened, it would with a retry/skip action, so needed human interaction to keep going. At the speeds I was seeing it would’ve taken several days to copy over - and if the copy failed I had to start from scratch. Explorer it seems wasn’t a viable solution.

Last night, as I was dozing off to sleep, my brain reminded me that [rsync](https://rsync.samba.org/) exists to synchronise two directories, and WSL makes it easy to use on Windows. There are probably a billion Windows utilities that will do the same job, but I already have rsync in my WSL setup, so why complicate things further?

My source folder is E:\\Pictures, and the destination drive is D:\\. In WSL, this translates to `/mnt/e/Pictures` and `/mnt/d/` respectively. There are [a great many options in rsync](https://linux.die.net/man/1/rsync), but I find `-avz` is a useful starting point for most jobs, and tend to only deviate from that if an initial run fails or I have a specific need. All in all the command I used to backup my photos was:

`rsync -avz /mnt/e/Pictures /mnt/d/`

Simplicity in itself. A few hours later - instead of days - and my library is safely backed up to the external drive and ready for its future home.
