---
title: "Control Spam in Evolution"
date: 2004-05-17
categories:
  - articles
authors:
  - chris
archived: true
tags:
  - linux
  - spam-assassin
  - email
  - how-to
---

_This post was originally inspired by [this thread](https://web.archive.org/web/20041214215106/http://forums.gentoo.org/viewtopic.php?t=26006) on the Gentoo Support Forums._

It seems that SPAM is forever on the increase. Daily, our inboxes are flooded with offers of riches, pills, or other such junk. Dealing with SPAM can take a long time – time that would be better used on something more productive (like Unreal Tournament 2004…)

There are tools for helping to automate the task. Nearly all mail clients allow you to setup filters to direct messages that match certain patterns to certain mailboxes. With the all the different tricks used by spammers, this can lead to a lot of filters having to be setup! Some clients (such as Mozilla Thunderbird) have built-in anti-spam filtering. Depending on the level of mail that you receive, these might be perfectly adequate for your needs.

Sometimes though, you just need a little bit more power…

SpamAssassin is a powerful program for filtering SPAM from your mailbox. I’ve seen it used a lot on the server-side – filtering messages as they come into a mail server. It can also be used client-side, which is the method we’re going to setup today.

Evolution is the mail client/calendar/task list program from Ximian (now part of Novell). It’s a pretty powerful app, on a par with Outlook in most respects, but with none of the flub. It offers a lot of options for filtering your mail, including one very useful option in particular: “pipe message to shell command”.

Can you guess what we’re gonna do? That’s right. Use Evolution’s filters to pass incoming mail to SpamAssassin, then decide what to do with the message based on its spam score. Ready? Then lets begin.

`emerge evolution`

Let it churn away…

`emerge SpamAssassin`

More churning…

When all the compiling is done, add the spamassassin daemon (spamd) to the default run level so it starts at bootup: `rc-update add spamd default`

If you haven’t already done so, set up Evolution with your e-mail account(s). Next comes the laborious part – setting up the quarantine area, the training area and the filter.

Create a new folder in Evolution, called Quarantine. This will be where messages marked as spam will be put. Now create a subfolder under Quarantine called SPAM Training. This is where we will manually place SPAM mail that SpamAssassin misses and later use it to train SpamAssassin to catch it next time.

With the folders setup, lets create our filter. Filter options can be accessed under Tools > Filters. Create a new filter called “SPAM” (or similar). The settings for this filter should be:

**IF** `pipe message to shell command spamc -c returns greater than 0` **THEN** `move to folder "Quarantine" in "Local Folders"`

That should be it. Instantly, you’ll find less spam in your inbox as it gets filtered into your quarantine folder instead. You could set it to delete spam instead of quarantining it, but there’s always the chance of false positives, so I like to double-check the quarantine area every couple of days in case there’s something there that I might want to keep.

Inevitably, some spam will get through. To deal with this, we need to train SpamAssassin into a lean, mean, spam-eating machine. Remember the “Spam Training” folder we set up? Now’s when it comes in useful. When SpamAssassin misses a message, manually move it into the training folder. Then, type the following command, changing @@ with the path to your home directory: `sa-learn --spam --mbox "<home dir>/evolution/local/Inbox/subfolders/Quarantine/subfolders/SPAM Training"`. This command tells SpamAssassin to look in the folder and that everything in it should be classed as spam from now on. After a few days/weeks of training, the amount of spam in your inbox should drop to next to zero!
