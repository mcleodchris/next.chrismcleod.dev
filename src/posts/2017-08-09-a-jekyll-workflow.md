---
title: "A Jekyll Workflow"
date: 2017-08-09
categories:
  - articles
  - notes
authors:
  - chris
archived: true
tags:
  - jekyll
  - blogging
  - how-to
---

### 1\. Sublime Text (Portable) + Plugins

By using [Sublime Text](http://www.sublimetext.com/) with the [Sublime Jekyll](http://23maverick23.github.io/sublime-jekyll/) and [Git](https://travis-ci.org/kemayo/sublime-text-git) plugins allows me to write and publish posts from within a single app. By-and-large, Sublime is the "Admin UI" for this website.

I tried using other editors, but I just couldn't get them to work the way I wanted them to work. Your mileage may vary though, so if you don't feel Sublime is still worth the license fee, [Visual Studio Code](https://code.visualstudio.com/) is good.

Using the portable version of Sublime lets me drop it into a USB stick/Dropbox/whatever and take my settings with me. 99% of the time this works seamlessly, but now and then I'll run into an environment issue breaking the link between Git and Sublime. This isn't that big of an issue though -- I just open up a terminal session for all of the Git commands instead.

### 2\. Setup Some Templates

Sublime Jekyll gives a lot of [handy commands](https://sublime-jekyll.readthedocs.io/en/latest/commands.html) for quickly working with Jekyll -- `ctrl-shift-p jnp` to start a new post was my most used for quite some time. But manually typing in all of the front matter except the title was a PITA. I use front matter for controlling the "style" of different post-types on the front page, so it is important to my setup. Then I found out about the ability to create [templates](https://sublime-jekyll.readthedocs.io/en/latest/templates.html), which speeded things up considerably.

To use templates, create a `_templates` folder in your Jekyll site. Create one or more markdown files in there to correspond to your various front matter defaults. `$n` can be used to set tab-stops. For example, here are my "Post" and "Link" templates respectively:

```yaml
---
layout: post
title:
date: $1
---
```

```yaml
---
layout: link
title:
date: $1
link_title: $2
link: $3
---
```

Note the tab-stop marker on `date` which lets me quickly insert the full, formatted, date and time using a Sublime Jekyll command

### 3\. Git, plus a Commit Hook

I can't always install Ruby + Jekyll on the environment I'm working on, so I offload the compilation of the site to the web server itself. To automate things, I manage the source files with Git, push changes to a repository on the server, and a commit hook fires whenever the server receives an update.

If you followed my post on [setting up a blog with Caddy and Jekyll][g], you might already have this setup. If not, the details can be found in [this guide on Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-deploy-jekyll-blogs-with-git), which I linked to from there.

[g]:/blog/start-a-blog-with-caddy-and-jekyll

### 4\. Write

This bit I'm still working on improving my efficiency at…
