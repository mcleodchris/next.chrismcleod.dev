---
title: "The Joy of HTML"
date: 2009-09-05
categories:
  - articles
tags:
  - data-formats
  - hcard
  - html
  - html-element
  - javascript
  - languages
  - markup-language
  - markup-languages
  - php
  - programming
  - source-code
authors:
  - chris
archived: true
---

The beauty of web development is that, ultimately, the code behind it is simple. Yes, web apps have taken leaps and bounds over the last few years, and are capable of so much more than ever before, but lets face it – we’re not exactly writing DNA sequencers. Yet.

It frustrates me when I find someone has made life difficult for themselves or the person who will inherit their code, by using the wrong tool for the job. I’m not claiming to be a saint here either – I often look back at some of my own code and shudder (it helps keep me right in the future!).

Consider the following snippet, from the View (presentation) file of an [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) app I inherited:

```php
<?php
echo "<h1>$category</h1>";
echo "<h3>$company ($name)</h3>";
echo "<p>";
echo "$address<br />";
echo "$town<br />";
echo "$city<br />";
echo "$post\_code<br />";
echo "$phone<br />";
echo "$email<br />";
echo "</p>";
echo "<br />";
echo "<br />";
?>
```

PHP needs to be used to output the data passed from the Controller, yes, but there’s no need for it to be outputting the HTML too. Let HTML itself worry about that!

```html
<h1><?= $category ?></h1>
<div>
  <h3>
    <?= $company ?>
    (<span><?= $name ?></span>)
  </h3>
  <address>
    <span><?= $address ?></span>
    <span><?= $town ?></span>
    <span><?= $city ?></span>
    <span><?= $post\_code ?></span>
    <span><?= $phone ?> </span>
    <span><?= $email ?></span>
  </address>
</div>
```

I don’t know about you, but the HTML-based version above is easier to follow and spot coding errors. No doubt someone will point out there’s more HTML tags/bytes in this example than the first, but that is because I coded it with semantics and [microformats](http://www.microformats.org/) in mind; add in the right classes and you suddenly have a [hCard](http://microformats.org/wiki/hcard).

Possibly more importantly in my mind, the HTML example is easier to follow for someone who isn’t PHP literate, like many front-end designers I know.

I’m picking on this example as it’s the most recent I’ve come across, and the first to come hand. It’s not the first example I’ve come across, it won’t be the last, and it’s certainly not the worst!

Pure, simple HTML can be a wondrous thing. Lets try not to spoil it by abusing it with our fancy server-side languages. K.I.S.S!
