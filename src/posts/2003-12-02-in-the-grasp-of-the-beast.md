---
title: "In the Grasp of the Beast"
date: 2003-12-02
categories:
  - articles
tags:
  - dotnet
  - microsoft
authors:
  - chris
archived: true
---

I’ve finally taken my first steps with ASP.NET. I’ve only done some basic research and examples and all I can say, is that it’s one f\*cking powerful choice for developing web applications… It’s so far ahead of vanilla ASP that it’s terrifying. It’s great being able to use another computationally complete language. ASP.NET is so much faster as well.

Shame that it costs a lot to actually roll out anywhere. Your average Windows Server license doesn’t come cheap and IIS is pretty much the only way web server that works. Neither are most of the tools cheap. Naturally, the ideal way to develop with .NET is with Visual .NET Studio (megabucks) and use SQL Server (again, megabucks) as the backend.

However, there is an alternative. Actually, there’s 2 – but I can’t get Dreamweaver MX to connect to any databases when coding .NET pages, so I’m discounting that. Besides, the code it generates looks a bit bloated. So ignoring DW MX, the alternative is [The Web Matrix Project](http://www.asp.net/webmatrix/ "Web Matrix").

Web Matrix is free. Despite this, it comes from Microsoft. Despite coming from Microsoft, it’s actually a well thought out and rather good program. It’s sorta like FrontPage for .NET (don’t let that put you off!!). It features WYSIWYG design view – which I must say that I’ve never used – that allows you to drag and drop server controls into your page. It also offers code views so you can type everything in directly. What’s really nifty, is that it has 2 code views – one for coding the (X)HTML and the other that displays only the server side code. It also comes with a compact personal web server so that you can test stuff locally without shelling out for a Win Server. All in all, it’s a dream for those of us that are cheapskates!

So that’s the coding environment sorted out, but what about the backend? Well, you *could* use XML, which is treated exactly like any other database. However, I dunno anything about using XML with .NET at the moment, so I’ll skip that. So what’s left? Well, Access is the one that most will tell you to use. But I hate using Access. It comes from having to use it at work. So I went down a route that some said was impossible, and others said was difficult. I say pfft to them, cos it was a piece of pish. So what am I using for my .NET backend? MySQL over OLEDB.

Putting a Microsoft programming technology alongside an open source database solution doesn’t quite sit right in the brain. But it works, and works really well I might add. What’s more, because of the nature of OLEDB in .NET, I can pretty much use any database by only changing the connection string.

So now that I have my development environment, I guess it’s time to actually delve deeper into the murky depths… I guess that’s my project for the holidays sorted then.
