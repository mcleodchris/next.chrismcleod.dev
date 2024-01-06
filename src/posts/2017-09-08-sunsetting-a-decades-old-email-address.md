---
title: "Sunsetting a Decades-old Email Address"
date: 2017-09-08
categories:
  - articles
  - notes
authors:
  - chris
archived: true
tags:
  - email
  - tip
  - personal
---

I recently decided it was time to consolidate several email accounts, spread across multiple services, to one easily managed account. Some of these have been in use for over a decade. Some are "custom" domains, some are Gmail and other hosted services.

Partly this was for simplifying things -- "what account did I use for signing up to that?" -- partly it was to reduce the number of services I pay for every year (more on that in another post. Probably.) and partly it was to reduce my online "footprint" for privacy and security reasons. As a welcome side effect it would dramatically reduce the volume of spam I receive!

Importantly, my goal wasn't to just redirect them all into yet another account. That would just lead to more juggling in the future. My goal was a full purge. I would have one master account and anything old would no longer exist.

### Step 1. Identify What Was "To Go"

I had one fairly recent Gmail account which was practically never used, and had a decent address. I quickly settled on this as my new master account. Everything else was on the chopping block from this point on. This included some domains setup at FastMail which used some special setup to let me segregate each service I'd signed up to under its own subdomain address (i.e. _user@service.domain.com_). More on these domains in a later post.

I checked through my password manager to make sure I'd found all of the email services I had logins for, in case I'd forgotten about any.

### Step 2. Secure the Master Account

Buy a Security Key. Use it. I followed [these steps to get things setup](https://techsolidarity.org/resources/security_key_gmail.htm) so I have 2FA through either the key, or the authenticator app on my phone. This lets me avoid the backup SMS codes I've never really felt were particularly secure.

I really wish more services supported this setup, instead of limiting you to app + SMS. Or primarily SMS -- yes, I'm looking at you, Twitter.

### Step 3. Temporarily Redirect Everything to the Master Account

This was so I could categorise and prioritise the mail I was receiving. I applied a filter to incoming mail to tag it with the service it was forwarded from. From here I was able to identify where I had to put the most work in.

### Step 4. Update Priority (Non-Email) Services

Mostly this involved going through my 1Password vault and updating anything I felt was important during the first pass. As many of the services used an email address as part of the login, I could search for each address in turn to cut down on the number of sites I'd have to update in each session.

### Step 5. Purge Unnecessary Services

While I was updating services it was as good a time as any to delete any accounts which were idle. Using [Just Delete Me](http://backgroundchecks.org/justdeleteme/) sped the process up considerably. I think I'd cleared out 100 logins from my 1Password Vault by the end of the first week.

### Step 6. Export Email Data

If it's an old GMail account, you can use Google Takeout to download an archive of your mail. Other services vary, but the easiest way to grab an archive of your mail is to configure a desktop client, synchronise/download to your local computer, and then export from there. This is what I had to do with my Fastmail domains.

### Step 7. Tidy-up

We're in the final stretch now… with all the legwork out of the way, you'll want to: make sure you've updated any friends, family, and contacts who would have the old email account; update any profiles or web pages where you have the email address listed; remove the account from devices, and basically remove as many references to the address as you can.

### Step 8. Close the Email Account

This should be the obvious bit, but there might be some caveats… for example, with GMail you need to close the entire Google Account, taking any data in other Google services like YouTube with it. Some services make it harder than others to delete your account. If in doubt, check [Just Delete Me](http://backgroundchecks.org/justdeleteme/), or try a search for "delete account."
