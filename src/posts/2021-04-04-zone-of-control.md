---
title: 'Zone of Control'
date: 2021-04-04
categories:
  - general-life
tags:
  - smart-home
  - personal
  - tip
authors:
  - chris
redirectFrom: ['/2021/04/04/zone-of-control/']
---

I've been scratching my head since yesterday, trying to figure out how to get a Hue Smart Button to turn off all my lights with a single button press. Every night I ask Siri to "turn off all the lights," and it would be nice to have a physical button to achieve the same thing - especially for those times Siri refuses to understand what I'm asking it to do. I eventually found part of the solution, I think, but it took some digging.

The [Smart Button's product page on Amazon](https://amzn.to/3dAEuxL) (affiliate link) specifically calls out switching off all of the lights in the house as a use-case for the Smart Button, so I was surprised it wasn't completely obvious. If the Smart Button had been fully HomeKit-enabled (disappointingly, it's not) this would have been incredibly easy to configure in the Home app. Unfortunately it needs to be configured in the Hue app instead, which is an app I've tried to avoid using where possible. The main issue I was confounded by was the Smart Button - and other Hue devices - can only be assigned to a single room, which in turn limits what it can control to that room. I looked into creating a custom scene as well - again, it's limited to a single room.

In the end, the answer to "how do I control the whole house?" was a feature of the Hue app I'd completely forgotten about - Zones. Zones allow you to group multiple rooms, and control them all at once. Creating a Zone is done in the same place as creating a Room, but it's less obvious. The Smart Button can then be configured to control a zone (again, buried at the bottom, below the list of Rooms). Prior to this there were no mention of Zones when configuring the Smart Button.

It would have been useful for Signify to include some sample setups/guides in the box, or easily findable through the Hue app; if it took me overnight to figure this out, woe betide anyone coming into the Hue ecosystem for the first time. There are a few How-To's in the "Explore" tab, but none specifically about this accessory, and the only other possibly-related video is about HomeKit options that don't exist for this particular button.

I still need to figure out setting it so the button _only_ turns off lights. I don't want it to toggle the whole house on/off with each press, but only turn everything off. I suspect the answer here lies in a custom scene of some description, but that's still to be seen.

Finally, there's also the complication that I have a couple of LifX bulbs in the house which should _also_ be turned off by this button. They can't be set directly through the Hue app, but I _think_ I have a solution for this involving HomeKit Automations.
