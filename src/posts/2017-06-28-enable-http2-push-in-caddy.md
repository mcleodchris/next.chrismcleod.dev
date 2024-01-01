---
title: "Enable HTTP/2 Push in Caddy"
date: 2017-06-28
categories:
  - articles
  - notes
authors:
  - chris
archived: true
---

It's super simple. Just include a `push` directive in your site definition. You can leave it as just that, and Caddy will use any [Link HTTP headers](https://www.w3.org/wiki/LinkHeader) to figure it out.

If you want more control, you can expand the directive and specify both the path and associated resources, like so:

```
example.com {
    root /var/www/example
    push / {
        /assets/css/site.min.css
        /assets/img/logo.png
        /assets/js/site.min.js
    }
}
```

What this block does is say "for every request with a _base of /_ (i.e. _every_ request), Push the following 3 files." You can customise the base path if you want to, and add more files if you need, but a block like the one above is what I'm using for this site.

You can find out full details [in the Caddy Push documentation](https://caddyserver.com/docs/push).
