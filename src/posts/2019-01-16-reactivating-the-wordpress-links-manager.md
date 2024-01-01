---
title: "Reactivating the Wordpress Links Manager"
date: 2019-01-16
categories:
  - notes
authors:
  - chris
archived: true
---

Following on from [my last bookmark](/blog/bookmarked-how-to-start-your-own-little-directory-on-wordpress-for-free/), it seems to be really simple to reactivate the built-in Links Manager for WordPress. Just add the following to your theme's `functions.php`:

```php

/**
 * Re-enable the built-in Links manager
 */
add_filter( 'pre_option_link_manager_enabled', '__return_true' );
// Add Shortcode
add_shortcode( 'links', 'wp_list_bookmarks' );
```

I haven't checked to see if there are any "gotcha's" with this, but it seems to work as expected. Once done, add the shortcode `[[links]]` to a page, passing in any parameters [as per wp_list_bookmarks()](https://codex.wordpress.org/Template_Tags/wp_list_bookmarks).

[I've already added this to K](https://github.com/MrKapowski/k-theme/blob/90faebfe2e01bcccd353a2ca276ddcc93d439a50/inc/template-functions.php#L156).

**Update 18/Jan/2019:** After some further testing, the shortcode doesn't actually work very well, so I don't recommend you use that. I've switched my Links page to use a page template which calls `wp_list_bookmarks()` directly instead. The Links Manager still works, though I had some early issues with assigning categories… deleting them and starting over seemed to fix whatever internal taxonomy relationship was broken. I'm going to leave the Links Manager activation filter in K, but I've removed the shortcode.
