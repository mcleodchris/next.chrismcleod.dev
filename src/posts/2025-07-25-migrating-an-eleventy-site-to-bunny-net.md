---
id: 42781b9d-b678-4147-aff8-2a4016fee733
date: 2025-07-25T15:46:08.023Z
title: Migrating An Eleventy Site to Bunny.Net
tags:
  - meta
  - hosting
  - bunny-net
  - eleventy
atUri: "at://did:plc:fcewtyqycu5qlt26tnbnan6h/site.standard.document/3mpyyqdped22p"
ogImage: migrating-an-eleventy-site-to-bunnynet-preview.jpeg
---

I wrote a while back that [I was hosting the images for this blog on Azure](https://chrismcleod.dev/blog/i-rebuilt-my-blog-and-didnt-write-about-it/). After I wrote that post [I moved the site wholesale over to Azure Static Web Apps](https://chrismcleod.dev/blog/sending-webmentions-after-deploying-to-azure-static-web-apps/) (SWA), and the site has been running pretty smoothly since. Unfortunately, Azure are deprecating the particular CDN service I was using, and the alternatives looked Enterprise-grade expensive. The actual switch-off wasn't happening until 2027, but I know what I'm like: I'd forget and then have to rush to fix my broken site all of a sudden. So moving sooner rather than later seemed the best idea.

I also took it as an opportunity to reduce my reliance on US Tech firms and diversify out a bit. I'm not exactly "Anti Big Tech", but trust has been eroding for a while and I like to be pragmatic about these things. I recently switched my primary desktop to Linux, but that's a story for another day. But anyway, to cut a long story much shorter: I settled on [Bunny.Net for storage and CDN](https://bunny.net?ref=p6szzw7737), and the rest of this post is describing what that entailed.

## Moving the CDN

The biggest job (I thought) was always going to be moving the 6.5GB of images I had in Azure and setting up the new CDN. Thankfully, it ended up being almost comically easy.

1. Use Azure Storage Explorer to download the relevant blob containers to my local computer.
2. Create a Bunny Storage Zone and get the access details
3. Use Filezilla to upload the files to the Storage Zone
4. Create a new CDN "Pull Zone" pointing at the Storage Zone
5. Add a new hostname pointing to the Pull Zone
6. Verify files were loading OK from the CDN
7. Find-and-replace the old CDN URL for the new one across all post files
8. Commit the file changes, commit, and let CI/CD deploy the blog
9. Done!

The site itself was still on Azure at this point, but all image assets had seamlessly transferred over and were being served by Bunny. I turned on "smart" caching and Bunny Shield (their Web Application Firewall offering) in Basic mode, and job done.

## Moving the Site

Moving the site itself to Bunny was going to be a very similar process. The main sticking point was replacing the convenient CI/CD process that builds and deploys the site. Every time I check in a change and push it to the repository a process is kicked off which runs the build script and deploys the output to the target service. SWA sets this up automatically for you as a GitHub Action. It made sense to create a new Action to do much the same, just with Bunny as the deployment target.

First though, I created a new Storage Zone and associated Pull Zone. I didn't add the hostname for the site to the Pull Zone yet though - I wanted to be sure everything was working fine before finalising the switch.

I'm not overly familiar with writing GitHub Actions, but I get the concepts and the basics. After a bit of digging around on the Internet I landed on an Action which looks like this:

```yaml
{% raw %}
name: Bunny.Net Deployment CI/CD

on:
  push:
    branches:
      - develop
  repository_dispatch:
    types: [function_trigger]

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || github.event_name == 'repository_dispatch'
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true
          lfs: false
      - name: Load cache
        uses: actions/cache@v4
        with:
          path: |
            .cache
          key: ${{ runner.os }}-build-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-build-
      - name: Build
        run: |
          npm install
          npm run build
      - name: Save cache
        uses: actions/cache@v4
        with:
          path: |
            .cache
          key: ${{ runner.os }}-build-${{ hashFiles('**/package-lock.json') }}
      - name: Deploy to BunnyCDN
        uses: ayeressian/bunnycdn-storage-deploy@v2.3.0
        with:
          source: "dist"
          destination: ""
          storageZoneName: "${{ secrets.STORAGE_NAME }}"
          storagePassword: "${{ secrets.STORAGE_PASSWORD }}"
          storageEndpoint: "uk.storage.bunnycdn.com"
          accessKey: "${{ secrets.ACCESS_KEY }}"
          pullZoneId: "${{ secrets.ZONE_ID }}"
          upload: "true"
          remove: "true"
          purgePullZone: "true"
          purgePullZoneDelay: "15"
{% endraw %}
```

This uses the action [ayeressian/bunnycdn-storage-deploy](https://github.com/ayeressian/bunnycdn-storage-deploy) to do the heavy lifting of interacting with the Bunny API.

I did some test deployments to both Bunny and Azure for a while. Once I was happy everything was working as expected, DNS was switched from pointing to Azure to pointing to Bunny. And everything (pretty much) worked out of the gate.

## A Few Tweaks

SWA uses a JSON configuration file to let you tweak various settings like HTTP headers and add any redirects. Bunny doesn't use an equivalent file, but does let you set Edge Rules through the dashboard. I added several for security-related headers, then one which handled redirecting some old feed URLs to [the current one](https://chrismcleod.dev/follow/blog/feed.atom). Adding these was simple enough, but having to repeat the process for every site I migrate from here-on might get tedious.

I didn't turn on Smart Cache for the blog itself, as it turns out that by default the CDN caches everything anyway, whereas Smart Cache [doesn't include HTML files](https://support.bunny.net/hc/en-us/articles/5779976842770-Understanding-Smart-Cache). I did turn on the Shield WAF as the site was instantly swarmed by bots looking for sensitive files. There's nothing for them to find, but better safe than sorry!

With all that done, everything was migrated, with everything running extremely smoothly from my point of view. In fact, it went so well I've already migrated my [Photo Blog](https://chrismcleod.photos) too!