---
title: "Using Cloudflare and Mailgun to Forward Email"
date: 2017-09-24
categories:
  - articles
  - notes
authors:
  - chris
archived: true
tags:
  - personal
  - email
  - how-to
---

Recently I've been "[sunsetting](/blog/sunsetting-a-decades-old-email-address.markdown)" old email accounts I don't really need any more. One of them was a private domain, and was hosted with Fastmail. In most cases I could have set up a simple forwarding rule from my domain registrar to my master email, but this one domain made extensive use of subdomains to filter and "tag" email from services -- i.e. _user@service.domain.com_. Forwarding from the registrar would only catch mail at the top level. Everything else would return an error to the sender[^1]. If I were to move the DNS to Cloudflare, like my other "active" domains, I wouldn't be able to do even this basic forwarding; I'd have to setup my own mail server to handle the domain.

Running your own email server, in 2017, is a fool's errand. I needed to find another way.

After a few evenings research, and weighing the pro's and con's of each approach, I settled on using [Mailgun](https://www.mailgun.com/) to route email[^2].

### Step 1. Mailgun

Create your Mailgun account. Add your domain. Mailgun will encourage you to use a subdomain, but I didn't. During the setup, you'll be presented with several DNS records you need to add to Cloudflare - 2 `TXT` records, 2 `MX` records, and a `CNAME` record. Leave this tab open for now.

### Step 2. Cloudflare

Add the domain to Cloudflare, if you haven't already. Modify the DNS records to remove any previous `MX` records and add in the details Mailgun gave you. To get the subdomain email addresses to work, you also need to add 2 more `MX` records similar to these:

```text
MX    *.domain.com    mxa.mailgun.org    10
MX    *.domain.com    mxb.mailgun.org    10
```

For some reason I also needed to add a wildcard `A` record (`*.domain.com`) to get things to work correctly. This might be a Cloudflare quirk.

### Step 3. Back to Mailgun

Click through to finish adding the domain to your Mailgun account. Depending on DNS propegation timings, you might need to click the "Check DNS Records" button a couple of hours later, to verify the domain (usually it will only be minutes). Under Domain Settings, change _Wildcard Domain_ to _On_.

Switch to the _Routes_ screen. Create a Route. A "Catch All" type should be fine, but you can check out the Mailgun documentation to define more complex rules. Make sure the _Forwarding_ checkbox is ticked, and enter your master email address as the destination. Set the priority to 10, give the _Route_ a name, and click _Create Route_.

Use the _Test Your Routes_ box to, well, test the route with a sample email address to make sure it will fire appropriately.

### Step 4. There is no Step 4.

At this point you should be done. I needed to wait a few hours for the DNS records to propegate out to other services before test emails would arrive properly. But once DNS did its thing I was receiving email to my master address just like I had been in Fastmail.

[^1]: GMail, for example, tells you the subdomain doesn't accept mail, using a nice, clear message. Other services are usually far less helpful.
[^2]: Note that Mailgun appears to [discourage you](https://documentation.mailgun.com/en/latest/faqs.html#can-i-use-mailgun-for-my-personal-email-address) from using their service like this.
