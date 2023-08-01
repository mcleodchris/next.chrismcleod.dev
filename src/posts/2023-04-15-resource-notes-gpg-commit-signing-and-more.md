---
title: 'Resource Notes: GPG, commit signing and more'
date: 2023-04-15
categories:
  - uncategorised
tags:
  - development
  - gpg
  - keys
  - signing
  - ssh
  - tech
  - verification
authors:
  - chris
redirectFrom: ['/2023/04/15/resource-notes-gpg-commit-signing-and-more/']
---

Below are a few resources I need to explore later around using GPG, YubiKeys, Git commit signing, amongst other things:

- [drduh/YubiKey-Guide: Guide to using YubiKey for GPG and SSH (github.com)](https://github.com/drduh/YubiKey-Guide) - extremely comprehensive.
- [Setting Up GPG on Windows (The Easy Way) | Tower Blog (git-tower.com)](https://www.git-tower.com/blog/setting-up-gpg-windows/)
- [Signing GitHub Commits With YubiKey · Den Delimarsky](https://den.dev/blog/signing-github-commits-yubikey/)
- [Configure GPG to sign Git commits (in Windows) (neurotechnics.com)](https://neurotechnics.com/blog/configure-gpg-to-sign-git-commits-in-windows/)
- [Managing commit signature verification - GitHub Docs](https://docs.github.com/en/authentication/managing-commit-signature-verification)
- [Funtoo Keychain Project - Funtoo](https://www.funtoo.org/Funtoo:Keychain)

Note: spent half an hour trying to figure out why I couldn't sign a commit, even though encrypting some text worked (i.e. GPG itself was working) - it was because there was a typo in my git config for my name; all identifiers (username + email) must match exactly for signing to work.
