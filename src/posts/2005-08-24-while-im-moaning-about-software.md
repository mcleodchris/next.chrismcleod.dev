---
title: "While I’m Moaning About Software…"
date: 2005-08-24
categories:
  - articles
authors:
  - chris
archived: true
tags:
  - rant
  - programming
  - APIs
---

Related to my [previous entry](/2005/08/24/when-software-bugs-refuse-to-die/ "When Software Bugs Refuse to Die"), is a little peeve about the MovableType API, or perhaps it’s just its implementation in Marsedit. Who in their right mind decided that the process for creating a new post via XML-RPC in this API should involve the following steps from the client software?

1. send new post data. Don’t send category information. Set the publish flag to false.
2. send the category information for the new post in a separate XML_RPC call.
3. finally, send all the data from step 1 again, in an edit post function call, this time to set the publish flag to true if need be.

Kinda a silly and wasteful way to do things, IMNSHO. The standard MetaWeblog API (from which Movabletype’s is derived) does it better:

1. send post data, including category information. Set publish flag to true or false, as appropriate
2. that’s it.

Much simpler, with no wasted bandwidth or processing time.
