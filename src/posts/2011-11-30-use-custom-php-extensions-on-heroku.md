---
title: "Use Custom PHP Extensions on Heroku"
date: 2011-11-30
categories:
  - articles
  - code-development
tags:
  - cloud-computing
  - documentation
  - heroku
  - mongodb
  - pecl
  - php
  - programming
authors:
  - chris
archived: true
---

Did you know you can use custom PHP extensions on Heroku? Neither did I, cos I can't find it in [the documentation](http://devcenter.heroku.com/ "Heroku Dev Center"). But you can:

[https://gist.github.com/1288447](https://gist.github.com/1288447)

I came across this while searching for a way or workaround to use the MongoDB PECL extension on Heroku (don't get me started on that...).

If you can't be bothered checking the link, the summary is this:

1. Create a folder in your app called 'ext' or similar.
2. Copy your extension into this folder.
3. Create a php.ini file with the following contents:

   extension_dir = "/app/www/ext/"
   extension=mongo.so

4. Deploy
