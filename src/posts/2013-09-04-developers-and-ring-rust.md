---
title: 'Developers and "Ring Rust"'
date: 2013-09-04
categories:
  - code-development
tags:
  - developer
  - development
  - e-book
  - ebook
  - facebook
  - flipboard
  - github
  - learning
  - lifehacks
  - responsive-web-design
  - skills
  - software
  - twitter
authors:
  - chris
archived: true
---

Skills are much like muscles: if you don't use them for a while they start to atrophy. They say you never forget how to ride a bike, but there are many skills where you *will* forget things if you don't do them frequently. The collection of skills needed to be a developer are no exception to the rule.

I'm somewhat speaking from experience here; my current role and workload has removed me from day-to-day development work for about a full year now. I still need to dive in to the code base every day to research issues or change requests, but actually writing something is quite rare these days. I'm aware of the skills problem, and I'll describe below how I'm trying to address it, but never the less I've been self-concious enough about it I've recently found myself resisting taking on development tasks. I know it'll take me a lot longer to get up to speed and complete as one of the developers who're working on the application every day, and the time-scales involved are usually very tight. It's a vicious circle: I'm rusty because I'm not doing development, but I'm avoiding development because I've been away from it for too long. In the corporate world it's very easy to get rail-roaded into a niche - and incredibly hard to get out of it.

Time away for a developer is exacerbated by the speed in which technology and techniques moves forward in our industry. What was cutting edge a year-ago is old-hat today, and may even be something you're encouraged *not* to do any more. If you haven't been practising and keeping up developments then you may not be aware and get yourself into all sorts of bother.

So what can you do?

### Read. Lots.

Subscribe to a load of developer sites and blogs in [Feedly](http://www.feedly.com "feedly"), for one source, but a more convenient way I've found to stay on top of things is using [Flipboard](http://www.flipboard.com/ "Flipboard"):

- Follow other developers on Twitter (actually, you don't have to, but it's nice to), and create/add them to a list, such as "[Developers & News](https://twitter.com/__chrismc/lists/developers-news)".
- Within Flipboard, add your Twitter account if you haven't already.
- Still within Flipboard, go to your Twitter stream. Tap your name at the top and select "Your Lists."
- Open the relevant list, then tap the subscribe button.

Your list will be added to your Flipboard sources and you'll have an always-up-to-date magazine of what's happening. The reason I suggest Flipboard is that it grabs the link in a tweet, pulls in the article, and will try to reformat it into something you can easily flip through. It makes reading on a tablet so much more enjoyable. Some of the links you get will not be relevant, but a large amount of it will be gold. I try to set aside 30 minutes a day to go through at least the headlines. If work is exceptionally busy I'll aim for twice a week. Saving to a "Read it Later" service like [Pocket](http://getpocket.com/) is useful for storing the most interesting articles.

What about books? Yes, by all means, read plenty of technical books. They're usually in far more depth than even the best online article. With tablets, eReaders, and eBooks, the days of thick tomes taking up lots of space are behind us, and no longer a major concern (at least for me). There is however, one major issue with books - they take a long time to write, and are often out of date quickly. The technology might have moved on by the time the book is published. Schemes such as [the Pragmatic Programmer's "Beta Book" scheme](http://pragprog.com/frequently-asked-questions/beta-books) help a lot here - releasing unfinished versions of the book quickly and often, to iron out problems before publishing. Of course, you also need to be aware of the topic to be able to pick out a book about it!

### Be Curious. Experiment.

Reading all the material in the world will not help you anywhere near as much as actually *doing something.* The absolute best thing you could do would be to develop side projects in your spare time. Admittedly, if you're busy, time can be at a premium! Probably a good 99% of side projects I start lie unfinished or abandoned, simply for lack of time. So instead, I perform small experiments.

Curious about something? Do something small to see how it works, or "what happens if...". Personal, recent, examples would be:

- Looking into static site generators, and as a result, learning about [Jekyll](http://jekyllrb.com/), [Github](http://github.com "GitHub") pages for hosting... and as a result of trying out [Jekyll templates](http://jekyllrb.com/docs/templates/) I brushed up on [Responsive Web Design](http://www.abookapart.com/products/responsive-web-design), looked into [Zepto](http://zeptojs.com/), and fell in love with [Less](http://lesscss.org/).
- Trying out automating development workflows - installed [Node.js](http://nodejs.org/) (which then allowed me to [run this](http://chrismcleod.me/2013/08/27/move-from-playlists-from-spotify-to-google-music-with-portify/ "Move from Playlists from Spotify to Google Music with Portify")), setup some basic [Grunt.js](gruntjs.com) tasks, [Imagemagick](http://www.imagemagick.org) batch processing, and some more Less.
- Running Linux as my primary OS, and no Windows partition to fall back on - so in at the deep-end if something goes wrong... but it's helped me brush up on my MySQL and Apache admin skills again, as well as generally working with the command-line again. The other week I fixed someone's VPS for them via SSH  - something I would have struggled to do only a few weeks ago. In case you're interested: the disk was filling up due to an out of control virtual host error log, which I had to first diagnose, and then reconfigure [logrotate](http://linuxcommand.org/man_pages/logrotate8.html) to keep the site in check.

An earlier example, from before I was entirely away from development: I wanted to see what was different in [CodeIgniter 2](http://ellislab.com/codeigniter), so I made a very small app. My curiosity then extended into "how does [Heroku](http://www.heroku.com/ "Heroku") work?" - so I deployed to Heroku. I couldn't pay for a database I knew how to work with, so I tried out [a little bit of MongoDB](/blog/use-custom-php-extensions-on-heroku/ "Use Custom PHP Extensions on Heroku"). Then it was the [Graph API](http://developers.facebook.com/docs/api "Graph API") from Facebook... so again, [I extended the application, this time with the Facebook SDK](/blog/using-the-facebook-php-sdk-with-codeigniter/ "Using the Facebook PHP SDK with CodeIgniter").

Little experiments can lead to a lot of learning. I would never claim to be an expert in any of the technologies I mention, but neither am I ignorant.

### Shaking it Out

I'd still need a major project to focus on and really shake off the "ring rust," to get back up to full development potential, but I'm pretty confident it wouldn't take as long as if I hadn't been working on the trying to keep my skills as fresh as I can.
