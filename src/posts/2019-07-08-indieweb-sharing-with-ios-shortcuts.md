---
title: "IndieWeb Sharing with iOS Shortcuts"
date: 2019-07-08
categories:
  - articles
tags:
  - howto
  - indieweb
  - ios
  - shortcuts
authors:
  - chris
archived: true
---

I [mentioned last week](/blog/8716/) I had setup iOS Shortcuts to post Likes, Reposts, and Bookmarks to my website, and automatically syndicate those posts to Twitter. This solved a particular pain point in my “workflow,” where I’d share something to my website with Indigenous, but then have to go in to the WordPress editor through a browser to get the post to share back to Twitter. This was enough of a pain I avoided it where possible. With the new shortcuts I don’t have to worry about that. A couple of taps, and everything “Just Works”(tm).

[Video Link](https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/10/20190708_3E612010-62C8-4897-8738-F3062EA71E9E.mp4)

This post is an attempt to document how I have my shortcuts setup, so you can make some of your own. I’ve tried to keep things as jargon free as possible, but the instructions do assume the following:

- you have a website of your own,
- that website has a [Micropub](https://indieweb.org/Micropub)\-compatible endpoint, such as self-hosted [WordPress](https://indieweb.org/WordPress) with the [Micropub plugin](https://indieweb.org/Micropub_for_WordPress),
- your iPhone or iPad is running iOS 12 or above,
- optionally, your website can syndicate to other sites through Micropub syndication target. WordPress users can use the [Syndication Links plugin](https://indieweb.org/Syndication_Links).

My own setup uses WordPress with all of the [IndieWeb plugin pack](https://indieweb.org/WordPress/Plugins), so that is what this guide has been tested with, but everything here should be universal to any Micropub server. To get started, you will first need to install a pre-requisite shortcut.

## Install the IndieAuth Shortcut.

This is the foundation for the other shortcuts. With out this, your shortcuts cant authenticate with your site. [It can be found here](https://www.icloud.com/shortcuts/bc66e95b305f462caa971feeeaa8ef4c), with some more notes found on this [IndieWeb wiki page about Shortcuts](https://indieweb.org/Shortcuts). While installing it, you can configure it with the URL of your site and run through the authentication process to get a token, or enter a pre-existing token. Alternatively, if you already have a valid token from somewhere, you can enter that into the shortcut for it to use.

### Note for WordPress users.

I ran into an issue with the IndieAuth shortcut, where WordPress didn’t interpret the authentication scopes properly, meaning the generated token wouldn’t work. I didn't spend much time debugging this, so I don’t know if the issue is in the plugin or how Shortcuts sends the request. Thankfully, there’s a workaround. Go to your WordPress admin area > Users > Manage Tokens. At the bottom of the screen will be a form where you can generate an appropriate token. You'll want to select at least the "create" scope. Do this, then copy and paste the token code in to the text field at the top of the shortcut, like this:

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/07/92B0CE26-F4E1-4098-AED2-331EE82AA370.jpeg", "alt temporarily text not available" %}

With our authentication mechanism setup, it's time to build the shortcut proper.

## Building the Shortcut.

### Initial Setup.

In the Shortcuts app, create a new shortcut. The first thing we need is a “Get URLs from Input” block, then a “Set Variable” block. Name the variable something memorable, as we’ll be using it in a couple of places. I called mine “repost” in my Retweet shortcut.

Next, add a “Run Shortcut” block, and another “Set Variable” block after it. The shortcut block should be set to run your IndieAuth shortcut, and you can turn off “Show While Running”. Set the variable name to “token.” Once done, you should have something like this:

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/07/FE42D253-DB11-4218-8554-EEE3D04C221B.png", "alt temporarily text not available" %}

### Posting to Your Site.

This is “where the magic happens.” In broad terms, the next few blocks will:

1. Be configured with the Micropub endpoint of your site,
2. Craft a POST request to your endpoint, with the following pieces of information:  
   3. Your authentication token 4. The type of Micropub post we’re creating (“entry”) 5. The URL we’re sharing, as a “repost-of”, “like-of”, or whatever 6. Set a syndication target.

With these steps in mind, onward we go!

Add a URL block to your site. Enter the URL of your Micropub endpoint. If you’re not sure exactly what this is, check the source of your site. Look for a `link` tag with `rel=“micropub”`. Alternatively, I've written another shortcut which will try to detect an endpoint for a given domain. [You can find it here](https://www.icloud.com/shortcuts/342c3fc7625f45bfb94829ca1905f649). Note that I've not tested this shortcut on any device but my own, so there may be bugs. The Get Endpoint shortcut will check if the endpoint variable is set, and if not, ask for a domain to parse for the endpoint. Once parsed, the endpoint URL will be copied to the device clipboard for pasting elsewhere, and return a URL.

Back in the sharing shortcut, add a “Get Contents of URL” block. Tap on “Advanced,” then set the Method to POST. Tap on “Headers.” Add a header called “authorization” (note the US spelling, if you’re using a UK keyboard or similar). Set the value of this header to "Bearer " - with the space at the end - then insert the **token** variable created earlier.

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/07/A5783979-4B7C-4DE6-A8FF-9FA6427F7F93.jpeg", "alt temporarily text not available" %}

Next, in the Request Body section, set it to Form. If you’re replicating my setup, add three new fields: **h**, **repost-of** (or **like-of**, etc.), and **mp-syndicate-to**. Set the value of **h** to **entry**. Set **repost-of** to the variable you created from your input URL, right back at the start.

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/07/C20F14E7-A582-4185-9557-3FDAB99F3AE1.jpeg", "alt temporarily text not available" %}

Finally, set **mp-syndicate-to** to the UID of the syndication target you want to share to. In my WordPress setup, this is **twitter-bridgy**. Your system may vary, if you’re not using WordPress + the Syndication Links plugin. If you're not sure what your UID might be, you can try running [another shortcut I've created](https://www.icloud.com/shortcuts/5eb347a757344a7d9c056f90ac49c15e), which will query your site to find all the places you can syndicate to. The shortcut requires the "Get Endpoint" shortcut linked above, and will return text listing all UIDs configured for your site. As an example, the output for me looks like this:

```json
{"name":"XYZ IndieWeb","uid":"xyz-indieweb"}
{"name":"XYZ Linking","uid":"xyz-linking"}
{"name":"IndieNews En","uid":"indienews-en"}
{"name":"XYZ Books","uid":"xyz-books"}
{"name":"Twitter via Bridgy","uid":"twitter-bridgy"}
{"name":"Github via Bridgy","uid":"github-bridgy"}
```

If you don’t want to syndicate your post, remove the **mp-syndicate-to** field entirely - don’t just leave it blank, or you might run into issues.

Once all fields in your Like/Repost shortcut have been filled in, you should have something like this:

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/07/3E346254-D769-48C2-BE58-0AFF2767ECAB.png", "alt temporarily text not available" %}

You can leave things here, if you want, or you can add something like a Notification block to show you the returned response from your site, for debugging purposes. Unfortunately, the current limitations of Shortcuts mean we can’t get the URL to our new post from the results. Maybe that will change in iOS 13.

Set your new shortcut with an appropriate name and icon. Turn on the option "Show in Share Sheet," and optionally set the "Accepted Types" to "URLs." Tap Done a couple of times, and your shortcut should be complete! The best bit is, you can duplicate the shortcut, change `repost-of` to `like-of` (or viceversa), and you'll have a working Like shortcut too 😃

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/07/3D90DF16-D180-480A-9F22-28CD7781552F.jpeg", "alt temporarily text not available" %}

Now, you can use the iOS share sheet for any URL to run your shortcut. Tap the share icon, tap Shortcuts, then tap the relevant shortcut from the list.

As a bonus, here's a couple of short clips of the Like shortcut in action:

[Video Link](https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/07/20190708_6A9C762D-BCE8-467A-A371-9CD470715D05.mp4)

[Video Link](https://assets.chrism.cloud/chrismcleod.dev/assets/images/2019/07/20190708_7A05E1B9-7E93-4992-BCCC-6250AC06029B.mp4)

If you run into any issues getting the shortcut created, please do let me know through a comment or Webmention, and I'll try to help where I can.
