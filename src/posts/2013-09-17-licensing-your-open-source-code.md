---
title: "Licensing Your Open Source Code"
date: 2013-09-17
categories:
  - code-development
tags:
  - github
  - languages
  - license
  - open-source-license
  - open-source
  - oss
  - programming
  - project
  - source-code
authors:
  - chris
archived: true
---

I received an email from a developer the other day, who had forked the repository for my "IIS Express Here" shell extension on GitHub \[editors note - no longer available\]. He had noticed there was no license information available in the project, so asked if I could either add a license, or give him written permission to adapt my code and share it to others (as is the spirit of GitHub and OSS).

To be honest, this wasn't something I'd thought about before, and was a bit of an oversight on my part. I'd not really considered the need to add explicit licenses to my repositories. After all, the code is out there anyway - it's open to use on GitHub, and I've often shared it on this blog… if someone wanted to copy the code, they could, right?

Unfortunately, this creates a grey-area, which some are naturally uncomfortable with. Can I use this code in something else? Can I modify it at all? Do I have to pay royalties if I do?

But licensing is hard, isn't it? All the different types, with different caveats, liabilities, and legal mumbo-jumbo… well, yes, it can be hard. The good folks at GitHub have a solution: [ChooseALicense.com](http://choosealicense.com/) is attempting to demystify open source licenses so you can pick the right one for your project. More than this, when you create a new repository on GitHub, the site will ask if you want to add a template license during the initialisation process:

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2013/09/repo_licenses.png", "repo_licenses" %}

Coming back to the developer who emailed me - I mailed him back to let him know that IIS Express Here is now licensed under [the MIT license](http://choosealicense.com/licenses/mit/). This fits best with how I see the code and projects I share on this blog (unless noted otherwise) - free for anyone else to use, but with no warranty, so if something goes wrong then I'm not liable and it's not my responsibility to fix it. I haven't got around to updating all of my repos with licenses, as I'm evaluating each one in turn, based on my goals and even whether the project is going to archived.

{% image "https://assets.chrism.cloud/chrismcleod.dev/assets/images/2013/09/choosealicense-com.png", "ChooseALicense.com" %}
