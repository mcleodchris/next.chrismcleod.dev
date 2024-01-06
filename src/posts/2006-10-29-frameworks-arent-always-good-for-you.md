---
title: "Frameworks Aren't Always Good for You"
date: 2006-10-29
categories:
  - articles
tags:
  - frameworks
  - php
  - programming
  - ruby
authors:
  - chris
archived: true
---

So I’m writing my first serious bit of PHP in *aaaages*. This last few months, I’ve either been adapting [existing](http://www.wordpress.org/) [systems](http://www.textpattern.com/) to fit the bill, or I’ve been writing ASP (all while learnng [Ruby on Rails](http://www.rubyonrails.com/)).

I feel like I’ve been out of the game. Before I fell out of writing my own PHP every day, I was using the [CakePHP](http://www.cakephp.org/) framework. CakePHP is a wonderful framework. It greatly speeds up development and makes things so much easier.

Unfortunately, frameworks are only of use to the developer or your customer has someone who knows what they’re doing to set up everything for them. When you’re building a product for those who aren’t so technically minded, giving them something like CakePHP/Rails/Django, etc, to install – *before* they can use the product – is a big no-no[^1].

So anyway, I’m writing this new product. It’s not terribly exciting, nor should it be particularly difficult… but what looked a piece of cake on paper is going slower than I would like. I need to get my head around the fact I don’t have a framework or existing application doing 90% of the grunt-work for me. All those framework-specific shortcuts and existing functions I’ve grown used to don’t work any more so I need to do things manually[^2]. Joyful.

On the plus side, this is probably the coding equivalent of getting back into shape for a World Championship fight, after getting slower and fatter from being too comfortable – a la Rocky in Rocky III.

Frameworks are a wonderful thing for speeding up development in large projects where you have control over your environment. Just remember not to rely on them too much.

[^1]: This isn’t to knock the work of the developers of frameworks like CakePHP and Rails, et al – not at all. I think they’re doing great, *great* work, which makes the lives of countless developers worldwide just that little bit easier.
[^2]: Another thing keeping me from top-speed is an insistence I’ve put on myself to follow best coding-practices all the way, and most importantly, *document everything as I go*. I usually write something then document it later once everything else is finished.
