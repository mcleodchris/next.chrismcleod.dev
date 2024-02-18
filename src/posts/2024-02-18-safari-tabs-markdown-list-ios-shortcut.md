---
title: Generate a Markdown List of Open Safari Tabs with an iOS Shortcut
date: 2024-02-18T21:06Z
tags:
  - ios
  - automation
  - blogging-tools
---
I mentioned in [my last post](https://chrismcleod.dev/blog/open-tab-dump-mobile-edition-2024-02-18/) that I created an iOS Shortcut to automate turning the list of tabs I have open in Safari into a Markdown list. Ryan asked if I could share that shortcut. I was always intending to, so here it is for everyone to make use of:

[Get Open Tabs as Markdown](https://www.icloud.com/shortcuts/8eccd3f15ac34c67b0a98ca6dd38c1c7)

By way of explanation of what the shortcut does:

- Get a dictionary of all open tabs from Safari (this doesn't include Private Browsing or tabs in a "collection")
- Loop through the dictionary.
	- For each tab, format the page title and URL into the Markdown format for a link, prefixed with "- " to make it a list item.
- Combine the items in the returned dictionary into one blob of plain text, separated by new lines.
- Copy the resulting text to the clipboard.
- Open the Share Sheet, so you can "share" it to any app you choose.

You don't have to be in any particular app to run this Shortcut. You can run it standalone from the Home Screen, Shortcuts app, or add it as an action in the Share Sheet.