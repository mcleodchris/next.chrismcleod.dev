---
title: '"File" Form Inputs & Internet Explorer'
date: 2005-03-24
categories:
  - articles
authors:
  - chris
archived: true
---

Since rolling out Windows XP SP2 around the office network, I’ve come across curious differences in the way Internet Explorer handles file form inputs (`input type="file"...`), before and after SP2 is applied. At least I think I have…

## Some Context.

Pre-SP2, it seemed possible to just type in a value to the input (rather than use the Browse button). For example, a user could type in ”/home/chris/my_file.txt”. In the context of our intranet, “not applicable” was a valid value that the user could enter.

## The Issue.

Once SP2 was applied, this no longer worked. In our Intranet system, typing in a value produced an error in our server-side validation script – the script thought that the input _had been left blank_. Curiously, the page returned by the server had a javascript error warning (“Object Not Found”), despite there being no client-side scripting done on this particular page.

If the input was given a value by clicking on the browse button and selecting a file, everything would work fine.

This issue has caused us a few problems, as a few of our intranet apps suddenly “broke” with no immediate or obvious explanation.

## Over to You

Has anyone else come across this little quirk? Could someone else confirm or debunk this?

I must admit to not testing this in any great depth, but I have come across this problem on a number of different pages (not all on our intranet), using a couple of different machines. I did a quick google search and nothing related came up.

Or is it all me fault? Actually, don’t answer that…
