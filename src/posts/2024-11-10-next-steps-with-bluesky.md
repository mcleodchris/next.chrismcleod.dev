---
title: Next steps with Bluesky - hosting your own data and more on the API
date: 2024-11-10T12:12Z
tags:
  - bluesky
  - social-media
  - apis
  - self-hosting
atUri: "at://did:plc:fcewtyqycu5qlt26tnbnan6h/site.standard.document/3mpyyqe4yts2p"
---

It's been a while since I wrote about Bluesky. My previous ["Hello World" for Bluesky][hw] was a quick overview of using the APIs to authenticate and post to Bluesky. It remains a popular post all these months later, and several people have let me know it helped get up and running with integrating with the AT protocol (ATproto) network[^1], which includes the Bluesky service.

[hw]: https://chrismcleod.dev/blog/a-hello-world-for-bluesky/the-at-protocol/

The thing is, ATproto/Bluesky have been growing a lot lately, and things have moved on very fast. Everything in that previous post still holds up and works, but there have been some interesting developments that warrant an update, namely: you can now host your own data. It's pretty straightforward too. It does have some implications for working with the APIs, which I'll get to shortly.

## Hosting your own ATproto/Bluesky data, and why you might want to

One of the big gripes against Bluesky is that it looks like another corporately owned social media network and not as open or federated as, say, Mastodon. That's partially true in my view[^2], but the situation is improving. The thing to remember is that it works in a different way to ActivityPub/Mastodon. The common comparison is ActivityPub = email, ATproto = websites. There's a bit more to it that I'm not getting into right now, but there's a [decent write-up by Rich MacManus on The New Stack][ns]. The important bit to understand is there are a few important components to ATproto:

[ns]: https://thenewstack.io/blueskys-at-protocol-pros-and-cons-for-developers/

- The [identifier directory](https://plc.directory) - think of it as ICANN in the network; currently centralised and owned by the Bluesky corp, but they say they are looking to spin this out into a standalone entity.
- The [Relay](https://atproto.com/guides/glossary#relay) - collects and caches data from the network, a bit like an RSS aggregator; you can self-host this if you want, but it's harder/more resource intensive, so the "main" one is controlled by the Bluesky corp but there are others out there.
- The [AppView](https://atproto.com/guides/glossary#app-view) - apps that view/post data in the network; you can self-host/build your own.
- The [PDS](https://atproto.com/guides/glossary#pds-personal-data-server) - where data is stored, such as user info and posts. Previously these were all controlled by the Bluesky corp, but now you can host your own and it's very straightforward.

The PDS is the bit we're interested in right now. It's where all your data is stored. When you self-host a PDS you can still use Bluesky the service, but all your posts and user information is stored on a server you control. I set mine up and it took roughly 20 minutes from start to finish (including DNS!) by using [this guide by Rafael Eyng][guide]. [The official guide][og] has you covered if you don't want to use the exact same setup as described by Rafael.

[guide]: https://rafaeleyng.github.io/self-hosting-a-bluesky-pds-and-using-your-domain-as-your-handle
[og]: https://atproto.com/guides/self-hosting

If you already have an account on Bluesky that's using their PDS servers (the default), you can [migrate to your self-hosted PDS][goat]. It's a little more involved, but still reasonably straightforward.

[goat]: https://whtwnd.com/bnewbold.net/3l5ii332pf32u

But why do this? The first is exercising that little bit of control over your data - you own the server, so you can back it up, export it, migrate it, etc, whenever you want to. If the Bluesky app goes down then you can still post to your PDS and it will appear on the network through other AppViews until Bluesky comes back online. If Bluesky corp ever goes full-Elon then your data is isolated. Assuming other Relays and AppViews come online then everyone can technically carry on by using "Greensky" or whatever alternative comes along. Some of [the developers are looking for volunteers](selhost) to help prove this out.

[selfhost]: https://alice.bsky.sh/post/3laega7icmi2q

## So what does this mean if I'm using the APIs to interact with Bluesky/ATproto?

From my limited testing, only a few 3rd-party apps are currently accounting for self-hosted PDS scenarios, so authenticating and e.g., posting doesn't work. It's improving though. The nice thing is, fixing this is reasonably straightforward from an API point of view. Simply put - you need to direct all API requests to the user's PDS instead of the Bluesky service (or other ATproto service). 

As an example, I've moved to using my own PDS at https://pds.chrismcleod.social, so that is where clients should send authentication requests to. Everything else about the request looks the same as it did, so if I update an example from my previous post, authenticating to my PDS will look like:

```bash
curl --location 'https://pds.chrismcleod.social/xrpc/com.atproto.server.createSession' \
--header 'Content-Type: application/json' \
--data '{
    "identifier": "chrismcleod.dev",
    "password": "<some-password>"
}'
```

And the response looks the same as before:

```json
{
  "did": "did:plc:<identifier>",
  "handle": "chrismcleod.dev",
  "email": "<email>",
  "accessJwt": "<JWT Token>",
  "refreshJwt": "<Refresh Token>"
}
```

From the frontend/user flow, you need to capture the PDS location somehow. It's technically possible to [look up a user's PDS from their handle][id], instead of asking them for their PDS address via user input. I haven't quite worked out how to demonstrate this in simple `curl` commands, but the [official SDKs][sdks] can deal with this if you want to skip ahead to inspecting those.

[id]: https://atproto.com/guides/identity
[sdks]: https://atproto.com/sdks

## But wait! There's OAuth!

OAuth support has been recently [added to the ATproto specification][spec]. It's so new I haven't had a chance to dive in and figure out how it works from a practical, developer, point of view. If you're more used to OAuth through integrating with more established services like GitHub or Twitter, this might be the better authentication method for your app than the app-password flow.

[spec]: https://atproto.com/specs/oauth

I can't give you any of my own examples here, but I can point you to useful resources I've found:

- [Official OAuth implementation guide](https://docs.bsky.app/docs/advanced-guides/oauth-client)
- [Official "building apps" quick-start](https://atproto.com/guides/applications) - uses OAuth
- [pilcrowonpaper/atproto-oauth-example](https://github.com/pilcrowonpaper/atproto-oauth-example)
- [zeucapua/myb](https://github.com/zeucapua/myb) - custom web client that implements OAuth

[^1]: Which in some circles we're now calling "the ATmosphere". Apparently.
[^2]: The big sticking point, IMHO, is the identifier directory. I compare it to ICAAN above, others compare it to the root DNS servers. Either way, while the main way of looking up entities in the Atproto network is controlled by a VC-funded corporation the network isn't fully "open". [You can mirror the directory](https://alice.bsky.sh/post/3laega7icmi2q), but if noone else is aware of the mirrors it feels largely pointless as anything other than a "maybe, just in case" backup exercise.