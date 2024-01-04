---
title: "Setting Up PHP (The Right Way*) on OS X"
date: 2012-08-25
categories:
  - articles
  - code-development
tags:
  - how-to
  - php
  - ruby
  - software
authors:
  - chris
archived: true
---

_\* By "The Right Way", I mean following the guidance and practices at the [PHP: the Right Way website](http://www.phptherightway.com/ "PHP: The Right Way"). I make no claims this is the "best" way :-)_

Mac OS X is a pretty good web developer OS. It comes as standard with PHP, [Ruby](http://www.ruby-lang.org/ "Ruby (programming language)") and [Apache](http://httpd.apache.org/ "Apache HTTP Server") all out of the box, and the underlying [UNIX](http://en.wikipedia.org/wiki/Unix) system makes it easy to add in other languages and components to suit your needs. On top of that, some of my favourite development tools are on the Mac, so unless I’m writing .NET code, nearly all my development is on an (ageing) Mac Mini. Mac Mini.

Now, while all that stuff comes as standard on OS X, lately it seems Apple has made it harder to get to. The versions shipped with OS X also tend to be a little behind the latest releases. As a result, most Devs I know use something like [MAMP](http://www.mamp.info/en/index.php "MAMP") to make the server-side of their environment as easy as running an app. Personally, while I think MAMP works, and is a good time-saver (and I've been using it for the last year or so), but I like to get into the nitty-gritty of the system and get things running "native". So last night I fired up the terminal and got PHP set up on my Mac with the latest version, and following the Right Way Guidelines. As a result I have [PHP 5.4](http://www.php.net "PHP"), Composer, the PHP Coding Standards Fixer, and [MySQL](http://www.mysql.com "MySQL") all setup quite slickly (i.e. to my preferences).

The whole process was pretty easy, but *does* involve the command line. If this makes you uncomfortable, then it might be best to skip the rest of this post.

**This all worked on my Mac, but I make no guarantees about it working on yours, and I'm not responsible if you break something.**

If you find any glaring problems with this guide then leave a comment/[get in touch](http://chrismcleod.me/about/ "About"), and I'll make any required edits.

### Step 1: Setup Your PATH

Edit the hidden .bash_profile file in your home directory. If you use [Sublime Text](http://www.sublimetext.com/ "Sublime Text") 2 you can use the following command:

subl ~/.bash_profile

[TextMate](http://www.macromates.com/ "TextMate") has a similar `mate` command, or you can use `vi(m)`/`nano`/`emacs`/whatever.

It's possible you already have a line defining your PATH variable. It'll look something like `export PATH=<something>`. I've found it most useful to change the PATH so `/usr/local/bin` is at the start, making sure anything you install there is used over the system defaults in /bin. Add this as a line below your existing PATH definition (or just add it in, if you don't have an existing line):

```bash
export PATH=/usr/local/bin:${PATH}
```

### Step 2: Install Brew

Strictly speaking, Brew (aka Homebrew) isn't required, but I used it to install MySQL later, and it does make it stupid easy to install stuff into OS X. I think you should install it. [The best instructions are found on the Homebrew home page, so go have a read there](http://mxcl.github.com/homebrew/). There are a few pre-requisites, but nothing too difficult.

### Step 3: Install PHP-OSX

Now we're beginning to get somewhere! [PHP-OSX](http://php-osx.liip.ch/) is the latest versions of PHP compiled for OSX by Liip. Installation is a real doddle, from the command line:

```bash
curl -s http://php-osx.liip.ch/install.sh | bash -s 5.4
```

Follow the prompts given, including entering your password. After a few moments everything will have installed. For convenience I created a symbolic link to the newly installed PHP binary in `/usr/local/bin`:

```bash
ln -s /usr/local/php5/bin/php /usr/local/bin/php
```

### Step 4: Install Composer

Now we have PHP installed, it's time to look at the nice-to-haves, like a good package/dependency manager. [Composer](http://getcomposer.org/) is relatively new on the block, and allows others to download your code and automatically grab any dependencies by running a simple command.

You can install Composer in your project, or you can install it globally. I prefer globally. As with PHP, installation is simple, from the command line:

```bash
curl -s http://getcomposer.org/composer.phar -o /usr/local/bin/composer
chmod +x /usr/local/bin/composer
```

### Step 5: Install PHP Coding Standards Fixer

Another nice-to-have, this little tool will try to find and fix parts of your code where it does not conform to one of the [PHP Coding Style Guides](http://www.phptherightway.com/#code_style_guide). Installation is almost identical to Composer:

```bash
curl http://cs.sensiolabs.org/get/php-cs-fixer.phar -o /usr/local/bin/php-cs-fixer
chmod +x /usr/local/bin/php-cs-fixer
```

### Step 6: Install MySQL

If you installed Brew in step 2, then you're good to go with this little command:

```bash
brew install mysql
```

It'll take a few minutes, but you shouldn't need to intervene at all. Once done you will need to run two more command to setup the MySQL tables:

```bash
unset TMPDIR
mysql_install_db --verbose --user=\`whoami\` --basedir="$(brew --prefix mysql)" --datadir=/usr/local/var/mysql --tmpdir=/tmp
```

If you didn't install Brew, then you will need to install MySQL through some other means, such as packages on the MySQL website. I can't help you with that, I'm afraid.

For managing MySQL, I use the excellent [Sequel Pro](http://www.sequelpro.com/ "Sequel Pro"), which is a successor to the venerable CocoaSQL.

As a next step you should look into changing the root password of your MySQL setup. This is a local dev environment, and likely only used locally by yourself, but it's the proper thing to do.

### Errata

- Pear doesn't seem to work, which is slightly annoying, but (to me) no real biggie. I didn't test this with the built-in version of PHP, so I don't know whether it worked beforehand. I'll post an update once I figure it out.
- I'd like to make bash script smart enough to stop MySQL when the PHP web server stops, but my early attempts haven't managed to get this working (most likely due to the Ctrl-C used to stop the web server also stopping the script).
- Throughout this process we're running scripts directly from the web. This is pretty risky behaviour, especially with unknown/untrusted sources. You should always take a look at the raw script before running it, so you don't get hit by something malicious.
