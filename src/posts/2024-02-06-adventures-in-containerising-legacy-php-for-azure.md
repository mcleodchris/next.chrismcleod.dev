---
title: Adventures in Containerising a Legacy PHP App for Azure
date: 2024-02-06T22:27Z
tags:
  - php
  - docker
  - containers
  - azure
  - developer
---
## Context
For the last 18 years or so I've been looking after a small, bespoke, PHP application for a small local business. It started off as a "hey, can you help someone I know with a problem? There might be something in it for you…" at my then-employer and all these years later it's still going.

It's best described as a "seasonal app"; once a year I'll be asked to do a little bit of work on it - a combination of tweaks and data loading, then it will be used moderately for a few months. Sometimes during that time I'll need to provide the occasional bit of support or bugfix. The owners don't really think of the app outside of this timeframe and the "budget" is essentially operating expenses and a kickback to me for my time. That is to say, the core of the app is largely the same foundations as when it was first written.

the app has been chugging along on a succession of DigitalOcean droplets for most of this time, somehow needing a more powerful spec every few years despite not becoming any more complex of an application. However, the major concern has been the increasing amount of hoop-jumping needed to keep it running on a new server. Without any real upgrades to speak of, it's running old versions of the frameworks and libraries it's built with, and these pretty much flat-out don't work on PHP 8+. Without the time or budget to migrate to newer frameworks or fix the bugs, this is a major risk for future server moves. After a painful database crash last year, that nearly wiped out everything during "peak time" I was looking for a way to preserve the app as it is now, but allow me to run it in a less fragile manner.

On top of this was a need to setup a proper local development environment that was consistent with "prod" and ran on Windows.[^1]

So, what's a aging, put-upon, web developer to do with a legacy application needing modernised, and little to no budget or time to do it in? Well, this sounds exactly like a scenario straight out of a "why you should use containers" sales pitch.

{% image "https://assets.chrism.cloud/chrismcleod.dev/docker-meme.png", "It works on my machine / Then we'll ship your machine / And that is how Docker was born" %}

[^1]: Look, I'm not proud of how much I've been winging it with this app for the last couple of years.
## Act 1: Running Locally
I figured the best way to start was with a working, containerised, local environment, then adapt that to go into production. Ideally I'd split things up so there was the entry-point to the app (NGINX) in one container, and the processing part (PHP-FPM) in a second container. Locally I'd also need a MySQL database container, though the plan was to have a managed database in prod. To begin with, I set my initial project structure:

```bash
.
├── conf
│   ├── nginx
│   ├── other
│   └── php-fpm
├── data
├── src
├── docker-compose.local.yml
└── docker-compose.yml
```

- conf/* holds any configuration files I need to add to the containers
- data is where MySQL data will be persisted
- src is where the application source code will go
- the 2 docker-compose files were placeholders; docker-compose.local.yml is for the local environment.

Getting the local environment was, ultimately, reasonably straightforward. The NGINX container ended up being the official, Alpine-based, image. For PHP-FPM, I needed to create a custom Dockerfile based off an official PHP 7 image, then add a few extensions and PHP Composer. Then wire it up in the docker-compose file with suitable environment variables. The resulting file ended up more-or-less like this (some details changed to keep it anonymous):

```yaml
version: "3.8"

services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./conf/nginx/site.conf:/etc/nginx/conf.d/default.conf
      - ./src:/var/www/html
    container_name: dev-nginx
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: mysupersecurerootpwd!
    ports:
      - "3306:3306"
    volumes:
      - ./data/db:/var/lib/mysql
    container_name: dev-mysql
  php:
    build:
      context: ./src
      dockerfile: Dockerfile
    volumes:
      - ./src:/var/www/html
    environment:
      CI_ENV: development
      CI_DB_HOST: db
      CI_DB_USER: local-user
      CI_DB_PASS: local-pwd
      CI_DB_NAME: dev_web
    container_name: dev-php
```
No, those passwords aren't the real thing 😉

The gist of this configuration is that it runs the services, using volumes to link certain files or folders into the containers as necessary to enable things to run: configuration files, data folders, source code. Linking the app source code into the containers like this means I don't need to rebuild the containers every time I make changes - everything will update in real time. I can run the application and edit it. So far, so good! This might be easier than I feared! I wonder what happens when I try to deploy it?
## Act 2: Attempting Deployment, aka, The Clown Show Begins
Obviously I couldn't deploy as-is - where would the source code go? Changes will be needed.

At this point I should explain what my deployment plans were: you'll have guessed from the title that Azure is involved, but more specifically, my initial plan was to use the Container Apps. The idea was to deploy an NGINX container as the main app container, and have PHP-FPM as a supporting container. Each container would be packaged up with a copy of the app source code so that requests could be routed and processed as required[^2]. Microservices, *yeah*![^3] I knew running multiple containers as part of one Container App "app" was possible, because I'd seen all the options when I'd created some other container apps.

With this plan in mind I created some new Dockerfiles to package up the required configs and source code for each container, built the images and pushed them up into an Azure Container Registry. So far, *somewhat* so good. Let's try to spin up the Container App…

My friends: I had not understood how Container Apps works. Communication between multi-container setups is possible, but only using HTTPS or Dapr. Not over, say, port 9000 for FastCGI connections. However, I did not realise this at first, so spent approximately 6 hours over 2 evenings trying to make it work: tweaking configurations in Azure and in the containers, rebuilding and pushing new versions of the images. It was exhausting and frustrating.

Then I tried to run the multi-container setup in the regular App Service - it's possible to give App Service a docker-compose file and have it deploy everything for you, and it runs somewhat similarly to on a regular computer. Only App Service just flat out refused to deploy the containers, so I tore it down and abandoned that plan because I was starting to feel quite aggravated.

It was at this point I realised I was going to have to bundle everything into one container image and run that instead of the two-container solution.

[^2]: This should probably have been my first clue that this approach was not the right one.
[^3]: No, this isn't actually Microservices.

## Act 3: Return of the Clown
So, a single container it is then. That's not too difficult to pull together? And it wasn't, really. Took keep things as small as possible I started with the PHP:7-fpm-alpine[^4] image, added the dependencies I needed, added NGINX, added the source code and configs, tested it with the local database, and it… worked! The app loaded, features worked, and generally everything seemed A-OK.

So I decided to test with the Production database, an Azure MySQL Flexible Server. MySQL on Azure requires using an SSL connection, so no problem: I downloaded the relevant certificate, added it to the container build, configured the connection in the app and started everything up again.

Things didn't just break, they broke so badly PHP would segfault the instant it tried to connect to the database. No error, no logs, just no response. Not just in the app itself, oh no; I tried manually connecting using the PHP interactive environment (`php -a`) bypassing any library interference and still it would crash and burn. Delving into the logs using `dmesg | grep segfault | tail -n 10` revealed the problem was "error 4 in libssl.so.1.1". Noting this library wasn't in the list of dependencies I'd added to the Dockerfile, I initially tried explicitly installing it and rebuilding. No dice.

After a lot of ~~googling~~ duck-duck-go-ing(?) I learned that there might be an incompatibility between the version of libssl linked to some of the libraries I was using and other components of Alpine. By this point I was tired, wanted the whole ordeal over with, and I didn't have the energy to start recompiling libraries left and right, so I stopped paying attention and decided to give up on an Alpine image.

[^4]: I actually started with a base Alpine:latest image but had to jump back so many versions just to get PHP 7 libraries installing that I figured I was as well using the official PHP image even though it's a year old.

## Act 4: Old Faithful To The Rescue
Debian. Good old, reliable, Debian. It might be old, uncool, and slightly bigger than we'd like (to all three of which I can relate) but it's rarely let me down.

Starting the consolidated container image all over again, I went with PHP:7-fpm as the base, which is in turn based on the not-slimmed-down version of Debian. I briefly tried the slim version but it threw an error when running a simple `apt-get update` so I immediately gave up on the idea. After a bit of tweaking to get config files in the right place - because of course different images have different ideas of where things go - I rebuilt and run the container locally *again* and got an application error! [Callooh! Callay!](https://www.poetryfoundation.org/poems/42916/jabberwocky) It was progress. I can work with an application error, as it means there's something I can fix.
## Act 5: The Final Boss
The problem was thus: the application was seemingly opening 2 database connections; one was successful, the other was failing to use SSL. I tracked this down to the main framework using its' own database code (using the MySQLi driver) for session management, and all other database operations going through an ORM which used a separate connection. After a bit of trial and error I figured the ORM could be so old it might not have implemented the necessary bits and pieces to make an SSL connection. But in investigating this I discovered it was at least possible to pass an existing PDO-based connection into the ORM and it would use that. The docs suggested it would have reduced functionality but core features would work - which was all I needed. After a bit more spelunking I determined that 1) it was possible to use a PDO driver with the main framework (and that it still worked with SSL), and 2) that once setup I could access that connection and pass it to the ORM.
## Act 6: Deployment, But For Real This Time?
With the necessary code changes made, and the container rebuilt, it was time to try deployment again. A new Container Apps instance was setup, all the secrets and other configuration entered, and the image deployed. After a moment for everything to spin up I checked the auto-generated URL to see if it worked - SUCCESS!

{% image "https://assets.chrism.cloud/chrismcleod.dev/boris.jpg", " A meme based on a scene from the 1995 James Bond movie GoldenEye. The person in the image is Boris Grishenko, a Russian hacker and one of the villains in the movie. He is played by actor Alan Cumming. He is standing in triumph, fists raised, and shouting 'Yes! I am invincible!'" %}

I'm not going to lie, I punched the air at this point, it had been such a slog. Cautiously I added the custom domain to ensure it all still worked under a new URL. Thankfully it did, and finally the app was containerised and fully switched over to its new cloud-based home.

Container Apps runs with a serverless model, so instead of paying a flat fee for the app to go unused during "off-season", like I was with the droplet, it will instead spin down after it's not used for a while. Spinning up again seems to take ~20-30 seconds on the first load, but that's acceptable enough, and it's plenty fast once it's up and running. 

Deploying any future bug fixes will be a case of running a few commands to build a new image, push it to the registry, then create a new revision in Container Apps. This can all be done through the CLI, so I should be able to script and automate it to some degree.

While it was - frankly - a pain in the arse to get this app containerised, I'm glad I got it done. The new home on Azure gives me some real benefits above the two mentioned above, and maybe buys some time to get a fully modernised version in the works, as I won't have to worry about aging out of compatibility any more or patching up the aging infrastructure any more. In an ideal world I'd have done this exercise sooner and used this year to start modernising it properly - but hindsight is a wonderful teacher!