---
title: "Run Coder for Raspberry Pi on Your Linux PC"
date: 2013-09-13
categories:
  - code-development
tags:
  - coder
  - linux
  - programming
  - javascript
  - raspberry-pi
  - software
  - how-to
authors:
  - chris
archived: true
---

That cool little "[Coder for Raspberry Pi](http://googlecreativelab.github.io/coder/)" project from Google [which I linked to earlier](/blog/coder-a-simple-way-to-make-web-stuff-on-raspberry-pi/ "Coder: A simple way to make web stuff on Raspberry Pi.") doesn't just run on Raspberry Pi. You can run it on any old Linux PC (Mac works too, but the instructions are slightly different).

I set it up in less than 2 minutes using these commands (note that I'm running [Debian Sid](http://www.debian.org "Debian")):

sudo useradd -M pi
sudo apt-get install redis-server
cd ~/projects
git clone https://github.com/googlecreativelab/coder.git
cd coder/coder-base
npm install
npm start

[Node.js](http://nodejs.org/ "Node.js") is also a requirement, so if you don't have that, you'll need to install that at step 2 as well.

Once everything is up and running, point your browser at [https://localhost:8081/](https://localhost:8081/). You'll need to specify a password the first time you run Coder, after which you'll be able to try the environment out. It's pretty neat, and the sample clone of [Asteroids](http://en.wikipedia.org/wiki/Asteroids_%28video_game%29 "Asteroids (video game)") is quite addictive!
