# chrismcleod.dev

Chris McLeod's personal site, built with Eleventy 3.1.2, Nunjucks, Markdown and Tailwind. Based on [eleventy-excellent](https://github.com/madrilene/eleventy-excellent).

## Local development

Use Node **24.13.1** (`.node-version`) and the committed lockfile.

```sh
npm ci
npm start                 # full watch builds and http://localhost:3000
npm run build             # clean production output + pinned Pagefind 1.5.2 index
npm run preview           # serve the built site with Pagefind
npm test                  # Node's built-in tests
npm run check             # tests, strict output contracts, instrumented offline build
```

Builds use committed public data, require no service credentials and make no network requests. They never publish, prepare social previews, install fonts or rewrite content. The offline check blocks HTTP/fetch and image processing, checks alternate output assets and verifies source/state bytes remain unchanged. Keep source files stable while it runs. CSS/JS compilation finishes before pages; `assetUrl()` versions reflect final bytes. Full watch rebuilds include Markdown utility classes, imported assets, tokens and Tailwind configuration.

Content lives in `src/posts`, `src/notes`, `src/bookmarks` and `src/likes`. `npm run new:post`, `new:note`, `new:bookmark` and `new:like` create content explicitly. Authoring helpers use YAML serialization and the shared slug function. Existing permalinks and ATProto identifiers remain authoritative. Date formatting uses the configured Europe/London timezone so date-based note URLs stay stable on UTC CI runners. Read boundaries support historical `bookmark_of`, `like_of` and `like-of` aliases; new content uses camel case.

## Images and captions

```md
![Description](https://assets.chrismcleod.dev/path/photo.jpg "Visible caption")
```

A paragraph containing only an image becomes a figure. A nonempty Markdown title becomes one visible, escaped caption. Inline images and images in tight list items retain their title attribute; loose list paragraphs can contain figures. Empty alt text is allowed for decorative images. Raw HTML titles remain ordinary titles.

Mage owns upload/resizing. The site reads `config/images/manifest.json` once per build and reuses its exact URLs and dimensions with Eleventy Image **6.0.4**'s HTML generator. It never guesses variants or resizes/downloads during rendering. Unknown external images render normally. Unknown owned images render their original with an aggregated diagnostic; strict `check` rejects them. Verified small/ambiguous legacy images use measured originals when responsive derivatives are unsafe.

Retained `{% image src, alt, caption, sizes, classes, lazy, imgWidths %}` calls cover deliberate presentation options. The homepage portrait remains eager. Galleries retain their adapter. `imgWidths` filters stored variants; it cannot create a missing width/format.

```sh
npm run images:sync       # explicit authenticated Mage /images/list refresh
npm run images:sync -- --allow-shrink  # explicit reviewed deletion of missing Mage records
npm run images:backfill -- --report=/tmp/site-maintenance/legacy-images.json
npm run images:backfill -- --reprobe --report=/tmp/site-maintenance/reprobe.json
```

Provide `MAGE_API_TOKEN` through the environment or an ignored `.env`; optional `MAGE_URL` defaults to `https://mage.chrismcleod.dev`. Private network connectivity may be required. Sync rejects HTTP/shape errors, empty/shrinking sets and conflicting image identities; good files survive failure. After reviewing real Mage deletions, `--allow-shrink` removes missing Mage records while retaining legacy probe records. Run `npm run build && npm run check` afterward to catch references to removed images. Empty responses always fail because Mage can return an empty list on database failure; CI never enables deletion acceptance automatically. Only public fields are stored. Doubled-slash aliases require matching original byte digests. Backfill is a separate public-CDN operation: four workers, each awaiting the response body, ten-second timeouts, at most two retries, no encoding. It measures originals and successful historical derivative candidates. Matching aspect ratios do not establish ownership of a shared derivative; different original digests force original-only fallbacks. The CLI keeps an optional recovery checkpoint in `/tmp/site-maintenance/backfill-progress.json`; remove that task-owned checkpoint or use `--reprobe` to force remeasurement. Resolved catalogue entries need no requests on a repeat run.

One-time migration, comparison and benchmark tools are archived under `docs/exec-plans/tools/` for reproducing plan evidence. They are outside the build/release helpers. Run `node docs/exec-plans/tools/image-shortcode-to-markdown.js --check` for a read-only check (exit 1 if conversions remain). `--write` explicitly applies conversions; `--report=<path>` optionally writes a report. It handles quoted/multiline calls, Markdown delimiters and URL parentheses, and reports dynamic/presentation/inline-caption exceptions. The migration in this branch is one review wave: 209 calls in 111 files; four presentation exceptions remain. Keep those 111 content files in a separate commit when preparing the branch for merge. Do not rerun publication with deleted state or `--force`.

## Paintslam and social previews

```sh
npm run data:sync         # authenticated Mage /hobby refresh, atomic replacement
npm run data:sync -- --allow-empty  # explicit reviewed empty/shrinking reset
npm run og               # prepare missing social previews and corresponding front matter
npm run og:force         # explicitly regenerate previews
```

`data/hobby.json` is the last-good public snapshot. Pages and navigation share the same validated years. The authenticated Mage refresh verified on 2026-10-10 contains 145 rows and 594 models from 2018–2026, including API timestamps. Legacy space-separated UTC timestamps normalize to ISO before validation. Invalid/failed refresh preserves good bytes.

OG preparation uses the committed iA Writer fonts and Sharp/librsvg through Eleventy Image. It installs fonts under `~/.local/share/fonts/ia-writer` and calls `fc-cache`; provision fontconfig on Linux runners. It is an explicit authoring operation. Rendering resolves `ogImage`, an established committed title preview, then the existing default JPEG, checking local targets. HTML and feed `_posse.opengraph` share that resolver.

## Contracts, CI and recovery

`test/fixtures/site-contracts.json` records routes, per-feed identities/dates/fields and source permalink/date/atUri contracts from commit `6e68cb1`. `allowed-output-changes.json` explains precise corrections; Field exceptions record exact before/after values per item, including 50 RSS timestamps whose old formatter lost the British summer-time offset; RSS now consistently represents source instants in UTC. New authored feed entries may displace the oldest limited entries, while surviving historical IDs, order and dates remain checked. New public topics/hobby years and required pagination routes are derived from source/snapshot data. Declare other intended route/contract corrections explicitly.

```sh
node helpers/inventory-site.js --site=dist --out=/tmp/site-contracts.json
node helpers/check-build.js dist --require-images
node helpers/check-build.js dist --baseline=/tmp/site-contracts.json --report-only
npm run publication:plan  # local read-only hashes/actions; no service calls
```

The nine `/follow/{blog,notes,bookmarks}/feed.{atom,rss,json}` subscriptions and both legacy Atom URLs remain. Legacy bookmark limits, identifiers, external links and footers remain distinct. HTML redirect documents restore historical mappings and saved Sequoia slug links; they return HTTP 200. `/feed/` is owned by Bunny and remains its observed 301 to `/follow/blog/feed.atom`. Bridgy webfinger/host-meta 302s and security headers are edge configuration. Legacy Netlify files remain pending a Bunny dashboard audit; HTML documents cannot reproduce these HTTP rules.

PR validation has no service credentials, refresh, OG mutation, publication or deployment. Production serializes runs and executes installation → explicit refresh → OG preparation → tests/preflight build/check → inspected Sequoia **0.5.7** dry run → publication → exact state persistence → final build/check → Bunny deployment. Failed refresh may use validated last-good data only with logged strict coverage checks. Final rendering includes real identifiers assigned by publication.

`publication-migration.json` records the verified wave: **109 updates, zero creates, zero Bluesky candidates**. Verbose Sequoia 0.5.7 dry runs on 2026-10-10 used the existing Sequoia login, requiring no separate token: baseline content was up to date and migrated content completed validation with exactly these actions. Dry runs leave publication state unchanged and return before publication; they do not verify remote PDS writes. Owner review remains pending. Before enabling this wave, review its files and set repository variable `IMAGE_MIGRATION_APPROVED` to the fixture's `reviewDigest`. The gate also verifies migrated hashes and actions still match that reviewed wave. A successful exit alone is insufficient; validation can return early with exit zero. After all reviewed hashes are saved by the publisher, the pipeline marks the migration fixture as published and persists that marker with state, retiring this one-time gate. New later content is checked separately. Never put credentials into fixtures or logs.

Until this migration is approved, every production run that includes its pending updates stops before publication/deployment, including runs triggered by ordinary Micropub content. Sequoia publishes the whole pending set. Approve the reviewed wave before merging it into `develop`; bypassing the gate for new content would also publish the unreviewed migration. Unrelated changes pass when no migration files are pending, and the gate retires after the completed wave is durable.

Publication and deployment are separate external writes. After a publication attempt, including a partial publisher failure, persistence accepts only exact changed state/post/preview/snapshot/catalogue/publication-marker/migration-fixture paths, rejects unrelated changes/renames, and uses a normal fast-forward push. Before Git operations it saves exact public bytes, base revision, changed-file list and binary patch under `/tmp/site-publication-recovery`. On failure CI retains these as an artifact for seven days. Anyone with repository read access can download it; there is no additional artifact-specific restriction. Only whitelisted public files are included, including the hidden publication state; environment and credential files are excluded. If upload itself fails, recover from the runner before republishing. A competing push requires fresh validated integration; never force-push/rebase after publication. If final rendering/deployment fails, retry with durable state so unchanged documents and saved Bluesky references are skipped. Do not delete/recreate state to retry.

Detailed evidence and outstanding owner review/dashboard checks are in `docs/exec-plans/maintenance-and-images.md`. No publication or deployment is performed by local validation.
