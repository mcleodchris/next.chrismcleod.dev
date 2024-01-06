---
title: 'A "Hello World" for bluesky/the AT protocol'
date: 2023-05-11
categories:
  - projects
tags:
  - programming
  - bluesky
  - learning
  - social-media
authors:
  - chris
redirectFrom: ['/2023/05/11/a-hello-world-for-bluesky-the-at-protocol/']
---

## Preamble

I've been [using bluesky for the last few days now](https://chrismcleod.dev/2023/05/03/quick-fire-thoughts-on-bluesky/). I quite like it. It has early-Tumblr-crossed-with-Twitter vibes, with plenty of people using the freedom of a small, semi-closed beta to just be weird online.

I finally got around to having a very quick play with [the AT protocol](https://atproto.com/), after a skim of [the documentation](https://atproto.com/docs). The good news is that it's essentially schema'd JSON over HTTPS - which is handy, because that's essentially what I spent most of last year working on, in a different context. The two parts I've focussed on for now are [Lexicons](https://atproto.com/guides/lexicon) (the schema bit) and [XPRC](https://atproto.com/specs/xrpc) (the JSON over HTTPS bit).

I've documented my baby steps with the protocol below with a few examples - essentially: authenticate, post a "Hello World!" skeet, then reply to that skeet (no, I don't know why they're referred to as "skeets"), and get some author information. I've done these initial experiments with Postman/cURL, so that I didn't have to faff around with setting up any sort of language or framework tooling. After all, it is just HTTPS. Hopefully you can translate them into your tool of choice.

---

**Note** - you will need a bluesky account for this to work, which needs an invite if you don't already have one. Sorry, I can't help you get one, as I haven't been given any yet.

---

All requests are either GET or POST. Methods always use [reverse DNS notation](https://atproto.com/specs/nsid) as a naming convention, and are under /xprc. The endpoint is of the form `https://<server>/xprc/NSID` - for example `https://bsky.social/xrpc/com.atproto.server.createSession` is the endpoint for, well, creating a session. All current methods are listed in the documentation. Some of those listed are low-level methods (`com.atproto.*`), while others are wrappers over those which should make things easier (`app.bsky.*`). I couldn't get some of the higher-level methods to work, so much of what's below uses those lower-level methods. I guess this reinforces that everything is still a work in progress when it comes to AT protocol.

Without further ado, let's dive in!

## Example 1: Authenticate

Authentication is reasonably straightforward. We POST a JSON object with our identifier (username) and a password, then get a JSON object back with our token and other information. You could use your regular password for playing around like this, but I **highly recommend you get in the habit of using an App Password**, which can be generated from your bluesky account settings. As a cURL command, it looks something like this:

### Request

```bash
curl --location 'https://bsky.social/xrpc/com.atproto.server.createSession' \
--header 'Content-Type: application/json' \
--data '{
    "identifier": "chrismcleod.dev",
    "password": "<some-password>"
}'
```

### Response

```json
{
  "did": "did:plc:<identifier>",
  "handle": "chrismcleod.dev",
  "email": "<email>",
  "accessJwt": "<JWT Token>",
  "refreshJwt": "<Refresh Token>"
}
```

Other than the `accessJWT`, which you'll need to pass in future requests for authentication purposes, the most interesting thing in the response is the `did` property - this is your distributed identifier, and is needed for storing posts in your [user repository](https://atproto.com/guides/data-repos). Make a note of both the `did` and `accessJwt`. (I stored both as variables in Postman, to make things easier)

## Example 2: Post

Now we have our authentication token and identifier, we can write a new post to our repository. We're going to use `com.atproto.repo.createRecord` to achieve this. To do this, our JSON needs to specify:

- The `collection` we're writing to

- The `repo` that repo is located in

- The `record` object we are creating

Posts record objects use the [app.bsky.feed.post](https://atproto.com/lexicons/app-bsky-feed#post) type, so we must declare that in our record object. Other required fields in the Post record are `text` and `createdAt`. For Posts, the record `$type` is also the collection type. The repo is your `did` from earlier. Put together, the complete payload looks like this:

```json
{
  "collection": "app.bsky.feed.post",
  "repo": "<myDID>",
  "record": {
    "text": "Hello World!",
    "createdAt": "<$isoTimestamp>",
    "$type": "app.bsky.feed.post"
  }
}
// The values enclosed in < > are Postman variables - substitute with your own values, without the curly braces.
```

There are other properties we can add to our bluesky Post, but I'm not going to get into them in this blog post, other than the `reply` property which is covered below. Take a look at the docs page linked above for more details.

### Request

Putting our payload and authentication token together, we get a cURL command similar to this:

```bash
curl --location 'https://bsky.social/xrpc/com.atproto.repo.createRecord' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token>' \
--data '{
    "collection": "app.bsky.feed.post",
    "repo": "did:plc:<identifier>",
    "record": {
        "text": "A test post made using info from the ATproto docs",
        "createdAt": "2023-05-11T14:06:27.499Z",
        "$type": "app.bsky.feed.post"
    }
}'
```

### Response

The response will contain an `at://` protocol URI to your new post, as well as the signature (`cid`), and look something like this:

```json
{
  "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvh2rw5ua22y",
  "cid": "bafyreibmcnkzbxtciyydktbatjlpgh5hollpov4zvpwtaaq353vyzfbxwu"
}
```

You will need both of these to make your reply, so copy the entire object from your own response.

## Example 3: Reply to our post

Replies are essentially just regular Posts, they just have an extra `reply` property which pins them to the conversation tree. This property is an object with two properties: `root` and `parent`. `root` is the very first message in the thread - the one everything else is a descendant of. `parent` is the specific message you are replying to, which might be nested several layers deep. Taking the following example:

1. Post 1
   - Reply 1
   - Reply 2
     - Reply 3
   - Reply 4

For any reply in this tree, `root` will always be a reference to Post 1, and `parent` will be a reference to, e.g. Reply 3, or whichever post you are replying to. Because we are replying to our own Hello World message from above, both `root` and `parent` will be references to the same Post. As such, to reply to our own message, our Reply payload would look like this:

```json
{
  "collection": "app.bsky.feed.post",
  "repo": "<myDID>",
  "record": {
    "text": "Hello, Hello World",
    "createdAt": "<$isoTimestamp>",
    "reply": {
      "root": {
        "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvh2rw5ua22y",
        "cid": "bafyreibmcnkzbxtciyydktbatjlpgh5hollpov4zvpwtaaq353vyzfbxwu"
      },
      "parent": {
        "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvh2rw5ua22y",
        "cid": "bafyreibmcnkzbxtciyydktbatjlpgh5hollpov4zvpwtaaq353vyzfbxwu"
      }
    },
    "$type": "app.bsky.feed.post"
  }
}
```

I've highlighted the new part of the message. The full request looks like:

### Request

```bash
curl --location 'https://bsky.social/xrpc/com.atproto.repo.createRecord' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token>' \
--data '{
    "collection": "app.bsky.feed.post",
    "repo": "did:plc:<identifier>",
    "record": {
        "text": "Hello, Hello World!",
        "createdAt": "2023-05-11T15:59:08.600Z",
        "reply": {
            "root": {
                "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvh2rw5ua22y",
                "cid": "bafyreibmcnkzbxtciyydktbatjlpgh5hollpov4zvpwtaaq353vyzfbxwu"
            },
            "parent": {
                "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvh2rw5ua22y",
                "cid": "bafyreibmcnkzbxtciyydktbatjlpgh5hollpov4zvpwtaaq353vyzfbxwu"
            }
        },
        "$type": "app.bsky.feed.post"
    }
}'
```

### Response

Server responses to Replies are the same as to Posts - an object containing the `uri` and `cid`:

```json
{
  "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvh33tthzm27",
  "cid": "bafyreifh4xinbvqujmrbc6unyyhhefn4x6dg3cieutk5u5sp4b6c7hmcki"
}
```

## Example 4: Listing User Posts

Now we're creating posts, how do we list posts by a given user ? Using a GET to `[/xprc/app.bsky.feed.getAuthorFeed](https://atproto.com/lexicons/app-bsky-feed#appbskyfeedgetauthorfeed)`, passing the author handle as as parameter called `actor`. You still need to use your authentication token as a header. By default you will pull back 50 posts. This can be changed using a `limit` parameter, with a min of 1 and max of 100:

### Request

```bash
curl --location 'https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed?actor=chrismcleod.dev&limit=5' \
--header 'Authorization: Bearer <token>'
```

### Response

The response includes details of the author's posts, as well as any posts they were in reply to:

```json
{
  "feed": [
    {
      "post": {
        "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvhatmjm6u2z",
        "cid": "bafyreicej3vuls22l5tli5aycnnxebap77vvczc43o73g6px34q6uinibq",
        "author": {
          "did": "did:plc:fcewtyqycu5qlt26tnbnan6h",
          "handle": "chrismcleod.dev",
          "displayName": "Chris M",
          "avatar": "https://cdn.bsky.social/imgproxy/42qD9eitqqNjGc7IXG6e13lmN2IH_m9RqUTH1ih-oDQ/rs:fill:1000:1000:1:0/plain/bafkreigc4hh664b524ku2tbkrsubserosqqlj3tsxuqxpg72lbng3xcfay@jpeg",
          "viewer": {
            "muted": false,
            "blockedBy": false
          },
          "labels": []
        },
        "record": {
          "text": "thing is, I'm sure it changes per manufacturer! Last toaster was \"toastiness\", current is time",
          "$type": "app.bsky.feed.post",
          "reply": {
            "root": {
              "cid": "bafyreie4477tqvjkwffgmwfhcgd4zjuw73xesmpfkcwylucn6xijyfjgha",
              "uri": "at://did:plc:aeh5xvhpva7ksoialzs4o77y/app.bsky.feed.post/3jvhacxqpqh2n"
            },
            "parent": {
              "cid": "bafyreie4477tqvjkwffgmwfhcgd4zjuw73xesmpfkcwylucn6xijyfjgha",
              "uri": "at://did:plc:aeh5xvhpva7ksoialzs4o77y/app.bsky.feed.post/3jvhacxqpqh2n"
            }
          },
          "createdAt": "2023-05-11T11:57:59.203Z"
        },
        "replyCount": 0,
        "repostCount": 0,
        "likeCount": 0,
        "indexedAt": "2023-05-11T11:57:59.435Z",
        "viewer": {},
        "labels": []
      },
      "reply": {
        "root": {
          "uri": "at://did:plc:aeh5xvhpva7ksoialzs4o77y/app.bsky.feed.post/3jvhacxqpqh2n",
          "cid": "bafyreie4477tqvjkwffgmwfhcgd4zjuw73xesmpfkcwylucn6xijyfjgha",
          "author": {
            "did": "did:plc:aeh5xvhpva7ksoialzs4o77y",
            "handle": "mzbat.bsky.social",
            "displayName": "bat 🦇",
            "avatar": "https://cdn.bsky.social/imgproxy/DCZNdq7mkezO6MIIKOkj4JIxpwvr6ihrVD3mQy_1gAY/rs:fill:1000:1000:1:0/plain/bafkreia3rwn5fvkd3vw5pc6aipivac6tfcbk3ma6qjjymxwzsse2dnjuxa@jpeg",
            "viewer": {
              "muted": false,
              "blockedBy": false,
              "following": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.graph.follow/3justmfnnia2v",
              "followedBy": "at://did:plc:aeh5xvhpva7ksoialzs4o77y/app.bsky.graph.follow/3jut3rhljvo2m"
            },
            "labels": []
          },
          "record": {
            "text": "All this time I thought the number dial on the toaster was the level of toastiness but it’s really just the number of minutes to cook? I’m flabbergasted.",
            "$type": "app.bsky.feed.post",
            "createdAt": "2023-05-11T11:48:40.559Z"
          },
          "replyCount": 4,
          "repostCount": 0,
          "likeCount": 11,
          "indexedAt": "2023-05-11T11:48:40.795Z",
          "viewer": {
            "like": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.like/3jvharu3yuk26"
          },
          "labels": []
        },
        "parent": {
          "uri": "at://did:plc:aeh5xvhpva7ksoialzs4o77y/app.bsky.feed.post/3jvhacxqpqh2n",
          "cid": "bafyreie4477tqvjkwffgmwfhcgd4zjuw73xesmpfkcwylucn6xijyfjgha",
          "author": {
            "did": "did:plc:aeh5xvhpva7ksoialzs4o77y",
            "handle": "mzbat.bsky.social",
            "displayName": "bat 🦇",
            "avatar": "https://cdn.bsky.social/imgproxy/DCZNdq7mkezO6MIIKOkj4JIxpwvr6ihrVD3mQy_1gAY/rs:fill:1000:1000:1:0/plain/bafkreia3rwn5fvkd3vw5pc6aipivac6tfcbk3ma6qjjymxwzsse2dnjuxa@jpeg",
            "viewer": {
              "muted": false,
              "blockedBy": false,
              "following": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.graph.follow/3justmfnnia2v",
              "followedBy": "at://did:plc:aeh5xvhpva7ksoialzs4o77y/app.bsky.graph.follow/3jut3rhljvo2m"
            },
            "labels": []
          },
          "record": {
            "text": "All this time I thought the number dial on the toaster was the level of toastiness but it’s really just the number of minutes to cook? I’m flabbergasted.",
            "$type": "app.bsky.feed.post",
            "createdAt": "2023-05-11T11:48:40.559Z"
          },
          "replyCount": 4,
          "repostCount": 0,
          "likeCount": 11,
          "indexedAt": "2023-05-11T11:48:40.795Z",
          "viewer": {
            "like": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.like/3jvharu3yuk26"
          },
          "labels": []
        }
      }
    },
    {
      "post": {
        "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvh5cu7lzv2h",
        "cid": "bafyreibambjl4tbpgacmq5kofs6xfgkamjut2vkuql3zpe7dydvf4ykafm",
        "author": {
          "did": "did:plc:fcewtyqycu5qlt26tnbnan6h",
          "handle": "chrismcleod.dev",
          "displayName": "Chris M",
          "avatar": "https://cdn.bsky.social/imgproxy/42qD9eitqqNjGc7IXG6e13lmN2IH_m9RqUTH1ih-oDQ/rs:fill:1000:1000:1:0/plain/bafkreigc4hh664b524ku2tbkrsubserosqqlj3tsxuqxpg72lbng3xcfay@jpeg",
          "viewer": {
            "muted": false,
            "blockedBy": false
          },
          "labels": []
        },
        "record": {
          "text": "TBH, I'm kinda glad this didn't work 😂\n\nI didn't expect it to, but if you stick something in the protocol called `createInviteCode`, you better believe I'm going to give it a try!",
          "$type": "app.bsky.feed.post",
          "embed": {
            "$type": "app.bsky.embed.images",
            "images": [
              {
                "alt": "A screenshot of an API call made to the createInviteCode AT protocol endpoint. It was unsuccessful due to lack of authorisation",
                "image": {
                  "$type": "blob",
                  "ref": {
                    "$link": "bafkreicl4wg7bfqecuy5mvw6ygzgxrz7qll22oxupgsp6v6m6sc2iypuzy"
                  },
                  "mimeType": "image/jpeg",
                  "size": 225657
                }
              }
            ]
          },
          "createdAt": "2023-05-11T10:54:55.583Z"
        },
        "embed": {
          "$type": "app.bsky.embed.images#view",
          "images": [
            {
              "thumb": "https://cdn.bsky.social/imgproxy/Dx4hVByyiOlNRTyDaOHP0lm8nyc2ElLfEcQ5TOSB0BY/rs:fit:1000:1000:1:0/plain/bafkreicl4wg7bfqecuy5mvw6ygzgxrz7qll22oxupgsp6v6m6sc2iypuzy@jpeg",
              "fullsize": "https://cdn.bsky.social/imgproxy/LQ6Ni5920A63RVdwkUoKZnWM15PjVFcRwz_atFOnOr4/rs:fit:2000:2000:1:0/plain/bafkreicl4wg7bfqecuy5mvw6ygzgxrz7qll22oxupgsp6v6m6sc2iypuzy@jpeg",
              "alt": "A screenshot of an API call made to the createInviteCode AT protocol endpoint. It was unsuccessful due to lack of authorisation"
            }
          ]
        },
        "replyCount": 0,
        "repostCount": 0,
        "likeCount": 2,
        "indexedAt": "2023-05-11T10:54:55.856Z",
        "viewer": {},
        "labels": []
      }
    },
    {
      "post": {
        "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvh3fd5mrg2x",
        "cid": "bafyreiatii5cpouvemlcdpxbi3ulh2joap2rilqd7dtuvuzt4g5qqz7m3q",
        "author": {
          "did": "did:plc:fcewtyqycu5qlt26tnbnan6h",
          "handle": "chrismcleod.dev",
          "displayName": "Chris M",
          "avatar": "https://cdn.bsky.social/imgproxy/42qD9eitqqNjGc7IXG6e13lmN2IH_m9RqUTH1ih-oDQ/rs:fill:1000:1000:1:0/plain/bafkreigc4hh664b524ku2tbkrsubserosqqlj3tsxuqxpg72lbng3xcfay@jpeg",
          "viewer": {
            "muted": false,
            "blockedBy": false
          },
          "labels": []
        },
        "record": {
          "text": "Well that was a fun hour or so of tinkering around with the protocol to figure out the basics. Some of the lexicon is a little verbose for my tastes, better verbose than ambiguous, I guess.\n\nNow to use this knowledge for good/evil",
          "$type": "app.bsky.feed.post",
          "embed": {
            "$type": "app.bsky.embed.images",
            "images": [
              {
                "alt": "",
                "image": {
                  "$type": "blob",
                  "ref": {
                    "$link": "bafkreick25qjy6l75xlied3b5ozxl3r6xq54xlks5pacud2ububm3aamve"
                  },
                  "mimeType": "image/jpeg",
                  "size": 98914
                }
              }
            ]
          },
          "createdAt": "2023-05-11T10:20:30.929Z"
        },
        "embed": {
          "$type": "app.bsky.embed.images#view",
          "images": [
            {
              "thumb": "https://cdn.bsky.social/imgproxy/9TcZtC0w98I4uQ1DSNBssgw2u1b7fgp4bY7qB78oNxI/rs:fit:1000:1000:1:0/plain/bafkreick25qjy6l75xlied3b5ozxl3r6xq54xlks5pacud2ububm3aamve@jpeg",
              "fullsize": "https://cdn.bsky.social/imgproxy/6Ph5-LuMWuoS9iV-EFGYDhtkhazlzuHqQMhFeWXs8y8/rs:fit:2000:2000:1:0/plain/bafkreick25qjy6l75xlied3b5ozxl3r6xq54xlks5pacud2ububm3aamve@jpeg",
              "alt": ""
            }
          ]
        },
        "replyCount": 0,
        "repostCount": 0,
        "likeCount": 1,
        "indexedAt": "2023-05-11T10:20:31.409Z",
        "viewer": {},
        "labels": []
      }
    },
    {
      "post": {
        "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvh33tthzm27",
        "cid": "bafyreifh4xinbvqujmrbc6unyyhhefn4x6dg3cieutk5u5sp4b6c7hmcki",
        "author": {
          "did": "did:plc:fcewtyqycu5qlt26tnbnan6h",
          "handle": "chrismcleod.dev",
          "displayName": "Chris M",
          "avatar": "https://cdn.bsky.social/imgproxy/42qD9eitqqNjGc7IXG6e13lmN2IH_m9RqUTH1ih-oDQ/rs:fill:1000:1000:1:0/plain/bafkreigc4hh664b524ku2tbkrsubserosqqlj3tsxuqxpg72lbng3xcfay@jpeg",
          "viewer": {
            "muted": false,
            "blockedBy": false
          },
          "labels": []
        },
        "record": {
          "text": "A test reply made using info from the ATproto docs",
          "$type": "app.bsky.feed.post",
          "reply": {
            "root": {
              "cid": "bafyreibmcnkzbxtciyydktbatjlpgh5hollpov4zvpwtaaq353vyzfbxwu",
              "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvh2rw5ua22y"
            },
            "parent": {
              "cid": "bafyreibmcnkzbxtciyydktbatjlpgh5hollpov4zvpwtaaq353vyzfbxwu",
              "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvh2rw5ua22y"
            }
          },
          "createdAt": "2023-05-11T10:15:12.698Z"
        },
        "replyCount": 0,
        "repostCount": 0,
        "likeCount": 1,
        "indexedAt": "2023-05-11T10:15:13.161Z",
        "viewer": {
          "like": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.like/3jvh34asm772t"
        },
        "labels": []
      },
      "reply": {
        "root": {
          "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvh2rw5ua22y",
          "cid": "bafyreibmcnkzbxtciyydktbatjlpgh5hollpov4zvpwtaaq353vyzfbxwu",
          "author": {
            "did": "did:plc:fcewtyqycu5qlt26tnbnan6h",
            "handle": "chrismcleod.dev",
            "displayName": "Chris M",
            "avatar": "https://cdn.bsky.social/imgproxy/42qD9eitqqNjGc7IXG6e13lmN2IH_m9RqUTH1ih-oDQ/rs:fill:1000:1000:1:0/plain/bafkreigc4hh664b524ku2tbkrsubserosqqlj3tsxuqxpg72lbng3xcfay@jpeg",
            "viewer": {
              "muted": false,
              "blockedBy": false
            },
            "labels": []
          },
          "record": {
            "text": "A test post made using info from the ATproto docs",
            "$type": "app.bsky.feed.post",
            "createdAt": "2023-05-11T10:09:39.554Z"
          },
          "replyCount": 1,
          "repostCount": 0,
          "likeCount": 0,
          "indexedAt": "2023-05-11T10:09:39.975Z",
          "viewer": {},
          "labels": []
        },
        "parent": {
          "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvh2rw5ua22y",
          "cid": "bafyreibmcnkzbxtciyydktbatjlpgh5hollpov4zvpwtaaq353vyzfbxwu",
          "author": {
            "did": "did:plc:fcewtyqycu5qlt26tnbnan6h",
            "handle": "chrismcleod.dev",
            "displayName": "Chris M",
            "avatar": "https://cdn.bsky.social/imgproxy/42qD9eitqqNjGc7IXG6e13lmN2IH_m9RqUTH1ih-oDQ/rs:fill:1000:1000:1:0/plain/bafkreigc4hh664b524ku2tbkrsubserosqqlj3tsxuqxpg72lbng3xcfay@jpeg",
            "viewer": {
              "muted": false,
              "blockedBy": false
            },
            "labels": []
          },
          "record": {
            "text": "A test post made using info from the ATproto docs",
            "$type": "app.bsky.feed.post",
            "createdAt": "2023-05-11T10:09:39.554Z"
          },
          "replyCount": 1,
          "repostCount": 0,
          "likeCount": 0,
          "indexedAt": "2023-05-11T10:09:39.975Z",
          "viewer": {},
          "labels": []
        }
      }
    },
    {
      "post": {
        "uri": "at://did:plc:fcewtyqycu5qlt26tnbnan6h/app.bsky.feed.post/3jvh2rw5ua22y",
        "cid": "bafyreibmcnkzbxtciyydktbatjlpgh5hollpov4zvpwtaaq353vyzfbxwu",
        "author": {
          "did": "did:plc:fcewtyqycu5qlt26tnbnan6h",
          "handle": "chrismcleod.dev",
          "displayName": "Chris M",
          "avatar": "https://cdn.bsky.social/imgproxy/42qD9eitqqNjGc7IXG6e13lmN2IH_m9RqUTH1ih-oDQ/rs:fill:1000:1000:1:0/plain/bafkreigc4hh664b524ku2tbkrsubserosqqlj3tsxuqxpg72lbng3xcfay@jpeg",
          "viewer": {
            "muted": false,
            "blockedBy": false
          },
          "labels": []
        },
        "record": {
          "text": "A test post made using info from the ATproto docs",
          "$type": "app.bsky.feed.post",
          "createdAt": "2023-05-11T10:09:39.554Z"
        },
        "replyCount": 1,
        "repostCount": 0,
        "likeCount": 0,
        "indexedAt": "2023-05-11T10:09:39.975Z",
        "viewer": {},
        "labels": []
      }
    }
  ],
  "cursor": "1683799779554::bafyreibmcnkzbxtciyydktbatjlpgh5hollpov4zvpwtaaq353vyzfbxwu"
}
```

## Example 5 Get a User Profile

OK, last one. To get the profile details of a user, we use a GET to [`/xprc/app.bsky.actor.getProfile`](https://atproto.com/lexicons/app-bsky-actor#appbskyactorgetprofile), again passing the user handle as an actor property, and passing our authentication token in the header:

### Request

```bash
curl --location 'https://bsky.social/xrpc/app.bsky.actor.getProfile?actor=chrismcleod.dev' \
--header 'Authorization: Bearer <token>'
```

### Response

```json
{
  "did": "did:plc:fcewtyqycu5qlt26tnbnan6h",
  "handle": "chrismcleod.dev",
  "displayName": "Chris M",
  "description": "Online since before some of you were born. \nTired.\nLead Software Developer, but I’m not allowed to talk about it.\nHe/him/his. Scotland\n⚠️Potential to post Warhammer content⚠️\n—\nhttps://chrismcleod.dev \nhttp://worldsinminiature.com ",
  "avatar": "https://cdn.bsky.social/imgproxy/42qD9eitqqNjGc7IXG6e13lmN2IH_m9RqUTH1ih-oDQ/rs:fill:1000:1000:1:0/plain/bafkreigc4hh664b524ku2tbkrsubserosqqlj3tsxuqxpg72lbng3xcfay@jpeg",
  "banner": "https://cdn.bsky.social/imgproxy/wNj_cLIyXZOj2m2t_nbehxg4JVAHzixb8iXFG5uNuwA/rs:fill:3000:1000:1:0/plain/bafkreicgnnuuhbz6eb7hcnrisjeyekgexea6pcdxp5uob56zohsp56jzd4@jpeg",
  "followsCount": 140,
  "followersCount": 64,
  "postsCount": 82,
  "indexedAt": "2023-05-09T19:44:05.927Z",
  "viewer": {
    "muted": false,
    "blockedBy": false
  },
  "labels": []
}
```

## Wrapping up

So there we have it - five basic operations with the AT protocol for you to try out. Hopefully you found it useful, interesting, and easy enough to follow along! Have you made any experiments with AT yet? Or are planning to? Let me know the details, or any other feedback you have, in the comments/via webmention/on social media 🙂
