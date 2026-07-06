---
title: Sometimes, Whimsy is Enough
date: 2025-01-24T14:21:16Z
tags:
    - personal
    - programming
    - fun
atUri: "at://did:plc:fcewtyqycu5qlt26tnbnan6h/site.standard.document/3mpyyqdvyac2p"
---

I’ve been a bit in the doldrums this week. It’s never fun when your health suddenly changes, especially when it decides to do it in a terrifying  manner. But that’s for another day.

As part of all this kerfuffle, I’ve been sat at home most of the week “to rest”. Rest, for me, takes a few different forms; if I’m in the mood, I’ll maybe play a video game, or I’ll work on a hobby project, or I’ll tinker around on a coding project — which, to the outside observer doesn’t really look any different to “work”. Guess where my head landed this week?

But whatever keeps us occupied, eh?

I’ve spent the last several hours faffing around with Rust, and GitHub Actions (mostly on the Actions part, TBH) to create a command line utility with it’s own CI/CD pipeline for building and releases. And what does this utility do? Is it anything useful? Or groundbreaking? You read the title of this post, didn’t you?

No, it doesn’t do anything useful. What it _does do_, is take a date and time, and convert it to [the date format used by the Imperium of Man in the game Warhammer 40,000](https://wh40k.lexicanum.com/wiki/Imperial_Dating_System)[^1]. Why? Because sometimes making something silly, just for the sake of it, is enough to make you feel a little bit better about everything.

```bash
grimdate # output: 0 064 025.M3//10:53 local
grimdate --no-spaces # output: 0064025.M3//10:54 local
grimdate --is-iss # output: 1 064 025.M3//10:54 local
grimdate --date "1999-10-05T15:30:00+03:00" # output: 0 759 999.M2//12:30 local
grimdate --no-time # output: 0 064 025.M3

# options can be combined, e.g.,
grimdate -iSTd "2023-10-05T15:30:00+03:00" # output: 1759023.M3
```

I went a bit further and wrapped a dumb ZSH function around it so it gets output to my terminal as a rainbow.

```bash
grim() {
  local input="$(grimdate)"
  local red=$'\e[31m'
  local yellow=$'\e[33m'
  local green=$'\e[32m'
  local cyan=$'\e[36m'
  local magenta=$'\e[35m'
  local reset=$'\e[0m'

  echo -n "\n+++ "
  print -n "$input" | \
    sed "s/\([0-9]\{1,3\}\)/${red}\1${reset}/1" | \
    sed "s/\([0-9]\{3\}\)/${yellow}\1${reset}/1" | \
    sed "s/\([0-9]\{3\}\.M[0-9]\)/${green}\1${reset}/1" | \
    sed "s/\([0-9]\{2\}:[0-9]\{2\}\)/${cyan}\1${reset}/1" | \
    sed "s/\(local\)/${magenta}\1${reset}/1"
  echo " +++\n"
}
```

{% image "https://assets.chrismcleod.dev/chrismcleod.dev/assets/2b64730a-ee77-4d2b-8c3e-d238d047a0f7.png", "a screenshot of a terminal window on macOS using the Zsh shell. The user “chris@Chriss-Mac-mini” is in the ~/bin directory and has executed the command 'grim'. The output displays some status information, including “0 064 025.M3//14:12 local,” followed by a command prompt ready for the next input. The terminal has a blurred background, likely showing part of the desktop or an open application." %}

Maybe I’ll add this to my prompt somewhere, or maybe I’ll forget about it in a few days. But that’s besides the (lack of) point.

If you'd like to play with this silly little toy, you can [find the code and releases over on GitHub](https://github.com/mcleodchris/grimdate)[^2].

[^1]: I had to do my own interpretation for the time part. I'm sure it's fine.
[^2]: Please note that I've not tested the Windows version at all.
