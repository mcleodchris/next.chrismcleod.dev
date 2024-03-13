---
title: I have a Problem with Build Times
date: 2024-03-13T22:23Z
tags:
  - site-meta
  - eleventy
---
At the moment, this site takes too damn long to build. Recent builds are nearly 20 minutes. The upper limit on the tooling I'm using is 25 minutes. So it's a problem I need to address. I've found myself reluctant to add some bits and bobs to the site recently because they just won't work in a world where builds take so long.

The problem isn't the server tooling, or Eleventy itself. It's 100% the way I'm handling images in blog posts:

1. Each raw image is uploaded to a CDN.
2. The CDN URL is referenced in a post using a shortcode.
3. At build-time every referenced image, across the whole site, is downloaded to the build server.
4. Each downloaded image is then optimised for different scenarios by: converting into 3 formats (AVIF, WEBP, and JPEG), and 3 different sizes for each format.
5. A `<picture>` tag is generated with the markup to show the right image to the user.
6. ???
7. Profit.

Steps 3 and 4 are where the time and computational power are being burned. I originally went with this setup because I don't want to be committing images into the Git repository that powers the site. It's not the right place for them. And it worked at first, when there were maybe less than a dozen images on the whole site. But then I added 20 years of archived posts, some of which were _very_ image heavy, and it all went to hell.

I'm not 100% sure how I'm going to fix this yet. I could try and implement build caching in GitHub Actions to try and alleviate some of the problem, but in testing caching on my local machine it only saves a relatively small amount of time.

I do have a tentative plan, however, and it looks like this:

1. Upload image to CDN
2. Automation kicks in and generates all the size/formats necessary
3. Reference original image URL
4. Image shortcode generates the `<picture>` tag referencing the optimised versions on the CDN
5. Build server doesn't have to process a bajillion images
6. Much faster build times
7. Celebrations all round

The specifics need sorted out, but theoretically I could use Event Grid to detect the image upload in step 1, call an Azure Function in step 2 - potentially reusing the same image generation code I'm using right now. I just need to actually get around to doing it 😅