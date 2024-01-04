---
title: "Changing the DNS on a (PlusNet) Technicolor TG582n FTTC Router"
date: 2014-03-05
categories:
  - articles
tags:
  - networking
  - guide
authors:
  - chris
archived: true
---

I recently had fiber broadband installed at the house. This meant switching provider, and getting a whole new router. ISP routers, by-and-large are terrible, and this one was the type which only allows changing a limited set of options through the web-based admin page.

For a while it was working fine enough, but I started getting lots of DNS issues; accessing sites was terribly slow due to looooooong lookup times - when the lookup succeeded at all! I looked for the option to switch to using the OpenDNS servers, but there was no way to do this through the UI.

Of course, I figured someone had to have run into and fixed this problem before, and with a little hunting around, I was proved right - [Pete Cooper had documented how to change these settings](http://www.petecooper.org/tutorials/changing-dns-servers-on-a-technicolor-tg582n-fttc) through the archaic and arcane wonder of `telnet`.

Logging into my router through the console, using Pete's instructions, it soon became apparent his steps had been broken by a firmware update - only a couple of the commands worked. But now I had a lead, I was sure I could figure it out. With a little digging around, and judicious use of the `help` command, I was able to put together this sequence of commands to update the DNS settings:

To list your current DNS servers:

```bash
dns server forward dnsset list
```
To a new primary DNS server with higher priority than the default:

```bash
dns server forward dnsset add set=0 dns=208.67.220.220 label=None metric=4 intf=Internet
```
Add the secondary as above:

```bash
dns server forward dnsset add set=0 dns=208.67.222.222 label=None metric=4 intf=Internet
```
Save our changes:
```bash
saveall
```
With the commands entered, my web surfing instantly got a massive speed boost as the DNS issues went away :) I should point out that I left the default PlusNet servers in there as back-up. If for some reason I can't connect to OpenDNS, the router will fall back to the PlusNet DNS.
