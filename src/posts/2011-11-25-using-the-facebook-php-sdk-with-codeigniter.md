---
title: "Using the Facebook PHP SDK with CodeIgniter"
date: 2011-11-25
categories:
  - articles
  - code-development
tags:
  - api
  - codeigniter
  - facebook
  - open-graph
  - php
  - programming
  - sdk
  - web-development
authors:
  - chris
archived: true
---

Most of my small personal projects tend to get built with [CodeIgniter](http://codeigniter.com), which is a simple to use, fast, lightweight PHP5 MVC framework.

For a while now I’ve had an itch to build something fun against [the Facebook API](https://developers.facebook.com/) so I can start learning how [Open Graph](https://developers.facebook.com/docs/beta) works, and as a primer to building a “proper” Facebook integrated application. I also realised I hadn’t actually tried using CodeIgniter 2.x since it was released (quite some time ago). With an abundance of free time this weekend it seemed like the perfect time to get hacking!

Before I could build anything I would need to know one thing: just how do you connect a CodeIgniter app to Facebook?

The answer is surprisingly simple. You will need:

- [The Facebook PHP SDK](https://github.com/facebook/php-sdk "Facebook PHP SDK on GitHub")
- [CodeIgniter (v2.1 at the time of writing)](https://github.com/EllisLab/CodeIgniter "CodeIgniter source code on GitHub")
- 5 minutes

Start by extracting both downloads to their own directories. Next, copy the two [PHP](http://www.php.net/ "PHP") files from `facebook_SDK_path/src/` to `CodeIgniter_path/application/library/`. To stick to the CI conventions you should capitalise the filename of facebook.php, so it becomes Facebook.php.

The Facebook class expects some configuration details to be passed to it on initialisation. To make this seamless with CodeIgniter's `$this->load->library()` method we need to create a custom config file. Create the file  `CodeIgniter_path/application/config/Facebook.php` (note the capital letter), with the following contents:

```php
<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
$config = array(
'appId' => getenv('FACEBOOK\_APP\_ID'),
'secret' => getenv('FACEBOOK\_SECRET'),
);
```

You'll notice I'm using `getenv()` to access my Application's ID and Secret. That's because I have them stored in my Virtual Host config, but you can just as easily specify the values directly in this file.

Right, so far, so good. The SDK files are in place, and the config file is setup. This allows us to simply use the following to load our SDK into our controller:

`$this->load->library('Facebook');`

Alternatively you can add 'facebook' to your libraries array in the autoload.php file.

`$autoload\['libraries'\] = array('session','facebook');`

Once loaded, making API calls is as simple as this:

```php
// See if there is a user from a cookie
$user = $this->facebook->getUser();
```

## Sample Usage

Below I have replicated the `with_js_sdk.php` example file in the Facebook SDK, as a CodeIgniter controller action/view (replacing the default CI welcome message)

### Controller

```php
<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Welcome extends CI\_Controller {
private $data = array();
/\*\*
\* Index Page for this controller.
\*
\* Maps to the following URL
\* http://example.com/index.php/welcome
\* - or -
\* http://example.com/index.php/welcome/index
\* - or -
\* Since this controller is set as the default controller in
\* config/routes.php, it's displayed at http://example.com/
\*
\* So any other public methods not prefixed with an underscore will
\* map to /index.php/welcome/
\* @see http://codeigniter.com/user\_guide/general/urls.html
\*/

public function index()
{
$this->load->library('facebook');
$user = null;
$user\_profile = null;

// See if there is a user from a cookie
$user = $this->facebook->getUser();

if ($user) {
try {
// Proceed knowing you have a logged in user who's authenticated.
$user\_profile = $this->facebook->api('/me');
} catch (FacebookApiException $e) {
show\_error(print\_r($e, TRUE), 500);
}
}

$this->data\['facebook'\] = $this->facebook;
$this->data\['user'\] = $user;
$this->data\['user\_profile'\] = $user\_profile;

$this->load->view('welcome\_message', $this->data);
}

}

/\* End of file welcome.php \*/
/\* Location: ./application/controllers/welcome.php \*/

### View

<!DOCTYPE html>
<html xmlns:fb="http://www.facebook.com/2008/fbml">
<body>
<?php if ($user) { ?>

Your user profile is

<pre>
<?php print htmlspecialchars(print\_r($user\_profile, true)) ?>
</pre>
<?php echo anchor($facebook->getLogoutUrl(), 'Logout'); ?>
<?php } else { ?>

<fb:login-button></fb:login-button>

<?php } ?>
<div id="fb-root"></div>
<script>
window.fbAsyncInit = function() {
FB.init({
appId: '<?php echo $facebook->getAppID() ?>',
cookie: true,
xfbml: true,
oauth: true
});
FB.Event.subscribe('auth.login', function(response) {
window.location.reload();
});
FB.Event.subscribe('auth.logout', function(response) {
window.location.reload();
});
};
(function() {
var e = document.createElement('script'); e.async = true;
e.src = document.location.protocol +
'//connect.facebook.net/en\_US/all.js';
document.getElementById('fb-root').appendChild(e);
}());
</script>
</body>
</html>
```

If you run this code you will get a lovely print-out of the JSON data representing your Facebook account,  as returned by the [Graph API](https://developers.facebook.com/docs/reference/api "Graph API documentation on the Facebook Developer Portal"). I added in the logout link so you can test the normal user process of logging in.

There's a few things I'm going to clean up in the above. Namely I'm not too keen on passing our instance of the `Facebook()` class to the view. I'd rather create a helper file and move the stuff we need to access (AppID, logout url, etc) into a couple of functions within that... but it's simple enough to do this. The point of the above code was simply to replicate one of the official samples within CodeIgniter.

## What Next?

It strikes me that most of the uses of the SDK (i.e. to get information about the visiting user), would fit best into the Model part of the CI application. To this end I'll probably start implementing it and see how it turns out. If it's successful I'll post the code here sometime over the weekend.
