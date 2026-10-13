# chrismcleod.dev

The personal website and blog of Chris McLeod: content written as Markdown files, published as a static site, and syndicated to the AT Protocol.

## Language

### Content

**Post**:
A blog article, published under `/blog/`.
_Avoid_: article, entry

**Bookmark**:
A saved link to someone else's page, with an optional comment, published under `/bookmarks/`.
_Avoid_: link, saved link

**Note**:
A short untitled message, named by its date and time.
_Avoid_: status, toot

**Like**:
A record of liking someone else's page; kept but not published.

### Identity

**Identity**:
The set of names a Post or Bookmark goes by: its Slug, URL, Former URLs, Preview image and Sequoia path. The Slug, URL and Sequoia path follow from its kind and title; Former URLs and the Preview image are recorded in its content.
_Avoid_: permalink, post identity

**Slug**:
The single URL-safe name derived from a Post's or Bookmark's title; it never contains `/`. It names the page's URL, its content file, and its Preview image. The same rule names the anchors of headings within a page.
_Avoid_: permalink (the full URL), path-safe slug, basename

**Former URL**:
A URL a page used to live at, kept so that it forwards to the page's current URL.
_Avoid_: alias, old path

**Preview image**:
The social preview picture shown when a Post is shared. The name recorded in the Post is the truth; a new or renamed Post gets one named after its Slug.
_Avoid_: OG image, social image, cover image

**Sequoia path**:
The URL that a Post's AT Protocol record links to, derived from the title by Sequoia's own rule; where it differs from the Post's URL it is forwarded.
