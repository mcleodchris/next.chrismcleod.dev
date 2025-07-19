---
title: Bridge Your Fediverse Accounts to Bluesky with a Custom Domain Handle
date: 2025-01-19T13:57:33Z
tags:
  - social-media
  - mastodon
  - pixelfed
  - fediverse
  - bluesky
---

A few days ago I came across [a blog post that reminded me that I had intended to bridge my fediverse accounts](https://solarbird.net/blog/2025/01/09/lets-all-go-to-the-exit/) to Bluesky using Bridgy Fed. I tend to cross-post most "micro blog" text posts to both Mastodon and Bluesky anyway, but occaisionally I post something to one place or the other. Plus, I've just setup a Pixelfed account for photo sharing and it turns out you can bridge that in the exact same way.

The downside is the default bridged user handles are really long and unweildy, which makes them a pain to share. But after digging through [the Bridgy Fed documentation](https://fed.brid.gy/docs#bluesky-enhanced), it turns out you can still use [a custom domain handle for](https://bsky.social/about/blog/4-28-2023-domain-handle-tutorial) these bridged accounts, which makes them much easier to share. My fediverse accounts are now bridged as:

- [masto.chrismcleod.social](https://bsky.app/profile/masto.chrismcleod.social) for Mastodon posts
- [pixelfed.chrismcleod.social](https://bsky.app/profile/pixelfed.chrismcleod.social) for Pixelfed posts

Things you'll need, if you want to do this for your own accounts:

1. one or more fediverse accounts you want people on Bluesky to be able to interact with
2. you'll need a domain name you can use, and know how to create records for it

## Step 1. Bridge Your Account

This is the really easy bit: follow the account `@bsky.brid.gy@bsky.brid.gy` from the fediverse account you want to bridge. After a few seconds you should receive a private mention/DM from the account letting you know the bridge account has been created on Bluesky.

{% image "https://assets.chrismcleod.dev/chrismcleod.dev/assets/71432c05-ff6b-4bbe-bcfb-e5cc4d0410fc.png", "This image is a screenshot of a private mention from “Bridgy Fed for Bluesky,” informing the user that their account will soon be bridged to Bluesky. It includes a URL to the bridged profile and links to documentation and the user page for more information. The message also explains how to disable the bridge by blocking the account.", "", "(min-width: 55rem) 820px, 100vw", true, "320,570" %}

You'll see by default the account handle is something like `your-username.your-fedi-server.com.ap.brid.gy`, which is a bit long-winded! Don't worry, in the following steps we'll fix that.

## Step 2. Create the DNS Records for a Custom Domain Handle

Click the link to your Bridgy Fed user page in the message you just received. On the page that loads, click the 🏷️ icon:

{% image "https://assets.chrismcleod.dev/chrismcleod.dev/assets/61bd81d7-f6ee-4e7c-98ba-4a45bbc32598.png", "This image is a screenshot of a user profile page on Bridgy Fed. It displays the user’s name, handle (@chrisplusplus@social.lol), and associated Bluesky handle. There are buttons for “Profile” and “Notifications,” as well as links showing activity, followers, and following counts. The image highlights a tag icon. Links to “Docs,” “News,” “Code,” and “Issues” are present at the top." %}

This will copy the DID of the Bluesky account to the clipboard.

Next, load up what ever control panel you use to create DNS records for the domain you want to use. We're going to create a TXT record for the custom domain handle you want to use for the account, but prefixed with `_atproto.`. For example:

- If you want your custom handle to be the root domain `example.com`, you will create a record for `_atproto.example.com`.
- If you want to use a subdomain — e.g., `fedi.example.com`, you will create `_atproto.fedi.example.com`.

In my case, I wanted to use `masto.chrismcleod.social` as an account handle, so created `_atproto.masto.chrismcleod.social`.

The content of the TXT record is `did=<the did you copied from brid.gy>`

{% image "https://assets.chrismcleod.dev/chrismcleod.dev/assets/33cb2475-a12b-4554-930c-779f49ca3f3e.png", "This image is a screenshot of a DNS management interface showing the creation of a TXT record. The “VALUE” field contains a DID string (did=did:plc:x...), and the “HOSTNAME” field is set to _atproto.masto. The TTL (Time to Live) is set to 3600 seconds. The interface includes a button labeled “Create Record” for saving the entry." %}

Save the record. Depending on the vagaries of DNS, this record might take anywhere from a few seconds to several hours to start working. You can check if you're ready to proceed by using [Bluesky Debug](https://bsky-debug.app/handle) and checking the handle:

{% image "https://assets.chrismcleod.dev/chrismcleod.dev/assets/38c03cd5-9790-4a88-8184-6a2c0925ef47.png", "This image is a screenshot of the Bluesky Debug Page under the “Handles” section. The user has entered “masto.chrismcleod.social” in the input field and clicked “Debug handle.” A green notification bar at the bottom confirms that “masto.chrismcleod.social” passed verification via DNS. Links to “How to set your domain as your handle” and “Handle resolution docs” are also visible." %}

Once your handle is resolving, you can move on to the final step.

### A Quick Aside for Pixelfed accounts

Pixelfed DMs/private mentions don't seem to support links when I tested this out earlier. Once you've received the DM from Bridgy Fed, to get the DID to enter into the DNS record, you'll need to enter your Pixelfed account (e.g., `your-account@pixelfed.social`) on [this page](https://fed.brid.gy/user-page).

{% image "https://assets.chrismcleod.dev/chrismcleod.dev/assets/6d004745-d73b-489e-ac16-7b07b6300917.png", "This image is a screenshot of the Bridgy Fed interface. It prompts the user to “Enter your handle, user id, or website” in a text input field. The user has entered “chrismcleod.dev@pixelfed.social” in the field. There is an “OK” button next to the input field. Links to “Docs,” “News,” “Code,” and “Issues” are displayed at the top right." %}

This will load your user page and you can get your DID to proceed with creating your DNS record.

## Step 3. Update Bridgy Fed

Nearly there. Here comes the hardest step.

Reply to the DM/private mention from `@bsky.brid.gy@bsky.brid.gy` with a message containing `username <your new handle>`. For example, I sent:

```
username masto.chrismcleod.social
```

That's it! After a few seconds, Bridgy will reply to let you know it's been a success.

{% image "https://assets.chrismcleod.dev/chrismcleod.dev/assets/6234d3af-ae6c-470b-a19d-c716eb71adfb.png", "This image is a screenshot of a private mention conversation between Chris M. (@chrisplusplus) and “Bridgy Fed for Bluesky.” Chris M. requests to set their username to “masto.chrismcleod.social.” Bridgy Fed responds confirming that the username in Bluesky has been set to “masto.chrismcleod.social” and notes that it should appear soon.", "", "(min-width: 55rem) 820px, 100vw", true, "320,570" %}

And sure enough, after a few moments you should be able to see the update reflected on the Bluesky interface:

{% image "https://assets.chrismcleod.dev/chrismcleod.dev/assets/07328152-d534-4ba3-85b8-2f1b93a06e28.png", "This image is a screenshot of a user profile for “Chris M.” on Bluesky. The username “@masto.chrismcleod.social” is highlighted. The profile includes a description: “Online since before some of you were born. Tired. Lead Software Developer, but I’m not allowed to talk about it. He/him/his. Scotland.” It also mentions that the account is bridged from “social.lol/@chrisplusplus” on the Fediverse by “fed.brid.gy.” The profile shows 1 follower, 0 following, and 5 posts. A “Bridgy User” badge is visible.", "", "(min-width: 55rem) 820px, 100vw", true, "320,570" %}

Hopefully this short guide helps you get your own bridged accounts setup with easier to use custom handles.
