---
title: "The Unnoticed Silo"
date: 2019-11-27
categories:
  - notes
tags:
  - 1password
  - bitwarden
  - data-exports
  - password-manager
  - security
  - silo
  - user-experience
  - user-lock-in
authors:
  - chris
archived: true
---

My employer has started blocking [1Password.com](https://1password.com/) recently, breaking my ability to access my passwords and Two-Factor Authentication (2FA) details using the browser extension. I can still get these details on my phone, but typing a completely random 22-character password by hand is far from ideal, and a bit of a pain in the rump, to be honest. This isn't their most egregious "security theatre" policy, but it is one of the most impactful (to me).

Cards on the table, I 💖 1Password, and have been a paying customer for several years. If my access and ability to securely login/sign-up to stuff wasn't being impeded by another party, I'd happily keep chugging away without much further thought. Their software has been super useful, convenient, and improved how I approach my personal online security.

As it is though, I started thinking about migrating from 1Password to [Bitwarden](https://bitwarden.com/); the ability to [easily self-host Bitwarden](https://do.co/2tMg4KV) being the main attraction in this scenario. Between hosting costs and upgrading to a "Pro" tier account for in-app 2FA generation, it would work out about $15-20 a year more expensive than I pay for 1Password, but that's not a huge amount in the grand scheme of things.

_However_.

The most immediate concern would be rebuilding my password vault accurately, complete with all the 2FA details I need - which is _a lot_. That's going to take a lot of time and effort to move across, even with an export recreating everything - at the very least I'm going to have to check and verify everything imported correctly and that I'm not locked out of anything. And my digging into this hasn't confirmed that all item types I use in 1Password can be exported across to Bitwarden.

_However_, part two.

Unless you happen to have an installation of the native applications for macOS or Windows (say, because corporate policy prohibits and prevents it, and you no longer run either of those OS's at home…), **there's no way to export your data**. At all. 1Password then becomes a [silo](https://indieweb.org/silo) you can't easily get out of. The only way out is to manually recreate all of your data elsewhere. When your vault starts getting above more than a few dozen items, that's a lot of work. Mine stretches into the hundreds.

It's something I hadn't really thought about before I started the thought exercise around potentially moving away. When we talk about silos, normally we're talking about [social media](https://indieweb.org/social_media) locking your posts and user data inside their networks. An everyday utility like a highly-convenient password manager rarely factors into it. And yet, here I am. I guess I forgot [my initial misgivings about 1Password.com](/blog/1password-no-longer-selling-standalone-licenses/), and didn't check ahead for an exit strategy.

I'm not certain how I'm going to proceed from here. 1Password themselves haven't given me a reason to quit their service, but I'd be lying if I said this realisation of how "locked in" I am didn't bug me and push me to migrating as an it's-the-principle-of-the-thing "eff you" moment.

It's something to revisit in the new year.
