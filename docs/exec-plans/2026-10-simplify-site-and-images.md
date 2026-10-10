# Fix known bugs, simplify the Eleventy setup, and move content images to plain Markdown backed by a committed image manifest

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds. It follows the ExecPlan format described in `~/code/skills/depinator/references/PLANS.md` (that file is not checked into this repository; everything needed to execute this plan is contained below).


## Purpose / Big Picture

This repository is the personal website and blog at https://chrismcleod.dev, built with the Eleventy static site generator. It works, but an audit on 2026-10-10 found three kinds of problem, and this plan addresses all three.

First, there are live bugs that visitors, search engines and feed readers can see today. In production:

- every image embedded with the `{% image %}` shortcode is rendered as `<img src="undefined" height="undefined">`;
- several older posts display the wrong picture entirely;
- 66 old URLs that are supposed to redirect return HTTP 404;
- every page loads the stylesheet and script under a different random cache-busting URL, so browsers never reuse them between pages;
- non-post pages advertise the site's home page URL as their social-preview image;
- 15 meaningless tag pages such as `/tags/postsForFeed/` are published, while post footers link to tag pages such as `/tags/posts/` that should not exist;
- the legacy bookmarks Atom feed has an empty title;
- the archive's activity graph ignores two thirds of the notes;
- a handful of smaller template mistakes exist (listed in Milestone 1).

Second, the project carries a lot of code inherited from the starter template it was built on ("Eleventy Excellent") that is no longer used, plus several things done twice in slightly different ways. After this plan, the configuration is roughly a quarter smaller, unused dependencies are gone, duplicated templates are merged, external data is read from committed snapshots so a build never needs the network, and continuous integration (CI) checks the built site before anything is published.

Third, content images. Today posts embed images with a custom Nunjucks shortcode, for example `{% image "https://assets.chrismcleod.dev/.../photo.jpg", "alt text", "caption" %}`. The owner wants to write ordinary Markdown instead, for example `![alt text](https://assets.chrismcleod.dev/.../photo.jpg "caption")`, and still get responsive `<picture>` markup. Images are uploaded through a separate service the owner runs, called "mage" (source at `~/code/mage.chrismcleod.dev`). mage already resizes every upload into several widths and formats and stores them on a content delivery network (CDN, a fast file host; here Bunny CDN at `https://assets.chrismcleod.dev`). The site must not download or resize those images again at build time.

After this plan:

- content uses plain Markdown images;
- the build reads each image's dimensions and available sizes from a small JSON file committed to the repository (the "image manifest");
- no image is downloaded or re-encoded during a build;
- a cold development build drops from over three minutes to about 16 seconds.

How to see it working at the end:

- run `npm run build` then `npm run check`, and see every check pass;
- open an older post with photos, for example `dist/blog/unboxing-the-lost-and-the-damned-by-guy-haley/index.html`, and see a `<picture>` element whose `<img>` has a real `src`, `width` and `height`, and whose every `srcset` URL returns HTTP 200;
- after deployment, open `https://chrismcleod.dev/2021/08/16/appraisal/` and be forwarded to `/blog/appraisal/`.

The work is delivered as three independently reviewable changes (pull requests): **Change A**, production fixes and validation (Milestones 0 to 2); **Change B**, configuration, feed and data cleanup (Milestones 3 to 5); **Change C**, the image pipeline and content migration (Milestones 6 to 10). Each change is merged and deployed before the next one starts.


## Progress

- [x] (2026-10-10) Plan written from the audit; revised after an independent review and comparison with a competing plan (see the revision notes at the bottom).
- [x] (2026-10-10) Change A, Milestone 0: build-check script (`npm run check`) and baseline snapshot of the current output. Baseline built into the session scratchpad rather than `/tmp/site-baseline` (same layout); 1,837 output files.
- [x] (2026-10-10) Change A, Milestone 1: fix the production bugs in this repository. Production build passes every check with `--allow picture-img-dimensions` (314 images, down from 327, because the colliding images now render without `<picture>`). The visual check was done by diffing the HTML of the home page, `/blog/appraisal/` and the archive (`/blog/`) against the baseline: apart from asset URLs, the removed `<base>`, `/humans.txt`, the theme colours and `og:image`, the only visible changes are the "Filed under" line without `posts`/`timeline`, the archive's activity graph counting every note, and the archive's `bookmarks` tag button now reading "2 posts".
- [ ] Change A, Milestone 1b (mage repository): write `bookmarkOf`/`likeOf` front matter keys.
- [ ] Change A, Milestone 2: CI hardening; CI runs the checks before publishing and after the final build; pull-request validation.
- [ ] Change B, Milestone 3: delete dead code, templates, fonts and dependencies; one HTML transform policy.
- [ ] Change B, Milestone 4: configuration as plugins; merged partials; feeds consolidated with legacy contracts preserved.
- [ ] Change B, Milestone 5: committed data snapshots (Paintslam) with `npm run data:sync`; helper scripts fixed; single slugify.
- [ ] Change C, Milestone 6 (prototype): manifest-driven `<picture>` rendering on representative images; verify mage's `/images/list` is complete.
- [ ] Change C, Milestone 7: image manifest `data/images.json` and `npm run images:sync`; CI integration.
- [ ] Change C, Milestone 8: Markdown image renderer, `picture` filter, shortcode on the same code path, manifest reload in the development server.
- [ ] Change C, Milestone 9: content migration (shortcode to Markdown, tag case, legacy front matter) as one commit; old image code removed.
- [ ] Change C, Milestone 10: documentation and retrospective.

Temporary check allowances in CI (each must be removed by the milestone named):

- `picture-img-dimensions`: allowed from Milestone 2; removed in Milestone 8.


## Surprises & Discoveries

These were found during the audit and the plan review. Add new entries as work proceeds.

- Observation: production image markup is broken. `config/shortcodes/image/index.js` builds static CDN metadata with a `src` property, but the HTML template reads `lowsrc.url` and `lowsrc.height`, which do not exist on that object.
  Evidence (production build, `dist/blog/unboxing-the-lost-and-the-damned-by-guy-haley/index.html`):

        <img
          src="undefined"
          width="820"
          height="undefined"

- Observation: several posts show the wrong picture in production. The CDN stores all resized variants in one flat folder, `https://assets.chrismcleod.dev/chrismcleod.dev/assets/resized/`, named `<original basename without extension>-<width>.<format>`. Legacy images with the same basename in different folders therefore share one set of resized files. Content references 270 distinct CDN image URLs. The basename `image` collides 5 ways; `image-1`, `image-2` and `image-3` collide 2 ways each. `970c78e0-a6bd-4c64-b434-699c3dc03a0c` is used by 2 URLs, probably the same picture at two paths.
  Evidence: `resized/image-320.jpeg` is 320x427 (aspect 0.749), while the originals are:

        2021/08/image.png   1113x232   aspect 4.797
        2022/03/image.png    848x502   aspect 1.689
        2022/12/image.png   1133x554   aspect 2.045
        2023/07/image.png    621x367   aspect 1.692

  None match. Note that 2022/03 and 2023/07 have nearly the same aspect ratio while being different pictures, which is why aspect ratio cannot prove which picture a variant belongs to.

- Observation: small legacy images are missing some resized variants. The current fixed `320,570,820` srcset therefore already links to files that return 404, and the "original width" variant that Eleventy Image would expect does not exist either.
  Evidence for `assets/images/2015/01/silverlight-upgrade-warning.png` (482x611):

        -320.avif    200
        -570.webp    404
        -820.jpeg    404
        -482.avif/webp/jpeg  all 404

- Observation: Eleventy Image's width selection cannot be re-derived from image dimensions alone, because its default `minimumThreshold` of 1.25 makes the result depend on the whole width list. mage generates widths `[320, 570, 820, 650, 960, 1200]`; the site wants `[320, 570, 820]`. For a 750px-wide original, mage produces 320, 570 and 650, but the site would compute 320, 570 and 750, and `-750.*` does not exist. Conclusion: the manifest must record which widths actually exist, per format.

- Observation: the 66 `redirectFrom` redirects are dead in production. They are emitted into a Netlify-format `_redirects` file and the site deploys to Bunny, which ignores it; `netlify.toml` is also ignored. The redirects and headers that do work are configured in the Bunny dashboard, not in this repository: Bridgy Fed `/.well-known/webfinger` and `host-meta`, `/feed/`, and the security headers.
  Evidence:

        curl -s -o /dev/null -w '%{http_code}' https://chrismcleod.dev/2021/08/16/appraisal/
        404

  Also, `/feed/` returns `301` to `/follow/blog/feed.atom`, while `_redirects` claims `/feed/ /feed.xml`.

- Observation: tags. `src/pages/tags.njk` paginates over every collection, so it publishes pages for collection names, for example `all`, `bookmark`, `bookmarks`, `bookmarksFeed`, `bookmarksForFeed`, `graph`, `notes`, `notesForFeed`, `posts`, `postsForFeed`, `subscriptions`, `tagList` and `timeline`. Directory data adds tags to every item: posts get `posts` and `timeline`, notes get `notes` and `timeline`, bookmarks get `bookmark` and `timeline`. The post and note footers list all tags, so they link to those system tag pages; `dist/blog/appraisal/index.html` links `/tags/posts` and `/tags/timeline`. Tags also differ only by case in places: `apis`/`APIs` and `tv`/`TV`, in seven posts.

- Observation: the stylesheet and script URLs carry `?{{ assetHash }}`, where `src/_layouts/base.njk` sets `assetHash = global.random()` on every page render. A production build contained 1,175 distinct `global.css?…` URLs, so every page view re-downloads CSS and JavaScript.

- Observation: `og:image` on non-post pages without `ogImage` is the bare site URL (`<meta property="og:image" content="https://chrismcleod.dev">` on `/` and `/about/`), because `src/_includes/partials/meta-info.njk` only appends a path for posts.

- Observation: the archive's activity graph (`getGraph` in `config/collections/index.js`) uses `notesForFeed`, the newest 50 of 150 notes.

- Observation: the custom collection named `bookmarks` hides the tag collection of the same name. Two posts carry the genuine topic tag `bookmarks` (`src/posts/2005-12-10-is-it-wrong-to-submit-your-own-entries-to-del-icio-us.md` and `src/posts/2024-01-29-adding-bookmarks.md`), but `/tags/bookmarks/` lists 206 items, every bookmark, because `tags.njk` renders `collections['bookmarks']`. The custom `posts` collection hides the `posts` tag in the same way, but that is a system tag whose page is removed anyway.

- Observation: in JSON feed templates, Nunjucks `{{ x | dump | safe }}` renders nothing when `x` is undefined, producing invalid JSON such as `"summary": ,`. No post has `excerpt`, so this would affect every item. `{{ x | default("", true) | dump | safe }}` renders `""` for both undefined and null.
  Evidence:

        node -e "...renderString('{\"a\": {{ x | dump | safe }}, \"b\": {{ x | default(\"\", true) | dump | safe }}}')"
        {"a": , "b": ""}

- Observation: the two legacy Atom feeds differ from the `/follow/` feeds in their contract. `/bookmarks/feed.xml`:
  - emits 24 entries where `/follow/bookmarks/feed.atom` emits 50;
  - uses `https://chrismcleod.dev/` as its feed-level `<id>`;
  - links each entry to the bookmarked external URL, not to the bookmark page;
  - appends a rendered `feedFooter` to the content;
  - has an empty `<title>`, because it reads the non-existent `meta.bookmarks.name`.

  `/feed.xml` emits 24 posts, uses `https://chrismcleod.dev/` as its `<id>`, and takes its title from `meta.blog.name`.

- Observation: Sequoia (the tool that publishes posts to the AT Protocol, `sequoia-cli` 0.5.7) decides what to republish by hashing each post file's entire raw text, front matter included. Any bulk edit of `src/posts/*.md` therefore causes an "update" of every touched post's AT Protocol record on the next CI run. It only posts to Bluesky on "create", and only for posts newer than `bluesky.maxAgeDays` (30), so updates do not spam Bluesky. `sequoia publish --dry-run` exists. Sequoia writes `atUri:` into new posts' front matter, and pages link to that URI, so the deployed build must run after publishing.
  Evidence: in the `sequoia-cli` 0.5.7 bundle, `getContentHash(post.rawContent)` where `rawContent = await fs.readFile(filePath, "utf-8")`.

- Observation: mage's micropub endpoint writes `bookmark_of:` and `like_of:` front matter (snake case), while the site reads `bookmarkOf` (camel case), so a bookmark posted through micropub renders without its link. Existing likes use two different keys: `src/likes/2024-01-08-6vdaa.md` has `like-of`, `src/likes/2025-05-27-79867.md` has `likeOf`. Likes have no layout, so they render as empty pages.

- Observation: mage's data helpers swallow database errors and return an empty array. This applies to `getImageData` (behind `/images/list`) and `getHobbyData` (behind `/hobby`). An empty response therefore cannot be trusted to mean "no data".

- Observation (unverified risk): mage's `/images/list` query is `SELECT … FROM c ORDER BY c.createdAt DESC`, but upload records saved by `saveImageData` have no `createdAt` field (they have `original`, `metadata`, `exifData`, `creationDate`). Depending on the Cosmos DB indexing policy, `ORDER BY` on a missing property may exclude those records. Milestone 6 verifies the count.

- Observation: development builds are slow only on a cold cache. A cold `npx @11ty/eleventy` took 3m15s, 92% of it inside the image shortcode, which in development downloads about 210 remote originals and encodes AVIF/WebP/JPEG at three widths. A warm build and a production build both take about 16 seconds.

- Observation: the CI job condition `if: github.event_name == 'push' || github.event_name == 'repository_dispatch'` skips the declared `workflow_dispatch` trigger, so manual runs do nothing. The workflow has no concurrency control and no Node setup step. It installs Pagefind (`npx -y pagefind`) and Sequoia (`npm install -g sequoia-cli`) unpinned.

- Observation: the only existing Markdown image in content is `![](assets/images/Screenshot_20221224_200953-1024x585.png)` in `src/posts/2022-12-24-my-first-prototype.md`: relative, with no alt text and no title. So no existing content relies on Markdown image titles. The relative path probably does not resolve; that is out of scope here, so note it for the owner.


- Observation (Milestone 0): the baseline check failed exactly the expected checks except two. `tag-links-resolve` passed, because at baseline the system tag pages that post footers link to (`/tags/posts/`, `/tags/timeline/`) do exist; it starts guarding once Milestone 1 removes them. `sequoia-slugs-resolve` failed, for a reason the audit missed (next entry).
  Evidence (baseline, abridged):

        FAIL no-undefined-attributes: 119 problem(s)
        FAIL no-system-tag-pages: system tag pages exist: all, posts, timeline, bookmark, notes, graph, tagList, subscriptions, bookmarksFeed, bookmarksForFeed, notesForFeed, postsForFeed
        PASS json-feeds-valid
        FAIL xml-feeds-valid: 1 problem(s): bookmarks/feed.xml: empty feed title
        FAIL redirect-stubs: 66 problem(s)
        FAIL sequoia-slugs-resolve: 60 problem(s)
        FAIL no-base-href: 1153 problem(s)
        FAIL picture-img-dimensions: 327 images without dimensions
        PASS tag-links-resolve
        FAIL single-asset-version: 1176 distinct global.css URLs; 1175 distinct app.js URLs
        FAIL og-image-is-image: 610 problem(s)

- Observation (Milestone 0): the `slug` in `.sequoia-state.json` is not a URL. Sequoia derives it from the file name (`2025-08-26-installing-arch-with-….md` gives `installing-arch-with-…`), while the URL each AT Protocol record advertises comes from `sequoia.json`'s `pathTemplate`, `/blog/{title}`, where Sequoia slugifies the title its own way: lower-case, whitespace to `-`, then delete every character outside `[A-Za-z0-9_-]`. Eleventy's `slugifyString` differs for titles with punctuation, so 60 of the 565 published records point at URLs that return 404, for example `/blog/armies-on-parade---painting-update-2` (Eleventy: `/blog/armies-on-parade-painting-update-2/`) and `/blog/onoff` (Eleventy: `/blog/on/off/`). The check now resolves Sequoia's path per post (`sequoiaPath` in `config/utils/index.js`, mirroring `resolvePathTemplate` in the sequoia-cli 0.5.7 bundle) instead of testing `blog/<slug>/`.

- Observation (Milestone 1): the output file list differs from the baseline exactly as expected, plus two items the plan did not list: the two `likes/*/index.html` pages are gone (intended by the Likes fix), and 60 extra redirect stubs exist under `/blog/` for the Sequoia paths (see the Decision Log). Totals: 126 files added (66 `redirectFrom` stubs and 60 Sequoia stubs), 15 removed (12 system tag pages, `_redirects`, 2 likes). No old `redirectFrom` path collided with a real page.

- Observation (Milestone 1): `filterTagsFromFeeds` never excluded the system tag `bookmark` (its list had `bookmarks`, the topic tag, instead), so bookmark items in the JSON feeds carry the tag `bookmark`. To keep its output identical as the plan requires, the new list is `SYSTEM_TAGS` minus `bookmark`, plus the feed-only exclusions.

- Observation (Milestone 1): in the scratch "quote check" post, the JSON feed item came out valid, with `"title": "He said \"hello\" \\ goodbye # test: one"`, `"summary": ""` and `"image": ""`. The item's URL contains `&#92;` because Eleventy escapes the backslash when rendering the title-derived permalink; this is pre-existing, affects no real post, and is out of scope.

## Decision Log

- Decision: Do not use Eleventy Image's built-in HTML transform plugin (`eleventyImageTransformPlugin`) or a final-HTML transform. Render `<picture>` markup with Eleventy Image's `generateHTML` helper from a committed manifest, called from a markdown-it image rule (markdown-it is the Markdown parser this site uses).
  Rationale:
  - The built-in transform can produce CDN URLs without resizing (`statsOnly`, `urlFormat`), but it needs each image's dimensions. It can only get them by downloading the original, because its `remoteImageMetadata` option is plugin-wide rather than per image.
  - It re-derives widths, which does not match what exists on the CDN.
  - A markdown-it rule runs when Markdown is rendered. Its output is part of each post's `templateContent`, so the RSS, Atom and JSON feeds get the same responsive markup with no second transform and no risk of transforming an image twice. A final-HTML transform would not reach feed content.
  Date/Author: 2026-10-10, Claude with Chris McLeod; feed rationale added after review.

- Decision: Store image facts in a committed JSON file, `data/images.json`, refreshed by `npm run images:sync`, instead of querying mage during every build. Use the same pattern for other external data (Paintslam: `data/hobby.json`, refreshed by `npm run data:sync`). The top-level `data/` folder holds synced external snapshots and nothing else.
  Rationale:
  - The build becomes deterministic and works offline and in pull-request checks without credentials.
  - The services stay the source of truth.
  - A sync costs one request instead of a multi-megabyte query per build.
  - Snapshots are recorded in git like any other content.
  - The folder sits outside `src/`, so Eleventy does not treat the files as global data or templates.
  Date/Author: 2026-10-10; extended to Paintslam after comparison with the competing plan.

- Decision: `images:sync` uses mage's existing authenticated `GET /images/list` endpoint (all records with full Eleventy Image metadata); no new mage endpoint is built.
  Rationale: a sync runs rarely, so a payload of a few megabytes is acceptable, and this removes a cross-repository dependency and a deploy step. This supersedes the earlier decision to add `GET /images/dimensions`. If Milestone 6 shows that `/images/list` omits records (see the `ORDER BY` risk), add that endpoint as a contingency, as described in Milestone 6.
  Date/Author: 2026-10-10, revised after comparison with the competing plan.

- Decision: The manifest records, per original URL, the dimensions and the widths that actually exist for each format. Images mage does not know about (legacy images) are probed once by `images:sync`: download the original to read its size, then send an HTTP HEAD request for each candidate variant. Every image whose basename is shared with another URL gets no variants and renders as a plain `<img>` of its original, with correct `width` and `height`. No aspect-ratio heuristic is used.
  Rationale:
  - Emitting only verified URLs guarantees there are no 404s in `srcset`.
  - Aspect ratio cannot establish identity: two of the colliding pictures share a ratio (see Surprises).
  - One checked variant would not validate the other widths and formats anyway.
  - The collision rule touches about 13 images, which is an acceptable cost for never showing a wrong picture.
  - A mage-side backfill was rejected, because the flat `resized/` folder would make re-processing colliding images overwrite each other.
  Date/Author: 2026-10-10; aspect-ratio check removed after review.

- Decision: `images:sync` and `data:sync` never delete or shrink existing snapshot data because of a remote response. Image entries are only added or updated. A Paintslam snapshot is replaced only by a valid non-empty response unless `--allow-empty` is passed. Writes are atomic (write a temporary file, then rename).
  Rationale: mage returns an empty array on database errors.
  Date/Author: 2026-10-10.

- Decision: Fix redirects with static HTML redirect pages generated by Eleventy, and delete `netlify.toml` and `_redirects`. Each page sits at an old URL and contains `<meta http-equiv="refresh">` and a canonical link.
  Rationale: this keeps redirects in the repository and works on any static host. Bunny edge rules would give true HTTP 301s, but they live in a dashboard outside version control. Search engines treat an immediate meta refresh plus `rel=canonical` as a permanent redirect. The dashboard-only rules that remain (webfinger, host-meta, `/feed/`, headers) are documented in the readme in Milestone 10.
  Date/Author: 2026-10-10.

- Decision: Asset cache-busting uses one build identifier per build, `global.buildId`, computed once when `src/_data/global.js` is loaded. It does not hash file contents.
  Rationale: it fixes the per-page randomness, which is the actual bug, with a one-line change. Every deploy purges Bunny's cache anyway, so content hashing (proposed by the competing plan) would add build-ordering complexity for little gain.
  Date/Author: 2026-10-10, after comparison with the competing plan.

- Decision: Keep title-derived permalinks (`/blog/{{ title | slugify }}/`), but have exactly one slugify implementation (`config/utils/index.js`) that every script imports.
  Rationale: changing the URL scheme would break existing links and the Sequoia records, which store a slug per post. `npm run check` verifies that every Sequoia slug resolves to a built page.
  Date/Author: 2026-10-10.

- Decision: Feed consolidation preserves every feed's public contract exactly: URL, feed-level `<id>`, title, entry count, entry IDs, entry links, and content. The two legacy Atom feeds are modelled as explicit variants in `src/_data/feeds.js` with their own limits, IDs, titles and link rules, sharing one Atom body partial. Each milestone's outputs are compared against the previous milestone's outputs, not the original baseline, because Milestone 1 intentionally corrects some feed fields.
  Rationale: subscribers must see no change other than the deliberate fixes.
  Date/Author: 2026-10-10, after review.

- Decision: A Markdown image's title becomes its caption (`![alt](url "Caption")` renders as `<figure>` with `<figcaption>Caption</figcaption>`), via `markdown-it-image-figures`.
  Rationale: this is a common Markdown idiom and keeps captions in plain Markdown. No existing content uses Markdown image titles (see Surprises), so nothing changes meaning. The competing plan preferred a separate caption mechanism to avoid titles silently becoming captions; that risk does not exist for this content.
  Date/Author: 2026-10-10.

- Decision: Do all bulk edits of `src/posts/*.md` in one commit in Milestone 9: the shortcode-to-Markdown migration, tag case normalisation, and removal of the unused `categories:`/`authors:` front matter.
  Rationale: Sequoia republishes every post whose file changes, and one wave of updates is better than three. Sequoia also publishes post content, and plain Markdown images render in other readers where `{% image %}` shortcodes do not.
  Date/Author: 2026-10-10.

- Decision: Remove both HTML output transforms: the Prettier formatter in `.eleventy.js`, and the never-active minifier in `config/transforms/html-config.js`.
  Rationale: the minifier never runs (it checks `ELEVENTY_ENV`, which nothing sets), and the Prettier pass is pure build cost. Bunny compresses responses, so minification gains little.
  Date/Author: 2026-10-10.

- Decision: Keep a small `{% image %}` shortcode, reimplemented on the new renderer, for the handful of images that need a CSS class or eager loading, such as the h-card portrait on the home page. Templates get a `picture` filter. All other content uses Markdown images.
  Rationale: this avoids adding `markdown-it-attrs` for about six images.
  Date/Author: 2026-10-10.

- Decision: Canonical front matter keys are camel case: `bookmarkOf` and `likeOf`. mage is changed to write them (Milestone 1b). Likes stay in the repository but are not published (`permalink: false`).
  Rationale: 170 bookmarks already use `bookmarkOf`. Likes have no layout, feed or listing, and only two exist.
  Date/Author: 2026-10-10.

- Decision: CI order is: install; sync data and images; generate OG images; build; `npm run check`; Sequoia publish; final build; `npm run check`; commit generated state; deploy. Add `concurrency` so runs on `develop` queue rather than overlap, fix the job condition so `workflow_dispatch` works, and add a separate pull-request workflow that installs, builds and checks with no secrets.
  Rationale:
  - A broken or malformed build can no longer publish to the AT Protocol.
  - The final build includes the `atUri` values Sequoia writes.
  - A deploy failure after publishing is still possible. Recovery is to re-run the workflow, since Sequoia's state file prevents duplicate creates. This is documented rather than hidden.
  - The competing plan's suggestion to deploy before syndicating requires Sequoia to separate preparation from publishing, which it does not.
  Date/Author: 2026-10-10, after review and comparison.

- Decision: Delete the Warcraft integration and its `/warcraft/warcraft.json` output.
  Rationale: it has never produced anything but `[]`, because it reads its credentials from the wrong object. No consumer is known. The competing plan proposed keeping the empty output for compatibility; a permanently empty file has no contract worth keeping.
  Date/Author: 2026-10-10.


- Decision: The `redirects` collection also emits a redirect stub at the URL Sequoia publishes for each post (`sequoiaPath(pathTemplate, title)`) whenever that differs from the post's Eleventy URL and is not already a real page. This makes all 565 AT Protocol records resolve without republishing anything. `sequoia-slugs-resolve` checks Sequoia's resolved path rather than the state file's `slug`.
  Rationale: the alternative, making Sequoia's path match Eleventy's (for example a `{field}` path template backed by a new front matter key), edits every affected post and republishes their records; stubs fix the dead links now and cost one tiny page each. The owner may still choose to correct the records later.
  Date/Author: 2026-10-10, Claude during Milestone 1.

## Outcomes & Retrospective

Nothing yet. Fill in at the end of each milestone.


## Context and Orientation

Read this section before touching anything. It describes the repository as it was on 2026-10-10 (commit `6e68cb1` on branch `develop`).

### How the site is built

Eleventy reads templates from `src/` and writes the website to `dist/`. Its configuration entry point is `.eleventy.js` (an ES module), which imports:

- filters (functions callable inside templates as `{{ value | filterName }}`) from `config/filters/`;
- shortcodes (template functions written as `{% name args %}`) from `config/shortcodes/`;
- collections (named, sorted lists of pages) from `config/collections/index.js`;
- the Markdown parser configuration from `config/plugins/markdown.js` (the parser is markdown-it, which supports plugins and per-element rendering rules).

Templates use the Nunjucks language (`.njk`). Markdown files are pre-processed as Nunjucks, which is why shortcodes work inside posts.

Supporting code:

- CSS is in `src/assets/css/` and is compiled by PostCSS with Tailwind, through a custom template language in `config/template-languages/css-config.js`.
- `tailwind.config.js` turns the design tokens in `src/_data/designTokens/*.json` into CSS custom properties.
- JavaScript in `src/assets/scripts/app.js` is bundled with esbuild by `config/template-languages/js-config.js`.
- `src/assets/scripts/sequoia-comments.js` and `sequoia-subscribe.js` are vendored web components from the Sequoia project. They are about 1,900 lines combined, are not site-authored code, and should not be refactored.

### Content and templates

Content folders:

- `src/posts/`: about 565 blog posts.
- `src/notes/`: about 150 short posts, many created by mage via the micropub protocol.
- `src/bookmarks/`: about 170 links, each with a `bookmarkOf:` URL.
- `src/likes/`: 2 files.

"Directory data" files, such as `src/posts/posts.json`, give every file in their folder a layout, tags and permalink.

Template and data locations:

- Layouts: `src/_layouts/`.
- Partial templates: `src/_includes/`.
- Global data (variables available to all templates, for example `meta`, `navigation`, `hobby`): `src/_data/`.
- Standalone pages such as About and Follow: `src/pages/`.

### Helper scripts

Helper scripts in `helpers/` create new content files: `npm run new:post`, `new:note`, `new:bookmark` and `new:like`. `npm run og` runs `helpers/generate-og-images.js`, which generates Open Graph (social preview) images: it writes JPEGs into `src/assets/images/social-preview/` and adds `ogImage:` to post front matter.

### Deployment

Deployment is the GitHub Actions workflow `.github/workflows/deploy-to-bunny.yml`, triggered by pushes to `develop`. In order, it:

1. joins the owner's Tailscale network (a private network, needed to reach mage);
2. restores a `.cache` folder;
3. runs `npm install` and `npm run og`;
4. installs `sequoia-cli` globally and runs `sequoia publish`, which publishes posts as AT Protocol records and writes `atUri:` into post front matter plus state into `.sequoia-state.json`;
5. runs `npm run build`;
6. commits any changed state back to `develop` with `[skip ci]`;
7. uploads `dist/` to Bunny storage.

The workflow uses these secrets:

- `MAGE_API_TOKEN`: bearer token for mage;
- `PDS_URL`, `ATP_IDENTIFIER` and `ATP_APP_PASSWORD`: for the AT Protocol;
- Tailscale and Bunny credentials.

`src/_data/hobby.js` fetches `https://mage.chrismcleod.dev/hobby` with `MAGE_API_TOKEN` at build time, and `src/_data/navigation.js` imports it again to find the newest Paintslam year.

Paintslam changes rebuild the site through a `repository_dispatch` event of type `function_trigger`. An Azure Function owned by the site owner sends it when an entry is created or updated. mage's `DELETE /hobby/:id` route sends the same event for deletions (`triggerWorkflowDispatch` in mage's `src/utils/hobbyData.mjs`). The event only starts the deploy workflow; it carries no data, and the run fetches the current data from mage itself.

### mage

mage (`~/code/mage.chrismcleod.dev`) is an Express server running on Node 22 or later.

Image uploads arrive at `POST /micropub/media`. For each upload, mage:

1. runs Eleventy Image with widths `[320, 570, 820, 650, 960, 1200]` and formats `avif`, `webp` and `jpeg`;
2. uploads the original to `<UPLOAD_PATH>/<filename>` and each variant to `<UPLOAD_PATH>/resized/<name>-<width>.<format>` on Bunny storage;
3. saves a record `{ original, metadata, exifData, creationDate }` into the Cosmos DB container `images`.

In that record, `metadata` is Eleventy Image's result: an object keyed by format, each value an array of `{ format, width, height, url, sourceType, srcset, filename, outputPath, size }`.

Routes registered after `app.use(authenticate)` in `src/app.mjs` require `Authorization: Bearer <SHARED_SECRET>`; the site's `MAGE_API_TOKEN` holds that same value. Two of them matter here:

- `GET /images/list` returns all image records (`id`, `original`, `metadata`, `createdAt`, `creationDate`).
- `GET /hobby` returns the Paintslam entries.

mage writes micropub posts' front matter in `src/utils/micropubMarkdown.mjs`.

### Terms used in this plan

- **Variant**: one resized copy of an image at one width and format.
- **srcset**: the HTML attribute listing variants so the browser can pick one.
- **Image manifest**: the new file `data/images.json`.
- **Snapshot**: a committed copy of external data in `data/`.
- **Redirect stub**: a tiny HTML page at an old URL that immediately sends the browser to the new URL.
- **System tags**: tags added by directory data to group content (`posts`, `timeline`, `bookmark`, `notes`) rather than describe a topic.
- **Sequoia**: the `sequoia-cli` tool described above.
- **Allowance**: a named check that `npm run check` reports as a warning instead of a failure; used while a known failure is scheduled for a later milestone.

### Testing and build commands

There is no automated test suite. Milestone 0 creates `helpers/check-build.js` (run as `npm run check`), which inspects a built output folder, plus a baseline snapshot so later milestones can prove nothing regressed.

Build commands, run from the repository root:

- `npm run build` does a production build into `dist/`: it sets `ELEVENTY_PRODUCTION=true`, then runs Eleventy and Pagefind search indexing.
- `npx @11ty/eleventy --output=<dir>` builds without the production flag.
- `npm start` runs the development server on port 3000.


## Plan of Work

Each milestone leaves the site deployable. Commit at the end of each milestone, and more often if convenient. Work on one branch per change (A, B, C), not directly on `develop`, because pushing to `develop` deploys.


### Change A — production fixes and validation


#### Milestone 0: a build check and a baseline

Goal: a repeatable way to prove behaviour before and after every change, usable by CI.

Add the exact-pinned development dependency `fast-xml-parser` (5.11.2 at time of writing). It provides `XMLValidator.validate(text)`, which returns `true` or an error object, and `XMLParser`. Create `helpers/check-build.js`, a Node ES module, and the npm script `"check": "node helpers/check-build.js dist"`.

The script takes the output folder as its first argument and any number of `--allow <check-name>` options. It prints one line per check: `PASS name`, `FAIL name: detail`, or `WARN name: detail (allowed)` for a failing check that was allowed. It exits with code 1 if any check that was not allowed failed. Use `cheerio` (already a dependency) to read HTML.

Checks (the names are the identifiers used with `--allow`):

1. `no-undefined-attributes`: no HTML file contains `="undefined"`.
2. `no-system-tag-pages`: no folder under `<dir>/tags/` has one of these names: `all`, `posts`, `timeline`, `bookmark`, `notes`, `graph`, `tagList`, `contentTags`, `subscriptions`, `allBookmarks`, `allNotes`, `bookmarksFeed`, `bookmarksForFeed`, `notesForFeed`, `postsForFeed`, `redirects`. Do not list `bookmarks`: it is a genuine topic tag (see Surprises), and its page must exist.
3. `json-feeds-valid`: every `feed.json` under `<dir>/follow/` parses with `JSON.parse` and has a string `version`, a string `title` and an `items` array. Every item has string `id`, `url`, `title` and `content_html`, and, where present, `summary` and `image` are strings.
4. `xml-feeds-valid`: every XML feed passes `XMLValidator.validate` and has a non-empty feed-level title (`feed > title` for Atom, `rss > channel > title` for RSS). This covers `<dir>/feed.xml`, `<dir>/bookmarks/feed.xml`, `<dir>/follow/*/feed.atom`, `<dir>/follow/*/feed.rss` and `<dir>/sitemap.xml`. No `href`, `xml:base` or `<link>` value contains `undefined` or starts with `undefined`.
5. `redirect-stubs`: for every Markdown file under `src/` whose front matter has `redirectFrom` (a string or a list; parse front matter with `js-yaml`, already installed), each listed path has a file `<dir><path>index.html` (or `<dir><path>` if the path ends in `.html`) containing `http-equiv="refresh"`. Skip `src/feed.njk`, which is not Markdown.
6. `sequoia-slugs-resolve`: for every entry in `.sequoia-state.json` (in its `posts` object, each value has a `slug`), the file `<dir>/blog/<slug>/index.html` exists.
7. `no-base-href`: no HTML file contains `<base href=`.
8. `picture-img-dimensions`: every `<img>` inside a `<picture>` has numeric `width` and `height` attributes.
9. `tag-links-resolve`: every `href` in HTML files that starts with `/tags/` resolves to a file. Strip any trailing slash and query, then require `<dir>/tags/<name>/index.html`.
10. `single-asset-version`: across all HTML files, the set of distinct `href` values pointing at `/assets/css/global.css` has size 1, and likewise for `src` values pointing at `/assets/scripts/app.js`.
11. `og-image-is-image`: every `<meta property="og:image">` content is an absolute URL ending in `.jpg`, `.jpeg`, `.png` or `.webp`.

Then build the current site into a baseline folder outside the repository, record the list of output files, and run the check. It must fail on checks 1, 2, 4, 5, 7, 8, 9, 10 and 11, and should pass 3 and 6. Record the actual result in `Surprises & Discoveries`; this proves the checks detect the known bugs.

Acceptance:

- `node helpers/check-build.js /tmp/site-baseline/prod` prints the expected FAIL lines and exits 1.
- `/tmp/site-baseline/files.txt` lists every output file.


#### Milestone 1: fix the production bugs

Each fix below is small and independent. When all are done, a production build must pass every check except `picture-img-dimensions` (fixed in Milestone 8). The output file list must equal the baseline's except for:

- the removed system tag pages;
- the removed `_redirects`;
- the added redirect stub pages.

##### Image `src`

In `config/shortcodes/image/index.js`, the production branch builds `staticData`; rename the `src:` property of each pushed object to `url:`. In the returned HTML, render `height="${lowsrc.height}"` only when `lowsrc.height` is defined. Delete the unused block that computes `imgSrc` from `this.page.image` (it references `this` inside an arrow function, and its result is unused). This is a stopgap; Milestone 8 replaces the whole shortcode.

##### Wrong pictures

In the same file, add a constant `COLLIDING_BASENAMES` containing `image`, `image-1`, `image-2`, `image-3` and `970c78e0-a6bd-4c64-b434-699c3dc03a0c`, with a comment that it is a stopgap removed in Milestone 9. In production, when the basename (the file name without folder and extension) of `src` is in the set, return a `<figure>` containing `<img src="<original src>" alt="..." loading="lazy" decoding="async">`, plus the caption if given, instead of the CDN variants.

##### Redirects

1. In `config/collections/index.js`, add and export a collection `redirects` that walks `collection.getAll()`. For each item whose `data.redirectFrom` is a non-empty string or array, emit `{ from, to: item.url }` for each path; skip items without a `url`. Register it in `.eleventy.js` alongside the other collections.
2. Create `src/redirects.njk`. It paginates over `collections.redirects` with `size: 1` and `alias: redirect`, and sets:
   - `permalink: "{{ redirect.from }}{% if not redirect.from.endsWith('.html') %}index.html{% endif %}"` (if Nunjucks rejects calling `endsWith`, add a tiny filter in `config/filters`);
   - `eleventyExcludeFromCollections: true`;
   - `excludeFromSitemap: true`.

   It outputs this minimal HTML document:

        <!doctype html><meta charset="utf-8"><title>Redirecting…</title>
        <link rel="canonical" href="{{ meta.url }}{{ redirect.to }}">
        <meta http-equiv="refresh" content="0; url={{ redirect.to }}">
        <meta name="robots" content="noindex">
        <p><a href="{{ redirect.to }}">This page has moved.</a></p>

3. If Eleventy stops with a duplicate permalink error, an old path collides with a real page. Remove that path from the post's `redirectFrom` and record it in `Surprises & Discoveries`.
4. Remove `redirectFrom: ['/feed/']` from `src/feed.njk`. A feed reader will not follow an HTML redirect, and the Bunny dashboard rule already handles `/feed/`.
5. Remove the meaningless `redirect:` key from `src/pages/blog.md`.
6. Delete `src/assets/helperfiles/_redirects.njk` and `netlify.toml`.

##### Tags

1. In `config/collections/index.js`, export a constant `SYSTEM_TAGS = ['posts', 'timeline', 'bookmark', 'notes', 'all']`, and use it in `tagList` instead of its inline list.
2. Add and export a collection `contentTags`: every tag found in `data.tags` of all items, minus `SYSTEM_TAGS`, de-duplicated and sorted alphabetically. Register it.
3. In `src/pages/tags.njk`, change the pagination `data:` from `collections` to `collections.contentTags`. This keeps every genuine topic page, including tags used only by bookmarks or notes, and removes only the collection-name pages.
4. Add a filter `topicTags` that takes a tags array and returns it without `SYSTEM_TAGS` (import the constant). Use it wherever tags are displayed:
   - the "Filed under" loop in `src/_layouts/footer.njk`;
   - the same loop in `src/_layouts/note.njk`;
   - anywhere else found by `grep -rn "for tag in" src`.

   Wrap the "Filed under" paragraph in `{% if tags | topicTags | length %}` so posts with only system tags show no empty line.
5. Change `config/filters/index.js`'s `filterTagsFromFeeds` to use `SYSTEM_TAGS` plus its extra feed-only exclusions (`bookmarks`, `feed`, `personal`, `site-meta`), keeping its output identical.
6. Rename the custom collection `bookmarks` (`getAllBookmarks`) to `allBookmarks`, so it no longer hides the tag collection of the same name. Update every use found by `grep -rn "collections.bookmarks\|collections\['bookmarks'\]\|'bookmarks'" src config .eleventy.js`; expect `src/pages/bookmarks.md` (pagination data), `src/bookmarks/data.njk`, `src/bookmarks/feed.njk`, `getBookmarksFeed`, `getGraph` and `bookmarksForFeed`. Do not rename the URL `/bookmarks/` or the directory data tag `bookmark`. Afterwards, `/tags/bookmarks/` lists the two posts tagged `bookmarks`, `/bookmarks/0/` still lists every bookmark, and `/bookmarks/data.json` is unchanged.

Tag case duplicates are fixed in Milestone 9, because that requires editing posts.

##### Activity graph

In `getGraph`, use all notes (`getAllNotes`) instead of `notesForFeed`. The archive page's post graph then counts every note.

##### Asset versions

1. In `src/_data/global.js`, replace the `random()` function with a property `buildId` computed once at module load, for example `Date.now().toString(36)`.
2. In `src/_layouts/base.njk`, replace `{% set assetHash = global.random() %}` with `{% set assetHash = global.buildId %}`.

##### Social image fallback

In `src/_includes/partials/meta-info.njk`, the `og:image` content must be, in order of preference:

1. `{{ meta.url }}/assets/images/social-preview/{{ ogImage }}` when `ogImage` is set;
2. the existing post fallback (`{{ title | slugify }}-preview.jpeg`) only for `layout == 'post'`, and only if that file exists in `src/assets/images/social-preview/` (add a small filter `socialPreviewExists(name)` that checks the folder once and caches the listing);
3. otherwise `{{ meta.url }}{{ meta.meta_data.opengraph_default }}`.

Confirm that `src/assets/images/opengraph-default.jpg` exists (it did on 2026-10-10). Set `og:image:alt` to `meta.meta_data.opengraph_default_alt` in the default case.

##### JSON feeds

1. In `src/_layouts/feed-json.njk`, emit every string value that comes from content or data with `| default("", true) | dump | safe` and without surrounding quotes, for example `"title": {{ post.data.title | default("", true) | dump | safe }},`. `default("", true)` is required: `dump` of an undefined value renders nothing and breaks the JSON (see Surprises). Apply this to:
   - the feed's `title`, `description`, `home_page_url` and `feed_url`;
   - each item's `id`, `title`, `url`, `summary`, `image`, `external_url`, `opengraph` and `date_published`.
2. Change `"description": "{{ meta.description }}"` (an undefined variable) to use `meta.siteDescription`.
3. Change `_posse.opengraph` from `post.url | getOpengraphUrl` to the same absolute social image URL the item's page uses. Today it points at a screenshot service rendering a page that does not exist. Implement it as a filter `socialImageUrl(data)` shared with `meta-info.njk`, so both always agree.
4. Verify with sparse and awkward content. Temporarily create `src/posts/2099-01-01-quote-check.md` with the title `He said "hello" \ goodbye # test: one` and no other optional fields. Build, run the check, inspect the item in `/follow/blog/feed.json`, then delete the file. Do not commit it.

##### Atom and RSS layouts

1. In `src/_layouts/feed-atom.njk`, replace `metadata.url` with `meta.url` and `metadata.language` with `meta.lang`.
2. In `src/bookmarks/feed.njk`, replace `meta.bookmarks.name` with the literal title `Chris McLeod's bookmarks`, and `meta.bookmarks.description` with `Links saved by Chris McLeod`. Keep everything else in that template unchanged.

##### Small template bugs

- In `src/pages/follow.md`, the "Short-form posts" row's Atom column links `[notesjson]`; change it to `[notesatom]`.
- In `src/pages/404.md`, replace both occurrences of `meta.address.email` with `meta.authorEmail`.
- In `src/_includes/partials/meta-info.njk`, delete the `<base href="{{ page.url }}">` line, and change `href="humans.txt"` to `href="/humans.txt"`. The base tag only restated the page's own URL, and it broke the relative `humans.txt` link.
- In `src/assets/helperfiles/humans.njk`, `meta.meta_data.mastodonCreator` does not exist; use `meta.meta_data.fediverseCreator`.
- In `src/assets/scripts/theme-toggle.js`, `themeColors` reads `meta.themeLight` and `meta.themeDark`, which do not exist, and has dark and light swapped. This file is rendered as Nunjucks (it is included from `src/_includes/partials/js-inline.njk`), so:
  1. at the top, set `{% set darkBase = designTokens.colors.items | where('name', 'machiatto-base') %}` and `{% set lightBase = designTokens.colors.items | where('name', 'latte-base') %}`;
  2. use `dark: '{{ darkBase[0].value }}'` and `light: '{{ lightBase[0].value }}'`.
- In `src/_layouts/note.njk`, delete the `{% if page.data.image %}` block. It reads `page.data`, which does not exist on `page`, and `image.data.imageAlt`, and no note has an `image`.

##### Likes

Create `src/likes/likes.11tydata.json` containing `{ "permalink": false, "eleventyExcludeFromCollections": true }`. In `src/likes/2024-01-08-6vdaa.md`, rename `like-of:` to `likeOf:`. (`src/likes/` is not watched by Sequoia, which only reads `src/posts`.)

##### Acceptance

- Build into `/tmp/site-m1` (production) and run `node helpers/check-build.js /tmp/site-m1 --allow picture-img-dimensions`; it exits 0.
- A `diff` of the sorted file lists shows only the expected differences listed at the top of this milestone.
- A visual check of the home page, one post with tags, one note, and the archive page shows no layout change apart from the "Filed under" lines no longer listing `posts` and `timeline`.


#### Milestone 1b (mage repository): front matter keys

This milestone edits `~/code/mage.chrismcleod.dev`, a separate git repository; commit there on its own branch and open its own pull request. Read its `CLAUDE.md` first and follow its conventions (Biome formatting, `.mjs` modules).

In `src/utils/micropubMarkdown.mjs`, write `bookmarkOf` instead of `bookmark_of`, and `likeOf` instead of `like_of`.

Acceptance: post a micropub bookmark to a locally running mage (see its README for the request format), or call the markdown generator function directly from a Node one-off. Confirm the generated front matter contains `bookmarkOf:`. The owner deploys mage; record the deployment in `Progress`.


#### Milestone 2: CI hardening and checks before publishing

1. Create `.nvmrc` containing `24`.
2. In `package.json`, set `engines.node` to `>=22`. The code uses JSON import attributes and global `fetch`, and mage already requires 22.
3. Add exact-pinned development dependencies:
   - `pagefind` (1.5.2 at time of writing);
   - `sequoia-cli` (0.5.7).
4. Change the scripts `build:index` to `pagefind --site dist` and `index:serve` to `pagefind --site dist --serve`; they then use the locally installed, pinned binary.
5. Run `npm install` so `package-lock.json` records them.

In `.github/workflows/deploy-to-bunny.yml`:

- Fix the job condition so the declared `workflow_dispatch` trigger works. Remove the `if:` line, or add `|| github.event_name == 'workflow_dispatch'`.
- Add at workflow level:

        concurrency:
          group: deploy-develop
          cancel-in-progress: false

- Add `actions/setup-node@v4` with `node-version-file: .nvmrc` and `cache: npm` before installing.
- Replace `npm install` with `npm ci`.
- Delete the "Install Sequoia" step and run `npx sequoia publish` instead of `sequoia publish`.
- Order the steps as: checkout, Tailscale, cache restore, setup-node, `npm ci`, `npm run og`, `npm run build`, `npm run check -- --allow picture-img-dimensions` (named "Check build before publishing"), `npx sequoia publish`, `npm run build`, `npm run check -- --allow picture-img-dimensions` (named "Check final build"), commit generated state, cache save, deploy. Pass the `MAGE_API_TOKEN` environment variable to both build steps until Milestone 5 removes the build-time fetch.
- Remove `BLIZZARD_CLIENT_ID` and `BLIZZARD_CLIENT_SECRET`.
- In the commit step, add a comment explaining the recovery path. If a run fails after `sequoia publish`, re-run the workflow: the posts already published are recorded in `.sequoia-state.json` only if the commit step ran. If it did not run, Sequoia will see those posts as new again, so check the AT Protocol records before re-running, and if necessary commit the state file by hand.

Create `.github/workflows/check.yml`, triggered on `pull_request`, with no secrets. It runs checkout, setup-node (same settings), `npm ci`, `npm run build` and `npm run check -- --allow picture-img-dimensions`. Until Milestone 5, the build tries to fetch Paintslam data without a token and gets nothing. That is acceptable because no check depends on Paintslam, so note it as expected in the workflow file's comments.

Acceptance:

- Open the pull request for Change A; the check workflow passes.
- After merging, the deploy workflow passes on `develop`, and a manual "Run workflow" from the Actions tab runs the job instead of skipping it.
- Introduce a deliberate failure on a scratch branch to prove the check fails the job: run the workflow on that branch via manual dispatch after temporarily allowing that branch. Alternatively, run `npm run check` locally against a `dist/` with an injected `src="undefined"`. Record which method was used.


### Change B — configuration, feed and data cleanup


#### Milestone 3: delete what is unused

Goal: remove code, templates, assets and dependencies that nothing uses, without changing output. Before deleting each item, confirm it is unused with a search across `src/`, `config/`, `helpers/`, `.eleventy.js`, `tailwind.config.js` and `.github/` (for example `grep -rn "includeRaw\|include_raw" src config helpers .eleventy.js`). If a search finds a real use, keep the item and record it in `Surprises & Discoveries`.

##### Files and folders

Delete:

- `config/events/` (never imported).
- `config/shortcodes/includeRaw/`, with its registration and export.
- `src/social-preview.njk`, and its entry in `.prettierignore`. It is excluded from output but is still paginated over every post on each build; the OG design now lives in `helpers/og-template.js`.
- The Warcraft integration:
  - `src/_data/warcraft.js` and `src/pages/warcraft.njk`;
  - the commented `warcraft` block in `src/_data/meta.js`.
- The blogroll machinery, which reads `src/subscriptions/*.md` files that do not exist:
  - `src/_layouts/links.njk`;
  - the `subscriptions` collection and `getAllSubscriptions`;
  - `src/subscriptions/`.

  Then change `src/pages/links.md` to `layout: page`.
- `src/_includes/svg/` (the whole folder).
- `src/_includes/schemas/`, which is never included. The `schema: blog` front matter in `post.njk`, `note.njk` and `bookmark.njk` does nothing, so delete those lines too.
- `src/_includes/partials/blog-card.njk` (empty).
- These unused icons: `src/_includes/icons/arrow-up-right-square.svg`, `icons/bookmark.svg`, `icons/social-linkedin.svg` and `icons/social-twitter.svg`. The footer includes `icons/social-<icon>` only for the entries in `src/_data/social.json`, which are github, mastodon, kofi and rss.

##### Fonts

The design token file `src/_data/designTokens/fonts.json` puts iA Writer Quattro, iA Writer Duo and Cascadia Code first, so Inter, Red Hat and Roboto Mono are never used. Yet `post.njk`, `note.njk` and `bookmark.njk` preload Roboto Mono on every page. Delete:

- `src/assets/fonts/inter/`, `redhat/` and `robotomono/`;
- their `@font-face` blocks in `src/assets/css/global/fonts.css`;
- the names `Redhat`, `Inter` and `RobotoMono` from `fonts.json`;
- the `preloads:` front matter from those three layouts;
- the commented-out preloads in `src/_layouts/base.njk`.

Delete every `*.eot` file under `src/assets/fonts/`; no CSS references them. Keep the `.woff` files, because `helpers/generate-og-images.js` installs them to render preview images.

##### Filters

In `.eleventy.js` and `config/filters/index.js`, remove these filters: `limit`, `escape`, `toHtml`, `toAbsoluteUrl`, `stripHtml`, `toJson`, `fromJson`, `cssmin`, `jsmin` (and the `jsminCache`), `keys`, `values`, `entries`, `getKeyedData`, `getKeyedPostData`, `splitlines` and `jsonToString`.

Then:

- In `config/filters/posse.js`, remove `getTitleForOg`, `getOgImageUrl` and `getOpengraphUrl` (no longer used after Milestone 1).
- Reimplement `where` without lodash:

        (items, key, value) => items.filter(item => key.split('.').reduce((o, k) => o?.[k], item) === value)

- In `config/filters/mastodonCounter.js`, delete everything except `getMastodonLength`. The `regexen` object, `regexSupplant`, `stringSupplant` and `urlRegex` are never called.
- `config/filters/utils.js`: no template uses its `getAlmanac*` helpers. Delete the file and the `import * as utils` line in `posse.js`.
- In `.eleventy.js`, remove `addWatchTarget('./utils/*.js')` (there is no such folder) and the commented `bundlerPlugin` line.

##### Transforms

Remove the `prettier` transform and the `prettier` import from `.eleventy.js`. Delete `config/transforms/` and its registration.

##### Dependencies

Remove from `package.json`:

- `@catppuccin/tailwindcss`
- `sanitize-html`
- `netlify-plugin-cache`
- `postcss-cli`
- `inquirer`
- `markdown-it-emoji` (installed but never used by `config/plugins/markdown.js`)
- `@11ty/eleventy-plugin-bundle` (bundling is built into Eleventy 3)
- `clean-css`
- `lodash`
- `commander` (also delete `new Command()` and `program.parse` from the four helpers; they define no options)

Keep `html-minifier-terser` until Milestone 9, because the old image shortcode uses it. Keep `prettier` as a development tool. Run `npm install` to update `package-lock.json`.

Also in `package.json`:

- Delete the script `start-search` (it calls a non-existent `index:local`).
- Delete the script `generate-images` (an unflagged copy of `build`).
- Change `repository.url` to this site's repository; use the `origin` remote URL from `git remote get-url origin`.
- Change `description` to "Personal website of Chris McLeod.".

##### Acceptance

- Build into `/tmp/site-m3` (production). The sorted file list equals Milestone 1's, minus `warcraft/warcraft.json`, the removed font files and the `.eot` files.
- `npm run check`-equivalent on `/tmp/site-m3` gives the same result as Milestone 1.
- The HTML of three sample pages (home, one post, `/bookmarks/0/`) is identical to Milestone 1 except for whitespace (Prettier no longer formats it) and the removed Roboto Mono preload. Compare with `diff <(npx prettier --parser html a.html) <(npx prettier --parser html b.html)`.


#### Milestone 4: restructure configuration, merge duplicates, consolidate feeds

##### Configuration as plugins

1. Change `config/filters/index.js`, `config/shortcodes/index.js` and `config/collections/index.js` so that each has a default export that is an Eleventy plugin: a function `(eleventyConfig) => { ... }` that registers its own filters, shortcodes or collections. Keep the named exports that other modules import, such as `slugifyString` and `SYSTEM_TAGS`.
2. Register the `posse.js` filters from the filters plugin.
3. `.eleventy.js` then only sets global options and calls `eleventyConfig.addPlugin(...)` for each `config/` module, the template languages, and third-party plugins.
4. Delete the ten `addLayoutAlias` calls. Eleventy resolves `layout: post` to `src/_layouts/post.njk` without an alias; the proof is that `layout: feed-rss` already works with no alias.
5. Delete the opening comment block that refers to a non-existent `config/plugins/index.js`.

##### Template partials

- Create `src/_includes/partials/pagination.njk` from the identical pagination `<section>` in `src/_layouts/blog.njk` and `src/_layouts/bookmarks.njk`, and include it from both.
- Create `src/_includes/partials/old-post-warning.njk` from the "Proceed With Caution" aside. `post.njk` and `note.njk` currently differ in wording; use the `post.njk` wording for both.
- Create `src/_includes/partials/post-list-item.njk` from the list item markup in `home.njk`, `blog.njk` and `src/pages/tags.njk` (title link, date partial, description). Include it from all three, and remove the `TODO: duplicate` comment in `home.njk`.
- Move `src/_layouts/footer.njk` to `src/_includes/partials/post-footer.njk`, because a layout folder is the wrong home for a partial. It keeps Milestone 1's `topicTags` filtering. Include it from `post.njk`, `page.njk` and `note.njk`, replacing `note.njk`'s inline copy.

##### Feeds

The rule for this section: every public feed keeps its contract exactly (see the Decision Log).

What exists today:

- nine stub files: `src/{posts,bookmarks,notes}/{rss,atom,json}.njk`;
- three layouts: `feed-rss.njk`, `feed-atom.njk` and `feed-json.njk`;
- two hand-written Atom feeds: `src/feed.njk` at `/feed.xml`, and `src/bookmarks/feed.njk` at `/bookmarks/feed.xml`;
- three feed-limited collections: `postsForFeed` (24), `bookmarksForFeed` (50) and `notesForFeed` (50);
- a hard-coded list of nine feed URLs in `meta.feeds`.

Replace all of this with one data file and one template per format.

**1. The feed data file.** Create `src/_data/feeds.js`, exporting an array with one entry per feed:

    [
      { key: 'blog', name: 'Blog Posts', collection: 'posts', limit: 24,
        legacy: { url: '/feed.xml', limit: 24, id: 'https://chrismcleod.dev/',
                  title: "Chris McLeod's blog", subtitle: 'Blog posts by Chris McLeod, posted to https://chrismcleod.dev',
                  entryLink: 'permalink', footer: false } },
      { key: 'bookmarks', name: 'Bookmarks', collection: 'allBookmarks', limit: 50,
        legacy: { url: '/bookmarks/feed.xml', limit: 24, id: 'https://chrismcleod.dev/',
                  title: "Chris McLeod's bookmarks", subtitle: 'Links saved by Chris McLeod',
                  entryLink: 'bookmarkOf', footer: true } },
      { key: 'notes', name: 'Notes', collection: 'allNotes', limit: 50 }
    ]

Rather than literal strings, take the blog `title` and `subtitle` from `meta.blog.name` and `meta.blog.description` (import `meta.js`), so they cannot drift. The collections `posts`, `allBookmarks` and `allNotes` are the full, newest-first collections. `posts` and `allBookmarks` exist after Milestone 1. Add `allNotes` (from `getAllNotes`) in `config/collections/index.js`. Use a name that is not also a tag, so it cannot hide a tag collection the way `bookmarks` did. Feed templates take the first `feed.limit` items with `collections[feed.collection].slice(0, feed.limit)` (and `feed.legacy.limit` for the legacy feeds).

**2. The shared Atom body.** Create `src/_includes/feeds/atom-body.njk`. It renders an Atom feed from these variables, set by the including template:

- `feedTitle`, `feedSubtitle`, `feedId` and `selfUrl`;
- `items` (already limited);
- `entryLink` (`'permalink'` or `'bookmarkOf'`);
- `footer` (boolean).

For each item it renders:

- `<id>`: the absolute permalink;
- `<link href>`: the absolute permalink, or the item's `bookmarkOf` when `entryLink == 'bookmarkOf'`;
- `<title>`;
- `<updated>`;
- `<content type="html">`: `templateContent` passed through `htmlToAbsoluteUrls`, followed (when `footer` is true and the item has `feedFooter`) by the escaped `<hr>` and rendered footer exactly as `src/bookmarks/feed.njk` does today.

Write the feed-level `<author>` and `<link>` elements as they are today.

**3. The format templates.**

- Create `src/feeds/atom.njk`. It paginates over `feeds` with `size: 1` and `alias: feed`, uses the permalink `/follow/{{ feed.key }}/feed.atom` and the settings `eleventyExcludeFromCollections: true` and `excludeFromSitemap: true`, sets the variables from the current `/follow/` Atom layout's values (title `{{ meta.blog.name }} — {{ feed.name }} — Atom Feed`, id = self URL, `entryLink: 'permalink'`, `footer: false`), and includes the body.
- Create `src/feeds/atom-legacy.njk`. It paginates over the entries that have `legacy` (add a filter `withLegacy` or build the list in `feeds.js` as a second export), uses the permalink `{{ feed.legacy.url }}`, sets the variables from `feed.legacy`, and includes the body.
- Create `src/feeds/rss.njk` the same way from `feed-rss.njk`.
- Replace the JSON layout with a JavaScript template `src/feeds/json.11ty.js`. This is an Eleventy template written in JavaScript: a default-exported class whose `data()` returns the pagination settings and whose `render(data)` returns a string. It builds the feed as a plain object and returns `JSON.stringify(feedObject, null, 2)`, which removes all escaping concerns. Inside `render`, filters registered with `addFilter` are available as `this.makeTootText(...)`, `this.makeBlueskyText(...)`, `this.filterTagsFromFeeds(...)`, `this.stripIndex(...)` and `this.socialImageUrl(...)`. Keep every field and value of the Milestone 1 JSON feed, including `_posse`, so downstream cross-posting keeps working. Optional values that Milestone 1 rendered as `""` stay `""`.

**4. Clean up.**

- Delete the nine stubs, the three feed layouts, `src/feed.njk` and `src/bookmarks/feed.njk`.
- Delete the three `*ForFeed` collections.
- Remove `collectionName` and `name` from the directory data files.
- Replace `meta.feeds` with a loop in `src/_includes/partials/meta-info.njk` over `feeds` and the three formats, producing the same nine `<link rel="alternate">` tags and fixing the "JSOM" typo. The formats are Atom (`application/atom+xml`), RSS (`application/rss+xml`) and JSON (`application/feed+json`).
- Optionally, generate the table in `src/pages/follow.md` from `feeds` as well.

##### Acceptance

Compare against Milestone 1's output, not the original baseline:

- Build into `/tmp/site-m4` (production). The sorted file list equals Milestone 3's.
- `npm run check`-equivalent passes as before.
- Write a short Node one-off, `/tmp/compare-feeds.mjs`, that parses each XML feed with `fast-xml-parser`'s `XMLParser` and each JSON feed with `JSON.parse`, from both `/tmp/site-m1` and `/tmp/site-m4`. For all 11 feed files (nine `/follow/` feeds and two legacy Atom), it asserts deep equality after trimming whitespace in text nodes. Any difference must be explained and recorded in `Surprises & Discoveries`, or fixed.
- `.eleventy.js` is under about 60 lines.


#### Milestone 5: data snapshots, helper scripts, single slugify

##### Paintslam snapshot

Today `src/_data/hobby.js` has four problems:

- it is called twice per build;
- it writes a cache it never reads;
- it overwrites that cache with an empty object on failure;
- builds without the token produce no Paintslam pages but still link to one.

Replace build-time fetching with a committed snapshot:

1. Create `helpers/sync-data.js` and the npm script `"data:sync": "node helpers/sync-data.js"`.
2. With `MAGE_API_TOKEN` set, the script requests `${MAGE_URL || 'https://mage.chrismcleod.dev'}/hobby` with the bearer token. It validates that the response is an array of objects, each with `completedDate`, `game`, `item` and `modelCount`.
3. It transforms the data exactly as `hobby.js` does today: group by completion year, convert `modelCount` to an integer, sort each year by completion date.
4. It writes `data/hobby.json` atomically (write `data/hobby.json.tmp`, then rename).
5. It refuses to replace a non-empty snapshot with an empty result unless `--allow-empty` is given. On any failure it prints the reason, leaves the file unchanged and exits with code 1.

Then:

- Rewrite `src/_data/hobby.js` to read and return `data/hobby.json`, returning `{}` if the file is missing.
- `src/_data/navigation.js` imports the same module (a plain function call, no network). It includes the Paintslam menu item only when at least one year exists.
- Run `npm run data:sync` once with the owner's token and commit `data/hobby.json`; the data is public, because it is shown on the site.
- In CI, add a step "Sync data" before the first build. Its failure behaviour depends on what triggered the run:
  - On a `repository_dispatch` run (a Paintslam change, see Context and Orientation), fresh data is the reason the run exists, so a failed sync must fail the job and deploy nothing.
  - On a push or manual run, a failed sync is only a warning, and the build uses the committed snapshot.

  Use this step body:

        if npm run data:sync; then
          echo "Paintslam snapshot synced"
        elif [ "${{ github.event_name }}" = "repository_dispatch" ]; then
          echo "::error::Paintslam sync failed on a data-triggered run; not deploying stale data"
          exit 1
        else
          echo "::warning::Paintslam sync failed; using committed snapshot"
        fi

- Add `data/hobby.json` to the commit-generated-state step. That commit carries `[skip ci]`, so it does not trigger another run.
- Keep `repository_dispatch: types: [function_trigger]` in the workflow's `on:` block unchanged; Milestone 2's job-condition change must keep allowing it.
- Remove `MAGE_API_TOKEN` from the build steps' environment; it is only needed by the sync step.

##### Helper scripts

- **YAML front matter.** In `helpers/shared-utils.js`, replace the hand-written YAML generation in `generateFrontmatter` with `yaml.dump({ id, date, ...additionalFields })` from `js-yaml`. Add `js-yaml` as an exact development dependency at the version in the `overrides` block, 4.1.1; it is already imported by `helpers/generate-og-images.js` without being declared. The hand-written version does not quote values, so a bookmark title containing `: ` or ` #` produces invalid or truncated front matter.
- **One slugify.** Replace the local `slugify` functions in `helpers/newPost.js` and `helpers/newBookmark.js`, and the copied `slugifyString` in `helpers/generate-og-images.js`, with `import { slugifyString } from '../config/utils/index.js'`. Only new file names change; permalinks already use this function.
- **No content class.** Replace the `ContentGenerator` class (`helpers/content-generator.js`) with a plain exported function `createContentFile(type, filename, content)` in `shared-utils.js`, and delete the class file.
- **Shared URL prompt.** Extract the URL prompt plus metadata fetch shared by `newBookmark.js` and `newLike.js` into `promptForUrlWithMetadata(message)` in `shared-utils.js`.
- **Likes key.** `newLike.js` writes `likeOf`.
- **OG script exit status.** Make `helpers/generate-og-images.js` exit with code 1 when any image fails, so CI notices.

##### Acceptance

- With the network disabled (or `MAGE_API_TOKEN` unset), `npm run build` succeeds, produces the Paintslam pages from the snapshot, and the menu links to the newest year.
- `npm run data:sync` with a bad token exits 1 and leaves `data/hobby.json` unchanged (`git diff --exit-code data/hobby.json`).
- `npm run new:bookmark` with the URL of a page whose title contains a colon creates a file whose front matter parses. Check with:

        node -e "const y=require('js-yaml');const fs=require('fs');const t=fs.readFileSync(process.argv[1],'utf8').split('---')[1];console.log(y.load(t))" <file>

  Delete the test file afterwards.
- Output compared with Milestone 4 is unchanged apart from Paintslam pages now always being present.
- After Change B is merged, the owner edits or adds a Paintslam entry in the usual way. The Azure Function's dispatch starts a deploy run, the "Sync data" step reports a change, the run commits `data/hobby.json` with `[skip ci]`, and the deployed Paintslam page shows the edit. Record the run URL in `Progress`.


### Change C — image pipeline and content migration


#### Milestone 6 (prototype): manifest-driven picture rendering

Goal: prove, before touching content, that `<picture>` markup built from manifest entries is correct for every kind of image, and that mage's `/images/list` endpoint returns every record. This is a prototype. Its code is promoted in Milestones 7 and 8 if the acceptance below holds; otherwise revisit the approach and update the Decision Log.

##### Is `/images/list` complete?

In `~/code/mage.chrismcleod.dev`, with its `.env` loaded, run a Node one-off that uses mage's own Cosmos client setup (see how `src/app.mjs` creates `req.database`) to run `SELECT VALUE COUNT(1) FROM c` on the `images` container. Then count the records returned by `GET /images/list`, either from a local mage server or the deployed one, with the token.

If the counts differ, the `ORDER BY c.createdAt` risk is real. Do this contingency, recorded in the Decision Log:

1. Add `GET /images/all` to mage's `src/routes/images.mjs`. It queries `SELECT c.original, c.metadata FROM c` with no `ORDER BY`, inside the existing authentication, with an `@openapi` comment like its neighbours.
2. Use that endpoint in Milestone 7 instead; the owner deploys mage.

Record the counts in `Surprises & Discoveries` either way.

##### The manifest module

Create `config/images/manifest.js`, exporting:

- `RESIZED_BASE = 'https://assets.chrismcleod.dev/chrismcleod.dev/assets/resized'`;
- `FORMATS = ['avif', 'webp', 'jpeg']`;
- `CANDIDATE_WIDTHS = [320, 570, 650, 820, 960, 1200]`;
- `isCdnImage(url)`: true when the host is `assets.chrismcleod.dev`;
- `normaliseUrl(url)`: parse with `new URL`, lower-case the host, collapse repeated slashes in the path (content contains at least one `assets//` double slash), and keep path case and any query string; drop only the hash;
- `basenameOf(url)`: the file name without folder and extension;
- `variantUrl(originalUrl, width, format, entry)`: returns `${entry?.resizedBase ?? RESIZED_BASE}/${basenameOf(originalUrl)}-${width}.${format}`;
- `loadManifest()`: reads `data/images.json` once and caches the parsed object;
- `resetManifestCache()`: clears that cache;
- `lookup(url)`: returns the entry for `normaliseUrl(url)`, or `undefined`.

The manifest format (`version` 1) is:

    {
      "version": 1,
      "images": {
        "https://assets.chrismcleod.dev/chrismcleod.dev/assets/images/2015/01/silverlight-upgrade-warning.png": {
          "width": 482,
          "height": 611,
          "variants": { "avif": [320], "webp": [320], "jpeg": [320] },
          "source": "probe"
        }
      }
    }

Field meanings:

- `width` and `height` are the dimensions of the original when known (probe), or of the largest available variant (mage, which does not store the original's dimensions; the aspect ratio is the same).
- `variants` maps each format to the ascending widths that exist on the CDN; it may be empty.
- `source` is `mage` or `probe`.
- `resizedBase` is optional, present only when a mage record's variant URLs are not under `RESIZED_BASE`.

Keys are normalised URLs, sorted, so diffs stay small.

##### The renderer

Create `config/images/picture.js`, exporting `renderPicture({ src, alt, className, loading = 'lazy', sizes = '(min-width: 55rem) 820px, 100vw' })`. It looks up the entry, then:

- **No entry:** return `<img src alt loading decoding="async">` with no invented dimensions, and record the URL in a module-level set. Export `reportMissingImages()`, which prints one aggregated warning, `[images] N images have no manifest entry; run npm run images:sync`, followed by the URLs, and then clears the set. Milestone 8 calls it after each build.
- **Entry with all `variants` empty:** return `<img>` of the original with `width` and `height`.
- **Otherwise:**
  1. Build an Eleventy Image metadata object. For each format with at least one width, create an array of `{ format, width, height: Math.round(width * entry.height / entry.width), url, sourceType: 'image/<format>', srcset: '<url> <width>w' }`, where `url` comes from `variantUrl(...)`.
  2. Return `generateHTML(metadata, { alt, sizes, loading, decoding: 'async', class: className })` from `@11ty/eleventy-img`. Import its default export and use the `generateHTML` property; the package is CommonJS.

  Eleventy Image picks the largest JPEG for the fallback `<img src>`, and the `width` and `height` from it. `generateHTML` handles attribute escaping.

##### The prototype script

Write `helpers/prototype-picture.js`. It builds manifest entries in memory for these images:

- a mage upload: take its record from `/images/list` (or the contingency endpoint) and convert it as in Milestone 7 step 2;
- a large legacy image: `https://assets.chrismcleod.dev/chrismcleod.dev/assets/images/2014/05/bloodspire_2560x1440.jpg`;
- a small legacy image: `.../assets/images/2015/01/silverlight-upgrade-warning.png`;
- a colliding image: `.../2021/08/image.png`.

For the legacy images, probe:

1. Download the original and read its size with the `ImageSize` function that `@11ty/eleventy-img` re-exports. `Image.ImageSize(buffer)` returns `{ width, height, type }`. Use it rather than importing `image-size` directly, which is only a transitive dependency.
2. For each format, and each width in `CANDIDATE_WIDTHS` plus the original width, send `fetch(url, { method: 'HEAD' })` and keep the widths that answer 200.

Then apply the collision rule: an image whose basename is shared with any other CDN image URL in content gets empty `variants`.

The script prints the entries and the HTML for each. It then sends a HEAD request to every URL in the generated `srcset` and `src` attributes and prints the status. For the mage upload, it also prints whether every `url` in the mage metadata equals `variantUrl(...)`.

##### markdown-it-image-figures

Install `markdown-it-image-figures` (2.1.1 at time of writing) in a scratch script, and confirm two things:

- With the option `{ figcaption: 'title' }`, a paragraph containing only `![alt](url "Caption")` renders as `<figure>` containing the image and `<figcaption>Caption</figcaption>`.
- A custom `md.renderer.rules.image` still controls the image markup.

Record the exact output in `Artifacts and Notes`.

##### Acceptance

- Every URL printed by the prototype answers 200.
- The colliding image renders as a plain `<img>` of its original.
- The small legacy image lists only existing widths.
- The mage record's URLs match the pattern, or the mismatch is recorded and `resizedBase` is planned.
- The `/images/list` completeness question is answered.

Record the evidence. If any assumption fails, stop and update the Decision Log before continuing.


#### Milestone 7: the image manifest and its sync script

Create `helpers/sync-images.js` and the npm script `"images:sync": "node helpers/sync-images.js"`. It takes these steps, in order:

1. **Load.** Load `data/images.json`, or start from `{ "version": 1, "images": {} }`.
2. **Read mage.** If `MAGE_API_TOKEN` is set, `GET ${MAGE_URL || 'https://mage.chrismcleod.dev'}/images/list` (or the contingency endpoint from Milestone 6) with `Authorization: Bearer <token>`.
   - Validate that the response is an array. If it is not, print an error and stop without writing.
   - For each record that has a string `original` and an object `metadata`, compute an entry:
     - `variants[format]` is the sorted list of `width` values in `metadata[format]`;
     - `width` and `height` are those of the widest JPEG variant (or the widest of any format);
     - `source` is `'mage'`;
     - `resizedBase` is set only if some variant `url` differs from `variantUrl(...)`; in that case it is the folder part of those URLs.
   - Upsert the entry under `normaliseUrl(original)`. mage entries replace probe entries. Never delete entries.
   - If the response is empty while the manifest already contains `mage` entries, print `suspicious empty response from mage; no mage entries changed`.
   - If the request fails or the token is missing, print a warning and continue.
3. **Probe new URLs.** Scan every `.md` and `.njk` file under `src/` for CDN image URLs, using the regular expression `https://assets\.chrismcleod\.dev/[^"')\s]+\.(?:png|jpe?g|gif|webp|avif)` with the case-insensitive flag. Probe each normalised URL that is not yet in the manifest exactly as in the Milestone 6 prototype, with at most four requests in flight; `--reprobe` probes every probe-sourced URL again. A URL whose original cannot be downloaded is reported and skipped (no entry is written, so the renderer falls back to the original URL).
4. **Collisions.** Group all manifest keys and all scanned URLs by `basenameOf`. For every group with more than one distinct normalised URL, set `variants` to `{}` for each member. This applies whatever the source, because a shared basename means the flat `resized/` folder cannot hold both images' variants. Print the affected URLs.
5. **Write.** Write the manifest atomically (temporary file, then rename) with keys sorted and two-space indentation. Then print a summary: counts of mage, probed, collision-only and unreachable images.

Run it once locally (on the Tailscale network, with `MAGE_API_TOKEN` exported from the owner's `.env`) to create the manifest. The first run probes about 250 legacy URLs and takes a few minutes; later runs only contact mage, plus any new URLs. Commit `data/images.json`.

In CI, add a step "Sync images" running `npm run images:sync` after "Sync data", using the same warning-on-failure pattern, and add `data/images.json` to the commit-generated-state step.

Acceptance:

- Running `npm run images:sync` twice in a row: the second run makes no change (`git diff --exit-code data/images.json` returns 0).
- The summary lists all 13 colliding URLs (see Surprises) with empty variants.
- Every CDN URL in content has an entry, or is listed as unreachable.
- Running with an invalid token changes nothing.


#### Milestone 8: Markdown images, template helpers, development reload

##### The Markdown image rule

In `config/plugins/markdown.js`:

1. Add the `markdown-it-image-figures` plugin with `{ figcaption: 'title' }`.
2. Override `markdownLib.renderer.rules.image`, keeping a reference to the default rule.
   - When the token's `src` is not a CDN image, call the default rule, adding `loading="lazy"` and `decoding="async"` attributes to the token first.
   - Otherwise, compute `alt` with `self.renderInlineAsText(token.children, options, env)` and return `renderPicture({ src, alt })`.

Because this runs during Markdown rendering, the same markup appears in pages and in every feed's content.

##### Template helpers and the shortcode

- Add a filter `picture` in the filters plugin, `{{ src | picture(alt, className) }}`, which returns `renderPicture(...)`. Use it in `src/_includes/components/gallery.njk` instead of `{% image %}`.
- Reimplement the `{% image %}` shortcode (`config/shortcodes/image/index.js`) on `renderPicture`.
  - Keep its positional signature `(src, alt, caption, sizes, classes, lazy)`. Accept the old seventh `imgWidths` argument and ignore it, because the available widths now come from the manifest.
  - Wrap the result in `<figure>`, adding `<figcaption>` when `caption` is given.
  - Remove the `Image()` call, the static CDN branch, the `COLLIDING_BASENAMES` stopgap and the `html-minifier-terser` import.

At this point existing content (still using the shortcode) and new Markdown images go through the same code. This "parallel path" lets Milestone 9 be verified by comparing output.

##### Development reload

Create `config/images/index.js`, an Eleventy plugin registered in `.eleventy.js`, which:

- calls `eleventyConfig.addWatchTarget('./data/images.json')`;
- calls `resetManifestCache()` in an `eleventyConfig.on('eleventy.before', ...)` handler, so every build, including each rebuild in the development server, reads the current file;
- calls `reportMissingImages()` in an `eleventy.after` handler.

##### Figure styling

Compare a page with a captioned image before and after. The old caption markup was `<figcaption class="cluster font-display"><p>…</p></figcaption>`. If the look changed, add a rule in `src/assets/css/blocks/prose.css` targeting `figure > figcaption` with the same styling, rather than adding classes in content.

##### Acceptance

- A cold development build finishes in under 30 seconds and never logs "Processing" from Eleventy Image:

        rm -rf .cache dist && time npx @11ty/eleventy --output=/tmp/site-m8-dev

- A production build into `/tmp/site-m8` passes `node helpers/check-build.js /tmp/site-m8` with no allowances. Remove the `--allow picture-img-dimensions` option from both CI workflows, and from the allowance list in `Progress`.
- With `npm start` running, add `![Test](https://assets.chrismcleod.dev/chrismcleod.dev/assets/71432c05-ff6b-4bbe-bcfb-e5cc4d0410fc.png "Caption")` to a scratch post (not committed). Then edit that URL's entry in `data/images.json`, for example by deleting the `avif` widths. The development server rebuilds, and the page served at `http://localhost:3000` reflects the change without restarting. Revert the manifest edit and delete the scratch post afterwards.
- The scratch post's page and `/follow/blog/feed.json` both contain the `<picture>` markup with `<figcaption>Caption</figcaption>` in the page.


#### Milestone 9: content migration and removal of the old path

##### The codemod

Write `helpers/codemods/image-shortcode-to-markdown.js`, a one-off script; delete it after use, since git history keeps it.

- Default mode is a dry run. It prints, per file, each planned replacement (before and after) and each call it will skip and why, and writes nothing. With `--write`, it applies the replacements.
- It handles only string-literal calls of these forms, allowing `{%-`/`-%}`, single or double quotes, and flexible spacing:
  - `{% image "SRC", "ALT" %}` becomes `![ALT](SRC)`;
  - `{% image "SRC", "ALT", "CAPTION" %}` becomes `![ALT](SRC "CAPTION")`. A caption of `""` counts as no caption.
- Inside `ALT`, backslash-escape `\`, `[`, `]`, `*`, `_` and `` ` ``. Inside `CAPTION`, escape `\` and `"`.
- Only replace a call that stands alone on its line. Report inline calls, which would not become figures, as skipped for manual review.
- Leave calls with four or more arguments unchanged, as well as calls whose arguments are not string literals (template variables), and print their locations. There are about six of these, including the home page portrait and three Bridgy screenshots.

Review the dry-run output, then run with `--write` on a clean working tree.

##### Other post edits in the same working tree

Before committing:

- Normalise tag case: change `APIs` to `apis` and `TV` to `tv` in post front matter. Find them with `grep -rlE "^\s*-\s*(APIs|TV)\s*$" src`, and check inline tag arrays too.
- Remove the unused `categories:` and `authors:` front matter blocks, left over from a WordPress import; no template reads them. Use a script that only touches those keys and their list items, preserving everything else byte for byte.

##### Verify before committing

1. Build into `/tmp/site-m9` (production). For every HTML file, the number of `<picture` occurrences must equal that in `/tmp/site-m8`. Inspect each difference; differences are expected only for skipped inline calls.
2. `node helpers/check-build.js /tmp/site-m9` passes.
3. If the owner can provide the AT Protocol credentials in the environment, run `npx sequoia publish --dry-run` and record the number of updates. Expect it to equal the number of changed post files, with no creates. If the credentials are not available, note in `Progress` that the owner must review the dry run before pushing.
4. Commit all content changes as one commit, with a message saying that it will republish the touched posts' AT Protocol records.

##### Remove the old path

- Delete `html-minifier-terser` from `package.json`.
- Confirm that `grep -rn "COLLIDING_BASENAMES" config` finds nothing.
- Delete the codemod script.

##### Acceptance

- `grep -rn "{% image" src` lists only the intentionally kept calls.
- The check passes.
- A cold development build stays under 30 seconds.


#### Milestone 10: documentation and retrospective

Rewrite `readme.md` to describe:

- requirements (`.nvmrc`), install (`npm ci`), commands (`start`, `build`, `check`, `data:sync`, `images:sync`, `og`, `new:*`), and how CI builds, checks, publishes and deploys, including the recovery note from Milestone 2;
- the content folders, and the front matter keys (`bookmarkOf`, `likeOf`, `redirectFrom`, `ogImage`, `atUri`);
- how images work: upload through mage, write Markdown (a title becomes the caption), run `npm run images:sync` or let CI do it, what the "no manifest entry" warning means, and that legacy colliding images render without variants;
- the snapshots in `data/` and what to do when a sync fails;
- the vendored Sequoia web components in `src/assets/scripts/` (their upstream is the Sequoia project; record the version they came from if known, and update them by replacing the files, never by editing them);
- the Bunny dashboard configuration that is not in the repository:
  - Edge Rules sending `/.well-known/webfinger*` and `/.well-known/host-meta*` to `https://fed.brid.gy/...`, and `/feed/` to `/follow/blog/feed.atom`;
  - the security headers `Content-Security-Policy: upgrade-insecure-requests; block-all-mixed-content;`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and the `Permissions-Policy` list from the old `netlify.toml` (copy it from git history).

Keep the credit to the Eleventy Excellent starter. Note for the owner the broken relative image in `src/posts/2022-12-24-my-first-prototype.md` (see Surprises). Fill in `Outcomes & Retrospective`.


## Concrete Steps

Run all commands from the repository root unless stated otherwise. Use a feature branch per change.

Milestone 0 baseline:

    git switch -c fix/production-and-checks          # Change A branch
    rm -rf /tmp/site-baseline && mkdir -p /tmp/site-baseline
    ELEVENTY_PRODUCTION=true npx @11ty/eleventy --output=/tmp/site-baseline/prod
    (cd /tmp/site-baseline/prod && find . -type f | sort) > /tmp/site-baseline/files.txt
    node helpers/check-build.js /tmp/site-baseline/prod; echo "exit $?"

Expected: the Eleventy build ends with a line like `[11ty] Copied 639 Wrote 1198 files in 15.32 seconds`, and the check prints FAIL lines for the known bugs, then `exit 1`.

For each milestone, build and compare (replace `mN`, and compare with the previous milestone's folder):

    ELEVENTY_PRODUCTION=true npx @11ty/eleventy --output=/tmp/site-mN
    (cd /tmp/site-mN && find . -type f | sort) > /tmp/site-mN.files
    diff /tmp/site-mPREVIOUS.files /tmp/site-mN.files | head -50
    node helpers/check-build.js /tmp/site-mN --allow picture-img-dimensions; echo "exit $?"

Expected after Milestone 1 (partial transcript):

    PASS no-undefined-attributes
    PASS no-system-tag-pages
    PASS json-feeds-valid
    PASS xml-feeds-valid
    PASS redirect-stubs (66)
    PASS sequoia-slugs-resolve
    PASS no-base-href
    WARN picture-img-dimensions: <n> images without dimensions (allowed)
    PASS tag-links-resolve
    PASS single-asset-version
    PASS og-image-is-image
    exit 0

Live checks after the owner deploys Change A:

    curl -s -o /dev/null -w '%{http_code}\n' https://chrismcleod.dev/2021/08/16/appraisal/
    curl -s https://chrismcleod.dev/2021/08/16/appraisal/ | grep -o 'url=[^"]*'
    curl -s https://chrismcleod.dev/about/ | grep -o '<meta property="og:image" content="[^"]*"'

Expected output:

- `200`;
- `url=/blog/appraisal/`;
- an `og:image` ending in `opengraph-default.jpg`.

The Eleventy Image remote cache (`.cache/`), and any `dist/` created by the old image shortcode in development builds, are disposable; delete them freely.


## Validation and Acceptance

The overall change is accepted when all of the following hold:

- A production build passes `npm run check` with no allowances, locally, in the pull-request workflow, and in the deploy workflow (both before publishing and after the final build).
- Compared with the baseline file list, the only differences are:
  - removed: system tag pages, `_redirects`, `warcraft/warcraft.json`, unused fonts;
  - added: redirect stubs.
- All nine `/follow/` feeds and the two legacy Atom URLs keep their contracts, as shown by the Milestone 4 comparison and the Milestone 1 corrections recorded there.
- A cold development build completes in under 30 seconds, and a build with no network access succeeds.
- Every `srcset` and `src` URL on three sample pages (one 2014 post with photos, the "unboxing" post, and the home page) answers HTTP 200. Check this with a short script that extracts URLs with cheerio and sends HEAD requests.
- After deployment, an old `redirectFrom` URL forwards to its new page, and the post that uses `2021/08/image.png` shows its own picture.
- This scenario works: write a new post with a Markdown image of a freshly uploaded mage image, run `npm run images:sync`, and build. The page shows a responsive `<picture>` with a caption.


## Idempotence and Recovery

Every build writes to a fresh folder under `/tmp`, so builds can be repeated.

`npm run check` is read-only. `npm run data:sync` and `npm run images:sync` change only their snapshot file, write it atomically, never shrink it because of a remote response, and are idempotent: a second run makes no change. To undo a bad sync, run `git checkout -- data/`.

The codemod in Milestone 9 defaults to a dry run and must be written on a clean working tree; if its result is wrong, `git checkout -- src` restores everything.

Nothing is published until a commit reaches `develop`, because pushing to `develop` deploys the site and runs Sequoia. So:

- merge each change only after its acceptance holds;
- push Milestone 9's content commit only after the Sequoia dry run, or the owner's review of it.

If a deployment goes wrong, revert the merge on `develop` and push; Bunny is overwritten by the next deploy. If a deploy run fails after `sequoia publish` but before the state commit, follow the recovery note in the workflow (Milestone 2).

The mage change in Milestone 1b only renames two keys, and the Milestone 6 contingency endpoint is additive. To roll either back, redeploy the previous mage image.


## Artifacts and Notes

Audit measurements (2026-10-10, Node 24.13.1, Eleventy 3.1.2):

    cold dev build:   real 3m14.670s  (92% in "Render": image shortcode downloading and encoding)
    warm dev build:   real 0m16.675s
    production build: real 0m16.028s
    [11ty] Copied 639 Wrote 1198 files
    distinct global.css URLs across pages: 1175

Eleventy Image behaviour that shaped the design (from `node_modules/@11ty/eleventy-img/src/image.js`, version 6.0.4):

- With `statsOnly`, a remote image is downloaded to read its size, unless `remoteImageMetadata: { width, height }` is passed in the options for that call.
- `getValidWidths` replaces a too-large width with the original width only while `originalWidth > Math.floor(previousWidth * minimumThreshold)`.
- `minimumThreshold` defaults to 1.25, in both the site (6.0.4) and mage (7.0.0).

Record the Milestone 6 prototype output here.


## Interfaces and Dependencies

New and changed modules at the end of the plan.

In `config/images/manifest.js`:

    export const RESIZED_BASE: string
    export const FORMATS: ['avif', 'webp', 'jpeg']
    export const CANDIDATE_WIDTHS: number[]
    export function isCdnImage(url: string): boolean
    export function normaliseUrl(url: string): string
    export function basenameOf(url: string): string
    export function variantUrl(originalUrl: string, width: number, format: string, entry?: ManifestEntry): string
    export function loadManifest(): { version: 1, images: Record<string, ManifestEntry> }
    export function resetManifestCache(): void
    export function lookup(url: string): ManifestEntry | undefined
    // ManifestEntry = { width: number, height: number, variants: Record<string, number[]>, source: 'mage' | 'probe', resizedBase?: string }

In `config/images/picture.js`:

    export function renderPicture({ src, alt, className?, loading?, sizes? }): string
    export function reportMissingImages(): void

Other modules:

- `config/images/index.js`: a default-exported Eleventy plugin (watch target, cache reset, missing-image report).
- `config/collections/index.js`:
  - `export const SYSTEM_TAGS`;
  - the collections `redirects`, `contentTags`, `allBookmarks` (renamed from `bookmarks`) and `allNotes` (all notes, newest first);
  - a default-exported plugin.
- `config/filters/index.js`:
  - the filters `topicTags`, `socialImageUrl`, `socialPreviewExists` and `picture`;
  - a default-exported plugin.
- `config/shortcodes/index.js`: a default-exported plugin.
- `helpers/check-build.js`: the CLI `node helpers/check-build.js <dir> [--allow <check>]...`.
- `helpers/sync-data.js` and `helpers/sync-images.js`: CLIs as described above.
- `helpers/shared-utils.js`: `generateFrontmatter` (now based on js-yaml), `createContentFile(type, filename, content)` and `promptForUrlWithMetadata(message)`.
- `src/_data/feeds.js`: the feed definitions.
- `src/_data/global.js`: `buildId`.
- Snapshots: `data/hobby.json` and `data/images.json`.
- mage (only if the Milestone 6 contingency applies): the route `GET /images/all`.

Dependencies, all pinned exactly (the repository's `.npmrc` sets `save-exact=true`):

- **Added:**
  - `fast-xml-parser`
  - `pagefind`
  - `sequoia-cli` 0.5.7
  - `markdown-it-image-figures`
  - `js-yaml` 4.1.1 (made explicit)
- **Removed:**
  - `@catppuccin/tailwindcss`
  - `sanitize-html`
  - `netlify-plugin-cache`
  - `postcss-cli`
  - `inquirer`
  - `markdown-it-emoji`
  - `@11ty/eleventy-plugin-bundle`
  - `clean-css`
  - `lodash`
  - `commander`
  - `html-minifier-terser` (in Milestone 9)

`@11ty/eleventy-img` stays, and is used only for `generateHTML` and `ImageSize`.


Revision note (2026-10-10, first version): written from the audit conversation, including the live-site checks and the eleventy-img and Sequoia source inspection summarised in Surprises & Discoveries.

Revision note (2026-10-10, second version): revised after an independent review and comparison with a competing plan (`/home/chris/.codex/worktrees/3ba4/next.chrismcleod.dev/docs/exec-plans/maintenance-and-images.md`).

Review findings addressed:

- JSON feed values now use `default("", true)` before `dump` (verified: `dump` of undefined emits nothing), with a sparse-content test.
- The aspect-ratio collision heuristic is removed; every colliding basename renders originals only.
- Displayed tags are filtered with `topicTags`, and a `tag-links-resolve` check is added.
- The legacy Atom feeds are modelled explicitly (limit 24, feed id, entry links, footer), and feed comparison is made against Milestone 1 output. The legacy bookmarks feed's empty title is now a Milestone 1 fix.
- CI runs `npm run check` before publishing and after the final build, with named allowances that are tracked in `Progress`.
- The manifest cache resets on every build, and the manifest is a watch target, with a development-server acceptance step.
- The work is split into Changes A, B and C.

Adopted from the competing plan, after verification:

- the per-page random asset version (1,175 distinct CSS URLs), fixed with a per-build id;
- the `og:image` fallback emitting the site URL;
- the activity graph using only 50 notes;
- the unused `markdown-it-emoji`;
- the broken `workflow_dispatch` condition, missing concurrency control, and unpinned Pagefind and Sequoia;
- a pull-request check workflow;
- `.nvmrc`;
- committed snapshots for Paintslam data (`data/hobby.json`, `npm run data:sync`);
- moving the image manifest to `data/images.json`;
- using mage's existing `/images/list` instead of a new endpoint, with a completeness check and a contingency;
- never shrinking snapshots on empty responses, because mage swallows database errors;
- a dry-run mode for the codemod;
- documenting the vendored Sequoia components.

Not adopted, with reasons recorded in the Decision Log:

- content-hashed assets;
- keeping the empty Warcraft output;
- a separate caption mechanism instead of Markdown titles;
- a final-HTML transform instead of a markdown-it rule;
- deploying before syndicating.

Revision note (2026-10-10, third version): the owner asked whether Paintslam updates would still rebuild the site once data moves to a committed snapshot. They will. The Azure Function's (and mage's) `repository_dispatch` only starts the deploy run, and that run's "Sync data" step fetches fresh data before building. One gap was closed: on `repository_dispatch` runs, a failed sync now fails the job instead of deploying the stale snapshot under a warning. Context and Orientation now describes the trigger, and Milestone 5 has an end-to-end acceptance step for it.
