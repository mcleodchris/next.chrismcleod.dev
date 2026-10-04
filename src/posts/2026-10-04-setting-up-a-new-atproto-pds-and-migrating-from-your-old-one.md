---
id: e97ecb1c-54c3-47ee-a822-22b4438e52ae
date: 2026-10-04T14:21:52.741Z
title: Setting up a new AtProto PDS and migrating from your old one
tags:
  - atproto
  - bluesky
  - social-media
ogImage: setting-up-a-new-atproto-pds-and-migrating-from-your-old-one-preview.jpeg
atUri: "at://did:plc:fcewtyqycu5qlt26tnbnan6h/site.standard.document/3mx2kkvqmws2f"
---

I've previously written about [setting up your own AtProto personal data server (PDS)](https://chrismcleod.dev/blog/next-steps-with-bluesky-hosting-your-own-data-and-more-on-the-api/), for hosting data for BlueSky, Standard.Site, and other AtProto applications. When I wrote that post 2 years ago I had used DigitalOcean as the host as they had a quick-deploy template to get things up and running very quickly. I'd always intended to move from DigitalOcean, but it ended up quite far down the priority list. Some recent events reminded me I did not want to give the company anymore of my money and spurred me to finally make the move. _This_ post serves as a high-level guide to the steps involved, highlighting some of the gotchas I ran into along the way.

## 1. Create your new server

Pick your cloud host of choice and create a basic VPS. You really don't need much to host a 1 to ~20 user PDS. As I was going through this exercise to get the very last of my stuff off of DigitalOcean, I specced a server at Hetzner with about the same as I was running over there: 1 vCPU/2GB RAM/40GB disk. This is enough to comfortably run the PDS + monitoring stacks and have plenty headroom in case I want to stick another site or two on there. There are several options for server OS, but I went with Ubuntu.

> [!NOTE] Ubuntu versions
> At the time of writing, the official installer script only supports Debian 11-13, plus Ubuntu 20/22/24 LTS versions. Ubuntu 26 LTS was recently released, and that's what I picked for my server OS, because I didn't want to do an upgrade later. I hacked the installer script to recognise 26, and it's been working just fine, but [caveat emptor](https://www.merriam-webster.com/dictionary/caveat%20emptor).

I'm not going to go into all the steps I took once the server is created; there are already enough good resources out there about securing a new server, but as a very basic starting point:

1. Run a system update and upgrade installed software.
2. Create a non-root user for day-to-day admin.
3. Turn off password authentication for SSH, ideally also turn off root logins.
4. Ensure there's a firewall in-front of the server, and restrict it to only ports 22 (that said, see below), 80, and 443 incoming.
5. Install `fail2ban`.

For my server I installed Tailscale, setup [Tailscale SSH](https://tailscale.com/docs/features/tailscale-ssh#connect-over-ssh), and removed port 22 from the firewall. This way I can access the server from the tailnet, and don't need to expose the regular SSH port to the internet, which should _in theory_ make things a little more secure.

The PDS stack uses docker. The installer script should install all the required dependencies as part of the setup, but if you want to install this yourself ahead of time, I used [the instructions from the Docker website](https://docs.docker.com/engine/install/ubuntu/).


## 2. Setup the DNS ahead of time

DNS takes time to propegate, so it's a good idea to get this setup as soon as you know the new server's public IP. My first attempt at running the installer failed because the domain couldn't resolve. You'll need at least 2 `A` records:

- `your-pds-domain.tld`
- `*.your-pds-domain.tld`

You can also use sub-domains, which may be preferable if you have (or want to have) a website on the root domain, so you might choose this instead:

- `subdomain.your-pds-domain.tld`
- `*.subdomain.your-pds-domain.tld`

I went with `mypds.lol` and `*.mypds.lol`. You must use something different to your current PDS, whether it's `newdomain.tld` or `newpds.olddomain.tld`, or the data transfer won't work.

Use something like [DNS Checker](https://dnschecker.org/) to verify that you can resolve domain names and they return your server IP.

## 3. Install the reference PDS

The [README for the PDS setup](https://github.com/bluesky-social/pds/blob/main/README.md) is pretty good, and you can get away with just following that. In broad terms the steps are:

1. Download the installer script to the server. As mentioned above, I also hacked in support for Ubuntu 26 LTS.
2. Run the installer using `sudo`. It will install any pre-requisites missing from the system, then ask you for your domain details.
3. Create a new user account. Technically not _required_, but I did this so I could test everything was working before moving any accounts.
4. Open up `/pds/pds.env` and add in your SMTP configuration. You'll need this working to validate account email addresses on BlueSky. One quick aside: email **must** be working on your _old_ PDS to be able to complete the account transfer.
5. Optionally, [add the monitoring stack](https://github.com/bluesky-social/pds/tree/main/monitoring) and configuration.
6. Restart the PDS service with `sudo systemctl restart pds`.

> [!NOTE] Email ports
> Some hosts - like Hetzner - restrict outbound access to email-related ports as a way of preventing abuse. This might mean that the default configuration given in the README doesn't work. In my case, the PDS could not connect to Resend on SMTPS port `465`. Changing `PDS_EMAIL_SMTP_URL` to use `smtp://...` and the only port Hetzner _does_ allow - `587` - got things working. Check your host's documentation if you run into issues.

If you want test everything is working right, login to BlueSky using the test account created at step 3 above. You should be able to verify the email address, see and interact with your regular account, and whatnot. Once you're happy things are correct and stable, time to start moving other accounts to the new PDS.

## 4. Move account data

> [!WARNING] App Passwords
> App passwords will not/cannot be migrated, so make sure you make a note of any which need to be regenerated/updated after the move. For me these included a CI/CD integration for Standard.Site publishing and Brid.gy.

My original post included a link to [a guide to moving from a BlueSky-hosted PDS to a self-hosted PDS](https://whtwnd.com/bnewbold.net/3l5ii332pf32u). The process of migrating from your old PDS to your new PDS is exactly the same, so you can happily use that guide and the `goat` tool which comes bundled with the PDS to do the migration. The README explains how to access `goat`:

```shell
docker exec pds goat <command> [options]
```

I'm going to recommend you use an easier tool though: [PDS Moover](https://pdsmoover.com), by [pds.dad](https://bsky.app/profile/pds.dad). It's an open-source, web-based tool which does the migration entirely client-side. It's very straightforward to use, so I'm not going to go step-by-step through the whole process in detail. To get started though, you will need to generate an invite code on the new PDS using `goat`:

```shell
docker exec pds goat pds admin create-invites
```

Each account you are moving will need a code, and the codes are one-use only. Once you have the code, you can start the migration - fill out the form, accept the (small) risk, and click the `Moove` button. The wizard will guide you through the process, and you should leave the tab open while it runs. If you have a lot of posts and blobs (images/videos) then this process can take some time.

> [!TIP]
> For the first account I moved, I gave it a new handle of `[handle].mypds.lol`, as I thought you needed to give it this PDS-centric type of handle **before** giving it a personal domain handle like e.g. `chrismcleod.dev`. I _swear_ this used to be the case. Turns out you don't need to. For later accounts I set the New Handle field to `mydomain.tld` and it worked just fine, saving a step.

Remember to save the Rotation Key it gives you at the end of the process. This can help you recover your _account_ if anyone malicious takes control of your PDS. Enabling backups will help you recover your _data_ in the same scenario.

With the account all moved over, you'll need to log back in to BlueSky (or [mu.social](https://mu.social)/other UI) to refresh login tokens and the like. You'll also need to [re-validate your account email address](https://bsky.app/settings/account) in the settings panel. Accounts may show as "invalid" until you do these two steps. But that should be it - you have (hopefully) successfully moved your AtProto data from one PDS to another. Repeat for as many accounts as you need to move.