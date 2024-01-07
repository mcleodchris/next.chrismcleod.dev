---
title: 'Adding Site Search to Eleventy with <pagefind-search>'
date: 2024-01-07T15:27Z
tags:
  - site-meta
  - blogging
  - blogging-tools
  - how-to
  - eleventy
permalink: '/blog/adding-site-search-eleventy-pagefind-web-component'
gradient: true
---

I recently added some new ways to dig through the [archives of this site](/blog/), and chief among them was search. Search is something I've wanted to add for ages, and thankfully it was pretty straightforward, thanks to [Pagefind](https://pagefind.app/) and the [\<pagefind-search\> web component by Zach Leatherman](https://www.zachleat.com/web/pagefind-search/).

## Installation
Installing the component starts with adding it to our `package.json` as a regular dependency (_not_ a DevDependency as you might be used to for Eleventy):

```bash
npm install --save @zachleat/pagefind-search
```

With the package added, we need to add a reference to it into a JavaScript file referenced in our site/page HTML. The specifics of how you do this will vary depending on your setup/bundling process. For me, as I am using [Eleventy Excellent](https://eleventy-excellent.netlify.app/) for the basis of my site, the easiest way for me to do do this was to add an import to the top of `assets/scripts/app.js`:

```js
import '@zachleat/pagefind-search';
/* ... rest of existing file contents ... */
```

With that out of the way, we can add the component to which ever page or template you want to use it in. For me, this was my [archive Nunjucks file](https://github.com/mcleodchris/next.chrismcleod.dev/blob/develop/src/_layouts/archive.njk), with the additions looking like so:

```html
<h2>Search</h2>
<pagefind-search pagefind-autofocus>
  <form action="https://duckduckgo.com/" method="get" style="min-height: 3.2em;"><!-- min-height to reduce CLS -->
	<label>
	  Search for:
	  <input type="search" name="q" autocomplete="off" autofocus>
	</label>
	<!-- Put your searchable domain here -->
	<input type="hidden" name="sites" value="chrismcleod.dev">
	<button type="submit" class="button">Search</button>
  </form>
</pagefind-search>
```

This is more-or-less a copy of Zach's [example usage](https://www.zachleat.com/web/pagefind-search/#usage). The only difference is I've added the `pagefind-autofocus` attribute and changed the fallback content to reference my domain. There are [other attributes](https://github.com/zachleat/pagefind-search/#extend-pagefind-options) you can play with to customise the component further.

With these steps done, we're nearly ready, but the search will not work until we generate the Pagefind bundle and index our site.

## Indexing our site
Run your regular build command for your site, to generate the static files to be indexed. Indexing requires running another command:

```bash
npx -y pagefind --site dist
```

The `--site` option should point to the output directory of your build process. For me, that's the `dist` directory. Pagefind will go off and do it's thing, then report back what it's indexed. The end of the output will look something like this:

```bash
[Building search indexes]
Total: 
  Indexed 1 language
  Indexed 520 pages
  Indexed 10092 words
  Indexed 0 filters
  Indexed 0 sorts

Finished in 4.393 seconds
```

Everything should be generated now, you can go ahead and serve your site locally to try it out!

If you want to customise the Pagefind index, you should refer to [the documentation](https://pagefind.app/docs/indexing/). Personally, I've added a couple of [attributes](https://pagefind.app/docs/indexing/#removing-individual-elements-from-the-index) to my templates to indicate what should or shouldn't be indexed.

This is all great so far, but we should automate things so the index is generated on every build - especially if we use any sort of automated process to build and deploy our site. To do this, you'll need to modify whatever command you use to build your site. For me, I modified the scripts section of my `package.json` to this (I've omitted irrelevant lines, for clarity):

```json
"scripts": {
    "clean": "rimraf dist",
    "build": "ELEVENTY_PRODUCTION=true run-s clean build:*",
    "build:11ty": "eleventy",
    "build:index": "npx -y pagefind --site dist",
  },
```

The `build` entry is the one used by Netlify when it generates and deploys my site from any updates checked into GitHub. The important bit that changed here, from what it was before, is the addition of `build:index`. This adds the step to the build process which indexes the site.

## Customising the display (Optional)
Pagefind comes with its' own UI CSS, which the \<pagefind-search\> component loads when initialising. The defaults are perfectly acceptable - they work well, and look good. They did unfortunately stick out a bit as "wrong" when I initially added the component, so I wanted to make some adjustments.

It took me a while to figure out how to get the results to display in a way that was more like the rest of my site - namely the typography and element spacing. It's far from perfect, and I want to do some more work on this, but the following should help you customise things a bit to your liking.

The main issue you'll face is the Pagefind stylesheet will probably load after your main site stylesheets - so if you, say, [follow the documentation and override the styling using CSS variables](https://pagefind.app/docs/ui-usage/#customising-the-styles), the default stylesheet will override this. Thankfully, we can use the cascade and specificity to make our overrides take effect.

As mentioned, I use Eleventy Excellent, which uses some build tools to bundle up multiple CSS files into one. To keep things organised I added a new `search.css` file in the `src/assets/css/blocks` directory ([link](https://github.com/mcleodchris/next.chrismcleod.dev/blob/develop/src/assets/css/blocks/search.css)).  Your site will probably differ in the specifics - you should add any CSS in the same way you normally would.

```css
/* src/assets/css/blocks/search.css */
.pagefind-ui{
    margin-block-start: var(--flow-space,1em);
    --pagefind-ui-scale: 1.2;
    --pagefind-ui-primary: var(--color-fg);
    --pagefind-ui-text: var(--color-fg);
    --pagefind-ui-background: var(--color-bg);
    --pagefind-ui-border: var(--color-fg);
    --pagefind-ui-tag: var(--color-primary);
    --pagefind-ui-border-width: 2px;
    --pagefind-ui-border-radius: var(--border-radius);
    --pagefind-ui-image-border-radius: var(--border-radius);
    --pagefind-ui-image-box-ratio: 3 / 2;
    --pagefind-ui-font: var(--font-base);
}
.pagefind-ui__result {
    --pagefind-ui-border: #eeeeee;
  }
.pagefind-ui__button {
    --pagefind-ui-primary: var(--color-fg);
    --pagefind-ui-background: var(--color-bg);
    margin-block-start: var(--space-s-m);
}
.pagefind-ui__button:hover {
    --pagefind-ui-primary: var(--color-bg);
    --pagefind-ui-background: var(--color-fg);
}

.pagefind-ui__search-input:focus-visible {
  outline: 2px solid var(--color-primary);
}
```

The important bit to begin with is the `.pagefind-ui` rule declaration. This is where we define the new generic values for the PageFind variables, and define any properties which aren't already set. If you want to override properties which *are* set (and aren't influenced by the variables), you'll need to get more into the weeds I'm afraid - which is outside the scope of this post. Maybe later, once I've revisited this topic.

The reason this works is that the default PageFind variables are set on the `:root` pseudo-element, which is less specific than `.pagefind-ui`. In my case I set the values to variables set by Eleventy Excellent's own stylesheet, which lets the colours follow my implementation of Dark Mode.

From here, it's a case of finding the class for the right elements you want to modify, and overriding the variables or adding new properties. For me, this was adjusting the border between results, and making the "load more results" button more like the other buttons on my site. One thing to remember: any variables you don't override will use the defaults - so if you're happy with everything but the font, for example, you can set the value of `--pagefind-ui-font` in `.pagefind-ui`, and leave it at that.