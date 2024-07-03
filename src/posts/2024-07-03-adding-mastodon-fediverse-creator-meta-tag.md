---
title: Adding the New Mastodon Link Attribution Meta Tag
date: 2024-07-03T12:04Z
tags:
  - site-meta
  - mastodon
  - fediverse
---

I just added[^1] the [new Mastodon/Fediverse link attribution meta tag](https://blog.joinmastodon.org/2024/07/highlighting-journalism-on-mastodon/) to this site, partly because I think it's a neat idea, but also because it took ~2 minutes to do and I'm all for quick wins at the moment.

Adding the tag is straightforward, if you're familiar with HTML. Put the following in the `<head>...</head>` section of your web page HTML, replacing the value of `content` with your @-able profile name:

```html
<meta name="fediverse:creator" content="@yourprofile@yourmastodon.server" />
```

So mine would be:

```html
<meta name="fediverse:creator" content="@chrisplusplus@social.lol" />
```

Most people can stop there. Because I wanted to pull the value from a config file and output it in my Eleventy templates, I had _slightly_ more work to do. Just in case I switch instances again. I changed my `_data/meta.js` to include:

```js
  meta_data: {
    // other stuff removed for clarity...
    fediverseCreator: '@chrisplusplus@social.lol'
  }
```

And added the following to my `meta-info.njk` template partial:

```nunjucks
{% raw %}
{% if meta.meta_data.fediverseCreator %}
<meta name="fediverse:creator" content="{{ meta.meta_data.fediverseCreator }}" />
{% endif %}
{% endraw %}
```

And that was it. Done!

[^1]: Truth be told, I added the tag a while back, but I needed to update the value once it was "official" because an earlier example excluded the leading `@` from the profile name, so I had to add that in.