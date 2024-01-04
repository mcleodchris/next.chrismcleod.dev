---
title: "About Elastic Layouts"
date: 2005-05-25
categories:
  - articles
  - code-development
tags:
  - css
  - browsers
  - web-design
  - how-to
authors:
  - chris
archived: true
---

**Elastic layouts** have been getting a bit of talk over the last few months. [John](http://web.archive.org/web/20060223182850/http://joshuaink.com/blog/282/elastic-fantastic), [Roger](http://www.456bereastreet.com/archive/200504/fixed_or_fluid_width_elastic/) and [Patrick](http://www.alistapart.com/articles/elastic/) have all talked about them. I use an elastic layout in the new design.

### What is an Elastic Layout?

Traditionally, web designers talk about either “fluid” or “fixed” layouts. Fluid layouts change width with the size of the browser window, while fixed layouts are set to a specific width. There are arguments for and against each type. Where elastic layouts fit in, is to try and combine the best of both worlds.

### The Theory.

Text sized in `em` units is scalable in browsers (theoretically). So what if we were to specify the widths of our page elements in `ems`? Our page elements *should* scale inline with the size of our text.

### The Reality.

Using `em` units to size page elements does work pretty much as expected. However, there are a few things we need to do to avoid some problems.

#### Global Reset for Less Hair-Pulling

If you let the browser apply its default `font-size`, `margin`, `padding` and `line-height`, you’ll be in for a very rough ride. Make things easy – apply the global reset:

`*{ font-size: 100%; line-height: 1; margin: 0; padding: 0;} /* Global Reset */`

This resizes the text on *everything* to 100% of the default size (16px by default), sets the height of a line to the size of the text, and removes any default margins or padding. By doing this, we remove a lot of the guess work. I use a percentage value because I’ve found that this makes scaling text a little less error prone in browsers. 1em is now equal to 100% or 16px.

#### Browsers are Crap at Maths.

All the major browsers suffer from rounding errors to some degree. I must admit that it’s been a while since I checked on this, but both Opera and Safari used to render text sized in ems and percentages wrong – 10px would render as 9px, for example. To get around this, the fix was to size text *slightly* larger than 100% on the top level element. 100.01% was found to be the magic number. So our global reset becomes:

`*{ font-size: 100.01%; line-height: 1; margin: 0; padding: 0;} /* Global Reset */`

#### Make the Maths Easier.

I was never very good at maths (much like the browsers), so working things out in multiples/fractions of 16px wasn’t appealing. It’s also harder to visualise how big 16px is, compared to, say, 10px. So to make things easier to work out and visualise, we reduce our base font size down to 10px (using percentages, this is 62.5%). We can apply this to the `html` element and it will inherit down the line:

`html{ font-size: 62.5%; } /*Resize text to 10px */`

1em is now equal to 10px. Much better!

#### Make *Everything* an EM.

Well, almost. I’ve found that some browsers (the Gecko ones, mostly), will not render a 0.1em thick border, when 1em = 10px. Any border you want to be equivalent to 1px by default, just make it 1px – it might not scale but it *will* render. Other than this small caveat, the rest should be sized in `em` units: margins, paddings, widths, font-sizes… Doing so will make everything proportional to the text size, stopping things looking crowded at larger sizes.

#### Remember – EM Sizes Compound!

By that, I mean that if you apply a font size of 1.2em to the `body` tag in our example, then for all elements contained in the `body`, 1em now equals 12px. So a 3em `h1` would be 36px high, not 30px like you might have expected. It’s something you need to be on the lookout for.

### A Note About Background Images

Elastic design is geared towards using repeating background images. Unless it’s something like the “Latest Little Thing” icon on the homepage, using non-repeating images will land you with holes in your design where the container is wider than the image. A great example of using repeating background images in elastic layouts is the [Elastic Lawn](http://www.csszengarden.com/?cssfile=/063/063.css&page=0) CSS Zen Garden entry.

### Give it a Try

With all this talk about maths, compounds, et al, I’ve probably put you off elastic layouts. Don’t be afraid to try them. Once you get in the swing of things, it soon becomes second nature. Practice does make perfect, so all I can say is have a go!
