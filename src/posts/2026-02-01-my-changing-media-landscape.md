---
id: b81af170-c43d-4d98-880f-ceddff50e1d3
date: 2026-02-01T16:49:56.005Z
title: My Changing Media Landscape
tags:
  - media
  - streaming
  - music
  - movies
  - tv
  - books
atUri: "at://did:plc:fcewtyqycu5qlt26tnbnan6h/site.standard.document/3mpyyqdh3oc2p"
---

I cancelled Disney Plus in September (though my annual sub runs until March). A year ago, I downloaded my entire Kindle library and stopped buying from their store. Netflix was cancelled in December. Audible went bye-bye sometime last summer. None of this was planned, exactly - more like a series of small decisions that eventually accumulated into something larger.

The reasons are varied but overlapping. Streaming services have kept raising prices while the parts of their libraries I cared about shrank or became stagnant. Movies I wanted to watch would vanish without warning, or arrive in the UK months later. At various times my partner and I complained about catching ourselves scrolling endlessly through recommendations we didn't want, looking for the handful of things we actually cared about. Often we'd spend more time trying to find something to watch than actually watching something.

I bought a [UGREEN NASync DXP4200 Plus](https://amzn.to/3OgkiXH) (affiliate link) in May 2025, partly as a general storage solution for the house, but I also started forming the makings of a plan to bring together all these changes into a better "media landscape" for our household. It's taken effort, but it's at a point where we're starting to see the benefits.

## Building Our Own Netflix
The first steps were simple enough, though it involved more outlay: I bought a Pioneer BDR-XD07TS external Blu-ray drive from eBay. It supports UHD discs and [LibreDrive firmware](https://forum.makemkv.com/forum/viewtopic.php?t=18856), which matters if you want the least frustrating time backing up what you own. With [MakeMKV](https://www.makemkv.com/) for ripping and [Handbrake](https://handbrake.fr/) for converting to something more space-efficient when needed, I had a workflow I could use basically anywhere. At times I setup an old laptop in the corner of my office and would swap out discs as necessary while I was working on other things.

I started with the DVD and Blu-rays we still owned, then gradually added more as we found things we wanted - a few were bought new from HMV, but the majority came from eBay or CEX as second-hand purchases. When one of the kids showed interest in 80's/early 90's movies, it was easy and relatively cheap to get several to add to the library.

The collection's grown quite a bit over the last few months, all sitting on the NAS, which is running [Jellyfin](https://jellyfin.org/) as a container. On Apple devices we use [Infuse](https://firecore.com/infuse) for playback - I tried [Swiftfin](https://github.com/jellyfin/Swiftfin) first but it was too buggy. The Jellyfin web UI works fine for everything else.

{% image "https://assets.chrismcleod.dev/chrismcleod.dev/assets//16e49e3f-eb7f-4d22-be41-9feb83953a6d.png", "Our Jellyfin dashboard displaying various media in rows such as Recently Added in Movies and Continue Watching" %}

My partner loves it. She described it as "her own personal Netflix" - just the stuff she actually wants to watch, without algorithms trying to convince her she needs to see whatever's being promoted this week. That's become the recurring theme: intentionality over abundance.

The main technical consideration was network access. I use a reverse proxy to handle TLS, and everything runs through a Tailscale Tailnet to keep it private and secure. I can - and have - streamed music and video from the NAS to my phone while on the bus, walking around town, or sitting in a cafe. The details probably warrant their own post, but the short version is: it works, and it works reliably[^1].

[^1]: My desktop does keep losing access since I rebuilt it. It's [easy to fix](https://tailscale.com/kb/1188/linux-dns#dhcp-dhclient-overwriting-etcresolvconf), just a recurring annoyance I need to get to the bottom of.

Discovery is the obvious trade-off. New films mean cinema trips (which is no bad thing, just rare for us) or waiting for physical releases. For TV shows, physical releases are becoming genuinely difficult to find. There's no general UK release of [Andor](https://www.themoviedb.org/tv/83867-andor) on Blu-ray, for example - just an expensive limited edition season 1 UHD box set that is hard to justify. I have a low-res copy of season 1 from a DVD purchased off eBay - one I now suspect was less than legit! Other Disney-owned shows are similar: my partner can't get [Scream Queens](https://www.themoviedb.org/tv/62046-scream-queens) season 2 in the UK, for example. Only the first Knives Out film has a physical release for another example. If we can't get something physically, or through iPlayer or other UK services, we often just... don't watch it. Them's the breaks.

The other challenge has been time, particularly for TV shows. Ripping discs isn't difficult, but episodes aren't always in order on the disc itself. I've found I need to manually verify once they're extracted. I didn't realise this at first and had to go back and fix about 160 episodes across several shows and seasons. Now I check as I go. It's tedious but manageable. The upshot is that new stuff tends to get added "as and when" I have time. I still have a couple of box sets I need to work through to get caught up with everything.

Once I've backed up our discs I pop them into a large slip-case; it holds 400 discs, and I think I'll need to get another before long. The original cases get chucked into the recycling. This is the best practical solution we have to storage space limitations while keeping the original copy.

## Piecing Together a Music History
My music library was archaeology. I went all-in on music streaming _years_ ago, as it seemed so much more convenient at the time. I had an old iTunes library scattered across multiple backups and old hard disks, fragments of history going back decades. I consolidated it all, cleaned up the metadata, reorganised the folder structure, then loaded everything into Jellyfin. It took a couple of weeks. In doing so I found I had many albums I knew I owned, but must've never ripped from my original CDs. While my CD library has had some attrition over the years, I still had a large chunk of it in a box in the loft. It's on my todo list to bring the box down and fill in those gaps.

New purchases are coming from [Qobuz](https://www.qobuz.com/gb-en/shop) if it's a brand-new release, otherwise eBay and Music Magpie are OK for second-hand CDs.

On iOS I use [Finer](https://apps.apple.com/us/app/finer-player/id6738301953) for playback; on Arch I use [Tauon Music Box](https://tauonmusicbox.rocks). Everything [scrobbles to Last.fm](https://www.last.fm/user/chrismcleod) through Jellyfin/the client, which once Last.fm catches up to what I listen to in 2026 might help with discovery[^2].

[^2]: I have many long gaps in my scrobble history, as I've picked up and dropped Last.fm a lot over the years. Prior to December 2025, the last time I scobbled was October 2012.

{% image "https://assets.chrismcleod.dev/chrismcleod.dev/assets//81efb770-dec6-439c-86d2-82923cbb91be.png", "A dark music‑player interface (Tauon Music Box) showing a Hayley Williams artist playlist. The central column lists tracks grouped by album. Right panel shows a monochrome portrait of a woman boxed in orange along with track and album info: Mirtazapine; Ego Death At A Bachelorette Party (2025); In the left sidebar is a list of playlists: Jellyfin Collection; Rediscovered; Xmas Eve 2025; Artist: Hayley Williams. Playback controls are at bottom." %}

I have kept Apple Music. It's included in a bundle we all use for other things, and I still like it for mood playlists when I don't have something specific in mind - just a vibe I want that isn't in my collection. Soundtracks and Classical, mostly. [Marvis Pro](https://apps.apple.com/gb/app/marvis-pro/id1447768809) handles that nicely on iOS, as does [Cider](https://cider.sh) on Linux.

The combination works: my library for intentional listening, Apple Music for when I just need something different in the background.

## The Great DRM Escape
Books were more fraught. [Amazon removed the ability to download your Kindle library](https://www.theverge.com/news/612898/amazon-removing-kindle-book-download-transfer-usb), but I managed to get mine before the window closed. Removing the DRM was straightforward enough with the right tools. Apple Books was a different story - I could get the files, but couldn't remove the DRM, and so they're stuck in Apple's ecosystem forever. This was only a small handful of titles though, and I can read them on my iPad, so while it's inconvenient, it's not a huge loss overall.

I switched to [Calibre](https://calibre-ebook.com/) for library management and bought a [Kobo Clara Colour](https://uk.kobobooks.com/products/kobo-clara-colour) for reading. The physical buttons were the deciding factor. I could never quite place why I fell out of love with eBooks and readers; it turns out I don't want to tap a screen to turn pages - I want to press a button. It's a small thing that matters enormously in practice. This is the first eReader I've owned since the 2nd-generation Kindle I've actually *enjoyed* using for any length of time.

Most ebooks I've bought since the switch now come DRM-free directly from publishers when the option exists. Occasionally I'll buy physical if I know I'll want to keep it.

I cancelled Audible at some point as I wasn't using it anymore - there are a few audiobooks in my library but they're basically incidental to everything else. [Libation](https://getlibation.com/) helped with these. I run [AudioBookShelf](https://www.audiobookshelf.org/) on the NAS to manage and listen to my audiobooks. The web player suffices.

In terms of hands-on management vs size of collection, books have probably taken up an outsized slice of my time. Book metadata is rarely consistent it seems, with titles and series data being all over the place once loaded into Calibre. Correcting and organising it in a logical manner is an ongoing process.

## Wrapping Up
We have a library that's ours now, in a way that streaming catalogues never were. There's privacy in not having viewing habits tracked and analysed. There's ownership that feels genuinely different from renting access. Our library has grown to 101 movies, 20 TV shows, and nearly 6,000 tracks across almost a thousand albums - about 3 terabytes total[^3]. It's a work in progress.

[^3]: As someone who started down the path of digital media with a 32MB MP3 player, these numbers _blow my mind_.

Mostly, though, I'm not scrolling through endless recommendations trying to find something worth watching or listening to. I'm choosing from things I've already decided matter. That sounds trivial, but it's changed how I engage with media. I find I'm watching and listening *more often* despite having "less choice", because I'm not wasting time hunting past what's been chosen for me.

My partner feels the same way. The lack of algorithmic noise is its own kind of luxury.

I've noticed more people talking about similar approaches - fatigue with streaming, frustration with DRM, a desire to actually own things again. "Going analogue" with physical media is something I've seen a lot recently. So I wanted to write about what I'd done and what works for us. Recent posts from others helped inspire me to put words to blog after months of thinking about it:

- [Taking back control of the music I listen to](https://herve.alsace/taking-back-control-of-the-music-i-listen-to/)
- [I'm back to building my own digital music collection](https://hidde.blog/owning-music/)
- [Apple TV Movie Collection 2026](https://ivikrant.net/2026/01/20/apple-tv-movie-collection-2026/)

It does require an investment - both time and money. Ripping and organising takes (a lot) longer than clicking "subscribe". There are technical considerations around storage and network access. Discovery is genuinely harder without recommendation engines, even if those engines were mostly noise anyway.

But this far in, we don't miss the services. Our library grows slowly and deliberately. We enjoy what we choose to keep. The trade-offs feel worthwhile.