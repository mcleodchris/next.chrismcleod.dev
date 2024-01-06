---
title: "Misadventures with WP-CLI (or: Always Backup First)"
date: 2019-01-17
categories:
  - articles
  - notes
tags:
  - mistakes-were-made
  - wordpress
  - wp-cli
authors:
  - chris
archived: true
---

I had the need to change the status on several hundred wordpress posts by a particular author, from "publish" to "pending" (more on this in a future post). This would have taken me hours to do through the frontend, so I figured I'd make my first serious use of [WP-CLI](https://wp-cli.org/), and script the job.

You can [list posts using WP-CLI](https://developer.wordpress.org/cli/commands/post/list/), and specify which columns to display, and even pass in basic filters, like so `wp post list --<column>=value --fields=ID,post_title,post_status,post_author`. You can also [update posts](https://developer.wordpress.org/cli/commands/post/update/). By combining these with some shell scripting, big jobs can be done fairly easily.

Easily. Oh, the hubris. The problem I ran into was:

- The display column names are the names of the columns in the database, so to list the post author, you would refer to it as post_author.
- The _filter_ column names are as they are referred to in [WP_Query](https://codex.wordpress.org/Class_Reference/WP_Query), _not_ how they are named in the database.

I didn't catch on to this distinction at first, and the number of rows I was returning was large enough it couldn't display all of them in the terminal. Yes, I should have used `less` to check. I should have done a lot of things, like take a backup first (`wp db export ~/export.sql`), but that wouldn't be as good a cautionary tale.

Long story short, I ran `wp post list --post_author=3 --fields=ID,post_title,post_status,post_author`, saw only the results I expected because some rows were cut-off. When I fed this into a loop which would update the post_status, I ended up setting _every_ post as pending.

```
wp post list --post_author=3 --format=ids \
| xargs -d ' ' -I % wp post update % --post_status=pending
```

The **correct** command should have been

```
wp post list --author=3 --format=ids \
| xargs -d ' ' -I % wp post update % --post_status=pending
```

Thankfully, having realised my mistake, I could make use of WP-CLI to fix it:

```
wp post list --author=2 --format=ids \
| xargs -d ' ' -I % wp post update % --post_status=publish
```

For everyone following along at home, my mistakes so-far were:

- Not reading the documentation fully
- Not taking a backup before altering a live site
- Not double-checking my test results before running the command "for real"

I've returned all of the wrongly-pended posts to "publish" status. I do still have an issue with Post-Kinds data being missing on most of these posts; I think this is due to some wierd interaction between WP-CLI and the plugin, but I can't be sure. These posts (~60) I'm going to have to fix by hand -- I consider it a reprimand for my earlier flippant approach!

Cross-posted to [/en/wordpress](https://indieweb.xyz/en/wordpress).
