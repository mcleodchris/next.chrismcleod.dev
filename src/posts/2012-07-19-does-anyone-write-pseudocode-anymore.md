---
title: "Does Anyone Write Pseudo-Code Any More?"
date: 2012-07-19
categories:
  - articles
tags:
  - programming
archived: true
---

Back in the mists of time, when I was in University[^1], one of the very first principles we were taught was writing [pseudo-code][pc].

For those of you unfamiliar with the term, pseudo-code is the practice of writing simple, “half code” down, (usually) on paper as a guide to help you work through a problem before even touching an [IDE](http://en.wikipedia.org/wiki/Integrated_development_environment). The goal is to be as high-level as possible, and mostly language independent. It was a combination of plain English and the most basic of code – mostly simple conditionals, loops, etc. Occasionally you would write a function reference if you absolutely needed to. Something below is similar to how I remember being taught pseudo-code, but other examples can be found on [the relevant Wikipedia page][pc].

```text
variable a
variable b
 
input: "This is a test"
 
a = 1
b = 100
 
do while a < b
    if a == 50 then
        print "taking a break half-way"
    else
        print a + ": " + input
    end if
    a++
loop
```

I remember pseudo-code being incredibly useful at the time; problems became much simpler to think through, even as a complete novice programmer[^2]. I wrote pseudo-code for every new problem I had to code a solution to. Somewhere along the line though, I fell out of the habit. I would start in the IDE with a vague idea, then proceed to hack and refine ([refactor](http://en.wikipedia.org/wiki/Code_refactoring)) as I went along. Chipping away at a problem seems to give a greater sense of forward-momentum, so maybe that is why?

Occasionally I will still bust out the pencil and paper if I am really stuck, or thinking about the problem away from the computer, but these times are rare nowadays. It got me thinking that I don’t recall seeing anyone write pseudo-code in my entire professional career. Is it something we just learn at university and do not carry on into “the real world” as we become more experienced? Is it even taught any more?

Do you still write pseudo-code? Did you ever?

[pc]: http://en.wikipedia.org/wiki/Pseudocode

[^1]: Back when [Turbo Pascal](http://en.wikipedia.org/wiki/Turbo_Pascal) was being taught, and [Java](http://en.wikipedia.org/wiki/Java_%28programming_language%29) was yet to enter the curriculum.
[^2]: I started my degree in computing with no prior academic experience with computers.  The little “programming” skills I had were writing simple “GOTO” loops on my Commodore 64, many years prior.