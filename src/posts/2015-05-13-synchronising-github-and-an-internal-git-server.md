---
title: "Synchronising GitHub and an Internal Git server"
date: 2015-05-13
categories:
  - articles
  - code-development
tags:
  - code
  - collaboration
  - development
  - git
  - github
  - scm
authors:
  - chris
archived: true
---

**Note:** I found this mini How-To while having a clean-up of [my GitHub repositories](https://github.com/chrismcabz/). I figured it would be worth sharing on my blog. Hopefully it is of use to someone. Warning: bad ASCII art ahead!

---

### The Problem

1. I have my repository hosted on GitHub
2. I have an internal Git server used for deployments
3. I want to keep these synchronised using my normal workflow

### Getting Started

Both methods I'll describe need a "bare" version of the GitHub repository on your internal server. This worked best for me:

cd ~/projects/repo-sync-test/
scp -r .git user@internalserver:/path/to/sync.git

Here, I'm changing to my local working directory, then using `scp` to copy the .git folder to the internal server over `ssh`.

More information and examples this can be found in the online Git Book:

[4.2 Git on the Server - Getting Git on a Server](http://git-scm.com/book/en/Git-on-the-Server-Getting-Git-on-a-Server)

Once the internal server version of the repository is ready, we can begin!

### The Easy, Safe, But Manual Method:

+---------+ +----------+ /------>
| GitHub | | internal | -- deploy -->
+---------+ +----------+ \\------>
^ ^
| |
| +---------+ |
\\-----| ME! | ----/
+---------+

This one I have used before, and is the least complex. It needs the least setup, but doesn't sync the two repositories automatically. Essentially we are going to add a second Git Remote to the local copy, and push to both servers in our workflow:

In your own local copy of the repository, checked out from GitHub, add a new remote a bit like this:

git remote add internal user@internalserver:/path/to/sync.git

[This guide](https://help.github.com/articles/adding-a-remote) on help.github.com has a bit more information about adding Remotes.

You can change the remote name of "internal" to whatever you want. You could also rename the remote which points to GitHub ("origin") to something else, so it's clearer where it is pushing to:

git remote rename origin github

With your remotes ready, to keep the servers in sync you push to both of them, one after the other:

git push github master
git push internal master

- **Pros:** Really simple
- **Cons:** It's a little more typing when pushing changes

### The Automated Way:

+---------+ +----------+ /------>
| GitHub | ======> | internal | -- deploy -->
+---------+ +----------+ \\------>
^
|
| +---------+
\\------------- | ME! |
+---------+

The previous method is simple and reliable, but it doesn't really scale that well. Wouldn't it be nice if the internal server did the extra work?

The main thing to be aware of with this method is that you wouldn't be able to push directly to your internal server - if you did, then the changes would be overwritten by the process I'll describe.

Anyway:

One problem I had in setting this up initially, is the local repositories on my PC are cloned from GitHub over SSH, which would require a lot more setup to allow the server to fetch from GitHub without any interaction. So what I did was remove the existing remote, and add a new one pointing to the https link:

(on the internal server)
cd /path/to/repository.git
git remote rm origin
git remote add origin https://github.com/chrismcabz/repo-syncing-test.git
git fetch origin

You might not have to do this, but I did, so best to mention it!

At this point, you can test everything is working OK. Create or modify a file in your local copy, and push it to GitHub. On your internal server, do a `git fetch origin` to sync the change down to the server repository. Now, if you were to try and do a normal `git merge origin` at this point, it would fail, because we're in a "bare" repository. If we were to clone the server repository to another machine, it would reflect the previous commit.

Instead, to see our changes reflected, we can use `git reset` (I've included example output messages):

git reset refs/remotes/origin/master

Unstaged changes after reset:
M LICENSE
M README.md
M testfile1.txt
M testfile2.txt
M testfile3.txt

Now if we were to clone the internal server's repository, it would be fully up to date with the repository on GitHub. Great! But so far it's still a manual process, so lets add a `cron` task to stop the need for human intervention.

In my case, adding a new file to `/etc/cron.d/`, with the contents below was enough:

\*/30 \* \* \* \* user cd /path/to/sync.git && git fetch origin && git reset refs/remotes/origin/master > /dev/null

What this does is tell cron that every 30 minutes it should run our command as the user _user_. Stepping through the command, we're asking to:

1. `cd` to our repository
2. `git fetch` from GitHub
3. `git reset` like we did in our test above, while sending the messages to `/dev/null`

That should be all we need to do! Our internal server will keep itself up-to-date with our GitHub repository automatically.

- **Pros:** It's automated; only need to push changes to one server.
- **Cons:** If someone mistakenly pushes to the internal server, their changes will be overwritten

### Credits

- [Automatic synchronization of 2 git repositories](http://www.pragmatic-source.com/en/opensource/tips/automatic-synchronization-2-git-repositories) - from where the bulk of the Automated Way was adapted from.
- [Adding A Remote](https://help.github.com/articles/adding-a-remote)
- [4.2 Git on the Server - Getting Git on a Server](http://git-scm.com/book/en/Git-on-the-Server-Getting-Git-on-a-Server)
