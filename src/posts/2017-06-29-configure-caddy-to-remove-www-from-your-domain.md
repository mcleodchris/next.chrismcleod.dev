---
title: "Configure Caddy to Remove WWW from your Domain"
date: 2017-06-29
categories:
  - articles
  - notes
authors:
  - chris
archived: true
tags:
  - servers
  - how-to
---

For various reasons I prefer to remove the www part from my personal-use domains. Setting up [Caddy](https://caddyserver.com/) to serve the site from just `domain.com` is as simple as:

```text
domain.com {
    root /path/to/site/files
    # other directives
}
```

But this set-up doesn’t provide any way to redirect from www to non-www, meaning anyone who types `www.domain.com` into the address bar is out of luck. So what to do? Well, Caddy provides a [redir](https://caddyserver.com/docs/redir/) directive. Combine with a new site directive and a [placeholder](https://caddyserver.com/docs/placeholders) like this:

```text
# Original non-WWW site:
domain.com {
    root /path/to/site/files
    # other directives
}
# New, additional "site", for doing the redir
www.domain.com {
    redir domain.com{uri}
}
```
