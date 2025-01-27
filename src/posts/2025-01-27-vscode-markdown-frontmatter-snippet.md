---
title: Visual Studio Code Snippet for Markdown Frontmatter
date: 2025-01-27T14:40:16+00:00
id: dd31b3bf-93c8-4d91-85f3-0f59dce4466f
tags:
  - markdown
  - vscode
  - eleventy
---

I can't believe it's taken me this long to setup, but I _finally_ added a snippet to VSCode for inserting Frontmatter into a Markdown file - handy for e.g, adding a new post to an [Eleventy](https://11ty.dev)-powered blog.

To add a snippet, press `Ctrl-Shift-P` or `F1`, then select "Configure Snippetts". Decide where you want to create the snippit - it can be at the project-level, language-level, or global. I chose language, so selected Markdown. Next, define your snippet in the JSON file. For me, this was:

```json
{
	"post frontmatter": {
		"prefix": "fm",
		"body": [
			"---",
			"title: $1",
			"date: $CURRENT_YEAR-$CURRENT_MONTH-${CURRENT_DATE}T$CURRENT_HOUR:$CURRENT_MINUTE:$CURRENT_SECOND$CURRENT_TIMEZONE_OFFSET",
			"id: $UUID",
			"tags:",
			"  - $2",
			"---",
			"$0"
		],
		"description": "Post frontmatter"
	}
}
```

What this does, is generate some frontmatter data whenever I type `fm` in a markdown document and then `tab` to insert the snippet. It automatically adds the current date and time, and puts the cursor at the first tab-stop, ready to type my title. Pressing `tab` again puts the cursor to the tags field, and a final `tab` puts the cursor into the document body, ready to write. To use this post as an example, the output will be something like:

```markdown
---
title: Visual Studio Code Snippet for Markdown Frontmatter
date: 2025-01-27T14:40:16+00:00
id: dd31b3bf-93c8-4d91-85f3-0f59dce4466f
tags:
  - markdown
  - vscode
  - eleventy
---

```

You can read more about VSCode snippets and what you can do with them in [the official docs](https://code.visualstudio.com/docs/editor/userdefinedsnippets). There were a lot more built-in variables than I realised, which has let me uninstall 2 extensions already.

---

If you're wondering what the `id` field in the frontmatter is for: I've been loosely tracking the conversation around what makes a good identifier in a feed. [Evan kicked it off](https://darthmall.net/2025/on-the-importance-of-stable-ids/), then Bob [continued it on](https://www.bobmonsour.com/til/much-more-to-come-on-rss-entry-ids/). Even though I haven't made any changes to my feeds yet, I didn't see any harm in pre-emptively adding the data, in case I do. However, Evan noted this:

> … the ID does have to be a URI, so you can’t — as I initially planned to do — just chuck a UUID in there and call it a day …

Not to get all "well, ackchyually…", _but you kinda can_. It just needs to use the `urn:uuid` URI scheme like so: `urn:uuid:dd31b3bf-93c8-4d91-85f3-0f59dce4466f`. This is something I learned about on The Underground[^1], when several people helpfully reached out to tell me about it. [You can see it in the validator](https://validator.w3.org/feed/check.cgi?url=https%3A%2F%2Ftheunderground.blog%2Ffeed-uuid.xml). Evan has decided to use the tag scheme for his blog, so it's maybe a moot point, but I wanted to mention it in case it helps others.

[^1]: Yes, I am _painfully_ aware I haven't written there in a very long time. No, I don't know when that might change.