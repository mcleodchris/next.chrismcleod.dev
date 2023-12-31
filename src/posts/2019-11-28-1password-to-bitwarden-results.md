---
title: "1Password to Bitwarden Migration Results"
date: 2019-11-28T21:42:00Z
categories:
  - notes
authors:
  - chris
archived: true
tags:
  - 1password
  - security
  - software
  - user-experience
---

So… [that](/blog/1password-to-bitwarden-migration-preparation/) didn't go so well. All the login items were there after the import, but easily 60% plus of the data was parsed incorrectly - usually one or both of username and password were imported as "custom fields" instead of actual login details. There was no pattern I could discern about why some logins imported successfully and the rest didn't.

Two-Factor Authentication (TOTP) details were also imported as a custom field, instead of the "correct" one. I tried manually fixing a couple of accounts, for testing purposes, but the TOTP codes generated by Bitwarden wouldn't work on the sites.

There is a [format](https://help.bitwarden.com/article/import-data/#generic-csv-format-individual-account) I can manually massage the data into, to get it to import properly (apparently), but this is starting to look like the major hassle [I feared it might](/blog/the-unnoticed-silo/). And I doubt reformatting the export will fix the TOTP codes. That's usually a time-skew/clock settings thing in my experience, but every device I tried from had the correct time.

If I do decide to migrate, I'll revisit this - by necessity - but it's a job for another time. For now I've purged my Bitwarden vault.

On the plus side, the encrypted notes imported just fine…
