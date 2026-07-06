---
title: New Paint, Same Blog
date: 2025-02-04T22:16:40+00:00
id: 69f3c115-08a2-4e05-b34e-6bbaef0d4994
tags:
  - site-meta
atUri: "at://did:plc:fcewtyqycu5qlt26tnbnan6h/site.standard.document/3mpyyqdr2z22p"
---

I've been wanting to redo the theme of this site for a while. I had some specific ideas in mind, but no cohesive vision. Then I thought to myself - "why don't I base it on the editor theme I enjoy using so much and spend most of my day looking at?" Or something like that. And so, after a couple of evenings hacking away at the CSS, `https://chrismcleod.dev` has a new, fresh coat of paint.

{% image "https://assets.chrismcleod.dev/chrismcleod.dev/assets/6c2b0607-5fe5-4681-80be-3cf2e885596f.png", "A blog post with a navy blue background and light blue-white text in a monospace font. The title 'Sometimes, Whimsy is Enough' appears in a large, light blue-white font. At the top of the page, the navigation menu includes 'Blog' in pink/salmon, 'Paintslam' in brown/copper, 'Follow' in green, and 'About' in light blue, all on the dark navy background. The post is dated January 24, 2025 by Chris McLeod, whose name also appears in the header with a small abstract explosion icon" %}

The colour pallete is [Catppuccin](https://catppuccin.com). In light mode, the Latté style is used, and in dark mode, Machiatto. You can use the theme switcher in the footer to try them out, if you want. It's all made possible with CSS variables.

I knew I wanted to inject more colour across the site than I used previously, so I've made use of several in the predefined sets. Where there are UI items which repeat several times - the navbar link, tags in the archive, etc. - I cycle through the colours to approximate a rainbow. The code for this was surprisingly concise, using the `:nth-of-type()` selector:

```css
.button:nth-of-type(7n+1) {
  /* set red properties */
  --button-border: var(--color-red);
}

.button:nth-of-type(7n+2) {
  /* set orange properties. "peach" is the closest in Catppuccin */
  --button-border: var(--color-peach);
}

/* repeat for the rest… */

.button:nth-of-type(7n+7) {
  /* set violet properties. "mauve" is the closest in Catppuccin */
  --button-border: var(--color-mauve);
}
```

This will start with red, cycle to "violet" (classic ROY G BIV), then start repeating the pattern infinitely.

Fonts were another thing I had an idea for coming in. I was pretty sure I wanted to use a monospace font. I view myself as my blog's primary audience, so it made sense to optimise for my own reading preferences. Hopefully it works as well for others. The main body font is [iA Writer Duo, which is the editor font I use for writing Markdown files, while iA Writer Quattro is used for headings](https://github.com/iaolo/iA-Fonts). To provide some visual variation, code samples use [Cascadia Code](https://github.com/microsoft/cascadia-code), which is the main font I use in my editor.

Under the hood everything is still [Eleventy](https://www.11ty.dev), and the [Eleventy Excellent](https://eleventy-excellent.netlify.app) starter (it's still my lightly hacked v1 for now, rather than the latest v4). I enjoyed the layout and typography of Eleventy Excellent, and [Lene](https://www.lenesaile.com/en/) has built a great foundation to work off of, so I didn't feel the need to rip up the foundations. Pretty much all I've done is apply some new colours and move things around without changing much of anything in the HTML - which feels very much like how HTML and CSS _should_ work.