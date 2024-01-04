---
title: 'Fixing create-react-app'
date: 2021-12-17
categories:
  - projects
  - work
tags:
  - tip
  - react
  - programming
  - linux
authors:
  - chris
redirectFrom: ['/2021/12/17/fixing-create-react-app/']
---

I ran into an issue last night where I couldn't generate a new React application template using `npx create-react-app my-app`. Annoyingly, this was only broken in the WSL environment of my personal PC, where it had been a while since I'd had to use the command. On Windows, where I'd never run the command before, it worked fine. The error I received was:

You are running create-react-app 4.0.2, which is behind the latest release (5.0.0).  
We no longer support global installation of Create React App.

This was odd, as I'd never globally installed create-react-app. Never the less, I followed the error's suggested fix of running `npm uninstall -g create-react-app`. Unsurprisingly, it didn't work. What followed was an hour of trying various other "fixes" from around the internet - update NPM/clear the NPM cache/update NPX… none of which worked for me.

In the end I resorted to fixing the issue through brute force - finding wherever this mystery instance of create-react-app was lurking and purging it from my system with good old `rm`. Using a combination of `find` and `rm` I found 2 places containing binaries. Removing these directly didn't fix the problem either, but working my way further up the diectory tree to their common parent directory did.

As it turns out, I'd accidentally stumbled on the NPX cache, which is kept hidden away from the usual NPM cache. Mine was in a slightly odd place because I use NVM to manage my NodeJS versions, but you can find yours using `npm config get cache`, then looking for an \_npx directory within the returned path. Delete the contents in there, and `npx create-react-app my-app` should start working again.

Or, to make it really easy, run `npx clear-npx-cache`.
