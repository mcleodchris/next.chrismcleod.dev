---
title: Things I Find Github Copilot Actually Useful For
date: 2024-05-12T15:52Z
tags:
  - software-engineering
  - AI
  - github
  - copilot
---

I've been lightly using Github Copilot in a personal capacity for almost a year, and I'm probably going to get to use it on work projects in the near future. I thought I'd take a moment to collect my thoughts on where I've found any value in using it, as well as acknowledge some of the shortcomings I've experienced.

## Understanding Existing Code

I work with a lot of code that was either written a long time ago, or I need to work with only infrequently. Sometimes both at the same time. I'll need to figure out what that code does before I can make any changes, and that can take a while if I'm doing it "manually" - often it won't be until I run the code through the unit tests or a debugging session, or sometimes "as a user", until it really clicks. Copilot has made this a lot faster.

Selecting a bit of code, opening the chat interface, and asking it "what does this do?" and getting a very clear and concise breakdown, has been genuinely revolutionary to my workflows. I don't need to scratch my head for hours at a time. I don't need to sketch out flow diagrams or step-by-steps on a piece of paper to map things out. I ask Copilot, it churns away for a moment, then it gives me the answer in clear steps, highlighting particularly important variables and function calls.

One side-effect I've noticed of asking Copilot to explain something is it will sometimes highlight potential bugs as part of the explanation, which can make resolving issues quicker. You can explicitly ask it to find and fix issues instead, but mentioning them in an explanation is useful context.

I can already see how I might make use of this in story analysis, and discussions around extending or improving legacy systems, even just in regular day to day work like code reviews.

## Documenting Existing Code

This one is a little more hit-or-miss than providing mere explanation, but Copilot has been pretty good at generating documentation of code. By documentation I mean useful inline comments and the use of JSDoc or other, language-specific, syntax used to aid in autocompletion and the generation of API documentation, etc.

I tend to find that asking Copilot to document an entire file at once will make it choke, so going function-by function works better. Some nuance in, say, type definitions might get glossed over, but if it saves me typing out 80-90% of the details then I think it's a win in this particular task.

I have a use-case for this very feature at work right now, and I'm sure I'll refine and improve my use of it over time.

## Improving Code

I'm distinguishing "improving code" from "writing code" here, as I personally think Copilot is better at the former than it is at the latter. Everyone thinks of Copilot generating _new_ code for us, and much of the criticism of it I've seen has generally been along the lines of "the code isn't very good/is completely wrong"… and honestly, I get it. Sometimes Copilot is _scary_ prescient and suggests the exact code I want before I've finished considering what to write, but often I find it's quite wide of the mark[^1].

[^1]: I have an ongoing issue where Copilot will suddenly, and without prompting, suggest large blocks of code that are essentially a copy-and-paste of something I've just written, or appears later in the file. Either way, it's almost never relevant.

But give it some existing code and ask it to improve (or as I usually ask: "simplify") and in my experience it is much more likely to do the job right.

This even extends to code you might have just generated with Copilot. It might only be my experience, but for anything more than an obvious one/two-liner, often the first (acceptable) code Copilot will give me is correct but verbose, sometimes needlessly so. By selecting the code and asking for a simplification, _most of the time_ you will get a much better version of what was originally there.

I've found myself doing this quite a bit lately, as I refactor a personal project I wrote over fifteen years ago, and I've been pretty happy with the results. I'm sure mid-20's me was very smart and knew exactly what he was doing at the time, but me of the present is looking at a lot of his code and thinking "it doesn't need to be this complicated".

## Being Productive in Unfamiliar Languages/Frameworks

I jump around between stacks a lot, and often I'll need to work on something that's similar to a thing I did before, but in a new language or framework. I'm sure you know the drill.

By combining my existing knowledge and experience with Copilot's explanations, suggestions, and iterating over the code, I'm able to be productive faster on something new than if I was picking it up from scratch on my own.

Is this initial output equivalent to that of someone experienced in the language/framework? No, of course not. But it moves me closer, faster, and with the right support allows me to jump into new scenarios with less trepidation. I don't necessarily need to do a course or binge a bunch of related YouTube videos to get up to speed on something _before_ starting work on it - now I can likely get started first and augment that initial productivity with learning materials. As someone who learns better by doing, this reduces the friction somewhat.

## Where I've Struggled with Copilot

I've mentioned a couple of things above where I've found Copilot less magical than the marketing would suggest, but for posterity, here are some additional areas where I've found Copilot lacking:

### Unit Tests

If there was one thing I **really** wanted Copilot to be able to do for me, it was this - generate unit tests for my code. I am generally not quick at writing tests on my own, so it becomes a bit of a bottleneck. I've seen loads of people be able to generate whole test suites using Copilot, but I've just never managed to get it to work. Maybe it's bad luck, maybe it's how I've written the code to be tested, I'm not sure. The recurring problem seems to be it hallucinating things that aren't in the code it's meant to be testing.

### Inline Chat seems less accurate than the main Chat Window somehow?

This one confuses me. If I use <kbd>Ctrl</kbd>+<kbd>I</kbd> to bring up the inline chat, and ask it to suggest some code/explain/whatever, the resulting suggestion is wrong considerably more often than if I use the main chat window (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>I</kbd>). This might be down to how I'm using inline chat, given the importance for context in getting accurate answers, but it's been a frustration for a while. Perhaps I need to dedicate some time to figure out what I'm doing wrong, as there's no reason I should be seeing such wildly different success rates between the two interfaces!

## Summing Up

Overall, I find Copilot genuinely helpful for several things: understanding, documenting, and refactoring existing code, as well as jumpstarting work in new languages/frameworks. That these tend to be some of the most common or important things I do on a daily basis means Copilot does earn a place in my toolbox. Outside of these things though, I find it less useful, and certainly nowhere near living up to the marketing hype.
