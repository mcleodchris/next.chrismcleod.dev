# Simplify website maintenance and reuse CDN images in Markdown

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. It follows the owner's ExecPlan specification at `/home/chris/code/skills/depinator/references/PLANS.md`. That specification is outside this repository; all project context and execution requirements needed here are included below. Implementation and authenticated release checks are complete locally on `codex/simplify-site-and-images`; owner review remains pending.

## Purpose / Big Picture

Make Chris McLeod's personal website easier to maintain while preserving its design, content URLs and subscriptions. Fix broken image markup, structured output, collections, theme behaviour and workflow ordering; remove inherited machinery that no longer serves the site. A fresh checkout should build and preview using documented commands and committed public data without credentials for private services.

An author should be able to write `![Description](https://assets.chrismcleod.dev/path/photo.jpg "Visible caption")` and receive responsive image markup and a visible caption. Mage, the owner's upload service, already creates image sizes and hosts them on a content delivery network (CDN: a fast file host). The website must reuse those files without downloading or resizing images during a build. Image facts will live at `config/images/manifest.json`; builds read it once and use in-memory lookups. Explicit sync and legacy backfill commands perform network work separately.

Completion is demonstrated by a working local site, valid feeds, stable asset versions, correct old images and ordinary Markdown authoring. Maintenance and image milestones share baseline checks but can be reviewed independently. The subsequent user request authorised implementation on a new branch. External publication and deployment remain separate actions and have not occurred.

## Progress

- [x] (2026-10-10 19:38Z) Audit baseline `6e68cb1`, inspect Mage, and read both plans, review feedback and the owner's ExecPlan specification.
- [x] (2026-10-10 19:48Z) Consolidate catalogue location at `config/images/manifest.json`; record the owner's choice that Markdown image titles become visible captions.
- [x] (2026-10-10 19:48Z) Check current Mage filename safety and Sequoia 0.5.7 change detection and announcement conditions against source.
- [x] (2026-10-10) M0 Capture compatibility inventories and compact route/feed/source fixtures from `6e68cb1`, with precise allowed corrections.
- [x] (2026-10-10) M1 Pin commands/tools, compile assets before pages, and verify watch hashes and alternate output.
- [x] (2026-10-10) M2 Fix serialization, aliases, likes, graph/topics, theme, metadata and redirects; preserve eleven feed subscriptions with shared bodies/descriptors.
- [x] (2026-10-10) M3 Seed 145 actual published Paintslam rows from 2018–2026 and remove verified unused machinery.
- [x] (2026-10-10) M4 Measure 270 catalogue records and 2,133 exact variants; all 271 currently referenced owned URLs resolve, including aliases and original-only dispositions.
- [x] (2026-10-10) M5 Integrate page/feed Markdown enrichment and social previews; convert 209 shortcodes in 111 files as one uncommitted review wave, retaining four presentation exceptions.
- [x] (2026-10-10) M6 Implement separate validation/production workflows, explicit refresh, migration approval, inspected dry runs and durable publication recovery; rehearse failures using stubs.
- [x] (2026-10-10) M7 Rewrite documentation and complete local compatibility, offline, timing, watch, browser/search and recovery checks.
- [x] (2026-10-10) Release checks: authenticate Mage image/hobby refresh and confirm byte-identical repeat sync against real API data; repeat backfill also preserves the refreshed catalogue.
- [x] (2026-10-10) Release checks: run Sequoia 0.5.7 before/after dry runs using the existing login. Baseline is up to date; migrated content validates with 109 updates, zero creates and zero announcements. State/config bytes are unchanged.
- [x] (2026-10-10) Address colleague review: repair tight-list captions, validate all resolved redirect routes, declare XML dependency/discovery corrections, provide reviewed Mage pruning, simplify helpers and refresh release documentation; 32 focused tests and strict/offline checks pass.
- [ ] Release approval: owner review of the 109 updates and exact migration digest before publishing.
- [ ] Hosting: inspect Bunny dashboard rules/headers before retiring retained Netlify reference files. Live HTTP behavior has been recorded read-only.

## Surprises & Discoveries

Implementation observation: fragment-mode Cheerio parsing strips document wrappers when applied to a complete page. Enrichment now selects document mode for full HTML and fragment mode for feed fragments; a regression test preserves doctype, head/body and metadata. The final Pagefind index contains 887 pages.

Implementation observation: note and like date includes lacked `definedDate`, causing today's date to appear. Both now pass the authored date, and strict output checks compare their rendered timestamps against source. Captured note routes depend on Europe/London formatting; explicit site timezone configuration preserves them on UTC CI runners.

Implementation observation: a fresh UTC build exposed the RSS plugin formatter losing its GMT+1 offset in British summer time. RSS now uses UTC formatting, with 50 exact baseline timestamp corrections declared per item. Authored dates are unchanged; regression checks prove stable output in UTC and Europe/London.

Implementation observation: mobile checks exposed unbroken inline code/URLs and a wide Paintslam table. Inline code/links now wrap when needed, and the log table has a labelled, keyboard-focusable scroll region. Footer topic links use the same public-topic filter as tag pages.

Implementation observation: Sequoia may partially change state before failing. The pipeline persists state after a publication attempt even when it fails, stops before final render/deploy, and saves recovery bytes before Git operations. The migration gate retires only after all reviewed hashes appear in saved publisher state; that completion marker is persisted with the state so future ordinary edits are not permanently blocked by migration hashes.

Initial implementation observation: credentials were initially unavailable, so the Paintslam seed was recovered from published HTML at day precision and legacy image coverage came from explicit public-CDN downloads/probes. The owner subsequently supplied Mage credentials in an ignored `.env` and confirmed the existing Sequoia login. Authenticated refresh and both credential-aware dry runs are now verified.

Authenticated follow-up observation: 84 Mage hobby rows use space-separated UTC timestamps. Normalize that legacy syntax before strict date validation; invalid calendar dates still fail without replacing last-good bytes. The refreshed 145 rows retain all 594 models and completion days. Two item labels include API-provided trailing spaces.

Authenticated follow-up observation: Mage's current variant list omits a verified older avatar derivative referenced by site metadata. Preserve verified historical derivative URLs as aliases when refreshing a record, while retaining ambiguity rejection. Backfill checkpoints must also omit old keys already covered by canonical records/aliases; otherwise they can resurrect records after a verified doubled-slash identity merge. Regression tests cover both cases.

Review observation: Markdown-it hides paragraph tokens in tight lists. Replacing their tags does not make those tags render, so appending a caption creates an orphan `figcaption`. Hidden paragraphs now retain inline image titles; loose list paragraphs and blockquotes still produce valid figures.

Review observation: `collections.all` omits excluded feeds and exports. Eleventy's resolved `eleventy.contentMap` event includes those routes and fires before its duplicate-permalink check. A dedicated route guard now reports redirect collisions across every generated template, including future excluded outputs, without maintaining a duplicate route registry.

Observation: development image processing is the main cold-build bottleneck. `config/shortcodes/image/index.js` calls `Image(src, ...)` when `ELEVENTY_PRODUCTION` is absent, downloading remote originals and encoding three formats locally. The competing audit reported roughly 3m15s cold versus 16s warm/production; these are its measurements, not a reproduced performance guarantee. In production, the shortcode constructs records with `src` but renders `lowsrc.url` and `lowsrc.height`, which are absent. The earlier audit in this worktree found undefined image attributes on 119 HTML pages.

Observation: available variants cannot safely be inferred from dimensions. Mage and the website request different width lists, and Eleventy Image's width-selection threshold can produce different results. The competing audit found only 320px variants for the 482px-wide `assets/images/2015/01/silverlight-upgrade-warning.png`. Store actual URLs and dimensions, never a generated cross-product of widths and formats.

Observation: older originals can share flat derivative filenames and display another picture. The competing audit counted around 270 distinct CDN URLs, roughly 250 absent from Mage, and found `image.png` in multiple year folders sharing `resized/image-320.jpeg`. Its reported derivative aspect ratio differed from several originals. These counts are leads to remeasure in M0; matching aspect ratios alone cannot prove derivative ownership.

Observation: the review's upload-collision claim needs narrowing. Mage's `src/utils/fileHandler.mjs` calls `generateUniqueFilename`, using a UUID before processing. Current uploads with repeated original names therefore have distinct basenames. Legacy naming collisions still require checks on actual derivative URLs, not just catalogue keys.

Observation: Mage already provides the required API. `src/app.mjs` mounts authentication before `/images`. `GET /images/list` checks a Bearer token against Mage's `SHARED_SECRET`; the website supplies it as `MAGE_API_TOKEN`. `src/utils/imageList.mjs` selects `id`, `original`, `metadata`, `createdAt`, and `creationDate`. Format entries contain `url`, dimensions and private `outputPath`. Database failures become `[]`, so HTTP 200 alone does not establish a successful refresh. Capture dates are not reliable incremental-sync cursors.

Observation: Sequoia publishes posts to the AT Protocol, the network also used by Bluesky. The inspected `sequoia-cli` 0.5.7 bundle hashes `post.rawContent`, including front matter. Syntax migration schedules updates for touched posts. `--dry-run` returns before publication but requires credentials and can perform preparation/read operations. Announcement logic runs for creates AND updates: no saved `bskyPostRef` plus a date within `bluesky.maxAgeDays` (currently 30 in `sequoia.json`) can produce a Bluesky post. The competing plan's assertion that updates never announce is incorrect. Missing state can also classify a file as a create despite an existing `atUri`.

Observation: hand-assembled YAML fails on `: ` and ` #`. Default Nunjucks escaping in JSON turns quotes into HTML entities, changing strings; literal newlines can make JSON invalid. Test exact round trips, not merely parsing. Existing feeds differ in identifiers, limits and bookmark footers, so consolidation must compare each feed against its own baseline.

Observation: `hobby.js` fetches twice because `navigation.js` calls it separately, writes an unused cache, and replaces good data after failure. Navigation invents a current-year link when data is absent. Paintslam is the site's miniature-painting log, served through Mage's `/hobby` endpoint; its pages and navigation must use the same available years.

Observation: generated HTML runs through Prettier, while the minifier reads a different environment flag from the build. The earlier worktree audit measured 15.85s with formatting versus 4.04s without, with cache warmth a possible confounder. Random versions produced 1,175 stylesheet cache keys. CSS currently compiles alongside pages, so its final hash requires an ordering change.

Observation: confirmed smaller defects include the graph using the 50-note feed subset, tag pages for internal collections, absent/swapped theme colour fields, invalid social-image fallbacks, and CI publishing before building while excluding its manual trigger. The competing audit reports 66 `redirectFrom` mappings emitted only as Netlify `_redirects`, although hosting uses Bunny, a live 404 at `/2021/08/16/appraisal/`, and dashboard rules for `/feed/` and Bridgy endpoints. Recheck live configuration before retiring hosting files. Audit note counts differ; freeze neither count as a permanent assertion.

## Decision Log

Decision: keep Eleventy 3.1.2, Eleventy Image 6.0.4, Nunjucks, Markdown, Tailwind, Pagefind and Bunny. Rationale: fix duplicate mechanisms and correctness defects without a framework or styling rewrite. Date/Author: 2026-10-10, Codex.

Decision: use `config/images/manifest.json` and `Image.generateHTML`. Rationale: Mage owns resizing and its existing `/images/list` supplies exact metadata without a new Mage deployment. The stock image transform's dimension/width path would add downloads or infer unavailable variants. A thin HTML enrichment layer can reuse the generator instead. Date/Author: 2026-10-10, Codex, incorporating review feedback.

Decision: Markdown image titles become visible captions for standalone image paragraphs. Inline images retain valid inline markup and title attributes. Rationale: the owner explicitly chose visible captions; standalone figures support that convention without invalid paragraph nesting. Date/Author: 2026-10-10, Chris McLeod; recorded by Codex.

Decision: recover legacy metadata before switching the shortcode; ambiguous derivatives fall back to measured originals. Rationale: retain verified responsive coverage while correcting wrong-picture output; matching dimensions do not prove ownership. Date/Author: 2026-10-10, Codex.

Decision: network refresh is explicit locally and automatic before production validation. Rationale: builds/PRs remain service-independent while Mage/Micropub commits get responsive images without a manual laptop sync. Micropub is the content/upload API that can commit files to this repository. Date/Author: 2026-10-10, Codex.

Decision: compile assets in `eleventy.before` and expose current hashes through a template accessor. Rationale: page versions must match final bytes and refresh during watch builds. Date/Author: 2026-10-10, Codex.

Decision: migrate content in one reviewed wave, retaining exceptional shortcodes and checking Sequoia dry runs. Rationale: raw-text hashing makes repeated deployment waves republish repeatedly; unrelated tag/front-matter cleanup expands that effect. Date/Author: 2026-10-10, Codex.

Decision: preflight validation precedes publication; persist publication state before final render/deploy. Rationale: publication assigns real `atUri` identifiers required by HTML. No cross-service transaction exists; durable state enables recovery after a later failure. Date/Author: 2026-10-10, Codex.

Decision: retain one consolidated plan with independently verifiable maintenance and image tracks. Rationale: public contracts and workflow ordering are shared, but maintenance fixes need not wait for legacy backfill. Date/Author: 2026-10-10, Codex.

Decision: preserve captured date-based routes with explicit `meta.timezone: Europe/London`. Rationale: machine timezone changes note URLs on UTC runners. Source dates remain unchanged; the 50 RSS baseline formatting errors are declared separately. Date/Author: 2026-10-10, Codex.

Decision: retain Netlify files as hosting reference until the Bunny dashboard audit is complete. Rationale: observed 301/302 responses and headers are edge behavior that generated HTML cannot reproduce. Date/Author: 2026-10-10, Codex.

Decision: preserve verified historical image URLs as aliases across Mage refreshes, using only current Mage variants for responsive output. Rationale: content may still reference older verified derivative URLs after Mage changes its metadata. Reject identity conflicts and avoid restoring obsolete checkpoint keys. Date/Author: 2026-10-10, Codex.

Decision: keep the migration publication gate until owner approval and durable completion. Rationale: Sequoia publishes the entire pending set; allowing an ordinary Micropub-triggered run through would also publish the unreviewed migration. Approve the exact wave before merging to `develop`; unrelated-only actions and post-completion runs pass without this approval. Date/Author: 2026-10-10, Codex.

Decision: archive migration-only tools alongside this plan and remove unused template filters. Rationale: preserve reproducible migration/benchmark evidence without treating those scripts or unused interfaces as ordinary build/release machinery. Date/Author: 2026-10-10, Codex.

## Outcomes & Retrospective

Local implementation is complete on `codex/simplify-site-and-images`, with changes prepared for the owner's requested pull request. Maintenance and the 111-file content migration are kept in separate commits. All 32 focused tests pass, production and strict compatibility checks pass with zero issues, and the instrumented alternate-output build makes zero network/image-processing calls while preserving source and publication state. Builds require no private credentials. Page/feed captions, responsive catalogue markup, public collections, date output, redirects, metadata and asset ordering are covered by checks and browser inspection.

The authenticated catalogue has 368 records and 3,552 variants, covering every current owned reference. Fourteen entries use measured originals, ten because shared derivative identities are ambiguous. The migration preserves media presentation across 1,330 shared HTML pages (328 compared images, zero differences in counts/alt/captions/classes/loading). Mage image/hobby refreshes are byte-identical on repeat runs. Sequoia's actual verbose dry runs confirm the local prediction: baseline up to date, migration 109 updates, zero creates and zero Bluesky candidates, with complete validation and unchanged publication state. Its dry-run path returns before remote publication; remote PDS writes were not tested.

Remaining release work is explicit: obtain owner review of the migration digest and audit Bunny dashboard rules before removing legacy hosting references. No ATProto/Bluesky write, hosting mutation or deployment was performed. Opening the pull request does not approve publication; the workflow gate prevents the migration from publishing without its reviewed digest.

## Context and Orientation

Run commands from the repository root, currently `/home/chris/.codex/worktrees/5d1a/next.chrismcleod.dev`. The supplied plan was copied from worktree `3ba4`; implementation uses this worktree and branch `codex/simplify-site-and-images`. The following context describes the baseline; `readme.md` documents the final structure. Baseline commit is `6e68cb1`; inspect status first and preserve user changes. `.eleventy.js` registers filters (template functions), shortcodes (custom authoring syntax), collections (content groups), compilers and transforms (functions applied to generated output). `config/plugins/markdown.js` configures Markdown; `.md` files currently pass through Nunjucks first, enabling `{% image %}` calls.

`src/posts/`, `src/notes/`, `src/bookmarks/` and `src/likes/` contain content and directory defaults. `src/_layouts/` wraps pages; `src/_includes/` holds fragments. `src/_data/meta.js` holds site metadata, and `src/_data/designTokens/` supplies colours/fonts. `config/collections/index.js` provides full and feed-limited groups. Feed stubs under `src/{posts,notes,bookmarks}/` use feed layouts; `src/feed.njk` and `src/bookmarks/feed.njk` are legacy feeds. Their URLs, IDs, dates and custom `_posse` fields are contracts for subscribers and syndication tools.

`config/template-languages/css-config.js` compiles `src/assets/css/global.css` with PostCSS/Tailwind, which process CSS. `js-config.js` bundles `src/assets/scripts/app.js` using esbuild. `theme-toggle.js` is instead included as Nunjucks-rendered inline code through `src/_includes/partials/js-inline.njk`. `base.njk` uses `src/_data/global.js` for random asset versions. Output defaults to `dist/`.

`helpers/` holds authoring commands and `generate-og-images.js`. OG means Open Graph: social link preview metadata/images. Committed previews live under `src/assets/images/social-preview/`; `config/filters/posse.js` also creates preview URLs. `sequoia.json` configures publication; `.sequoia-state.json` stores content hashes, document identifiers and Bluesky references. `.github/workflows/deploy-to-bunny.yml` currently prepares previews, installs Sequoia globally, publishes, builds, commits state and deploys.

Mage's separate checkout is `/home/chris/code/mage.chrismcleod.dev`; inspect API source read-only. This plan requires no edits there. `/images/list` and `/hobby` are private; CI already has Tailscale connectivity (a private-network client) and `MAGE_API_TOKEN`. CDN originals/derivatives are public at `assets.chrismcleod.dev`. Store only public image facts locally. Paintslam's snapshot will live at `data/hobby.json`, outside Eleventy's content directory.

Preserve permalinks, feed subscriptions, dates, `atUri`, microformats (HTML classes consumed by IndieWeb tools), and design. Do not normalise historical tag case, recalculate slugs, delete authored front matter en masse or replace Tailwind. Ordinary build/start must not publish, install fonts, mutate content or fetch images/data. Explicit sync, OG preparation and publication commands own those effects.

## Plan of Work

### M0: establish concrete compatibility checks

Create `helpers/inventory-site.js`, `helpers/check-build.js`, `test/` and `test/fixtures/`. Inventory sorted output routes; each feed's ordered identifiers, dates and meaningful fields; source permalinks/`atUri`; redirect mappings; image URLs/presentation arguments; and asset references. Store full machine-specific evidence under `/tmp/site-maintenance/baseline/` and a compact committed contract at `test/fixtures/site-contracts.json`. Add `test/fixtures/allowed-output-changes.json`, initially empty. Later corrections must declare an explained difference rather than blindly replacing the baseline.

Inventory images using the existing Markdown parser and a string-aware Nunjucks argument scanner that handles multiline/escaped calls. Include `.md`, `.njk`, template/gallery data and raw HTML. Report unique originals, legacy derivative naming collisions and exceptional options. Read front matter for aliases and redirects. Previous counts of 1,177 HTML pages and 885 indexed pages are context; current inventory governs this checkout.

Use Node's built-in test runner for focused regressions: serializer round trips with quotes/colons/hashes/backslashes/Unicode/newlines; an old note required by the graph but outside feed limits; failed/malformed sync preserving good files; and small/missing-format/collision image metadata. Baseline defect checks may fail, but inventory generation must succeed repeatably and name actual failures. Do not freeze complete historical HTML as test fixtures.

### M1: simplify commands and compile assets before pages

Pin Node `24.13.1` in `.node-version`, declare Node 24 in `engines`, and select the same file in CI. Keep current Eleventy/Image versions. Add exact development dependencies `pagefind@1.5.2`, `sequoia-cli@0.5.7`, and `js-yaml@4.1.1`; update the lockfile. Pagefind builds search indexes. No implicit latest-version downloads or unrelated upgrades.

Replace wildcard script orchestration with `start` (Eleventy watch/serve on port 3000), `build` (clean, production Eleventy, local Pagefind), `preview` (local Pagefind server for built output), `test` (`node --test`) and `check` (tests and output checks). Keep `new:*`, `og`, `og:force`; add explicit sync commands below. Remove/alias broken duplicate start scripts. Use `ELEVENTY_PRODUCTION=true` as the sole production flag where needed.

Create `config/assets/index.js`, registered from `.eleventy.js`. Its async `eleventy.before` listener compiles CSS with the existing PostCSS import/Tailwind/autoprefixer/cssnano chain and JS with existing esbuild options. Write `assets/css/global.css` and `assets/scripts/app.js` under `directories.output`, not hardcoded `dist`. Compute SHA-256 of final bytes, truncated to 12 hex characters. Await compilation/writes before rendering pages. Remove both old CSS/JS template compiler registrations, giving each output one writer.

Expose `assetUrl(pathname)` as a Nunjucks global function closing over current successful asset state. It returns the asset path with `?v=<hash>` and throws for unknown/uncompiled paths. Replace random versions in `base.njk`; remove the random helper when unused. A callable accessor avoids stale global-data caches on watch. Recompile every full watch build, including content/template edits because Tailwind discovers classes there. Watch CSS/JS imports, design tokens and Tailwind/PostCSS config. Use full rebuilds instead of incremental/ignore-initial shortcuts. Keep inline Nunjucks theme code outside esbuild.

Remove generated-HTML Prettier and the conflicting HTML minifier transform; retain source formatting. Acceptance: identical inputs produce identical asset versions across pages/builds; a JS import edit changes JS bytes/version, and a new template utility class changes CSS bytes/version on watch. Compilation errors stop page rendering. Alternate output directories contain the correct assets.

### M2: fix output and consolidate active configuration

Use `js-yaml.dump` in `helpers/shared-utils.js` for front matter, preserving keys/dates. Share `config/utils/index.js`'s slug function across authoring/OG helpers without recomputing existing slugs. Normalise Micropub aliases at the read boundary: prefer `bookmarkOf` then `bookmark_of`, and `likeOf` then `like_of` then `like-of`. Use the same accessors in layouts/collections/feeds; local authoring writes camel case. Add `src/_layouts/like.njk` and likes directory defaults so existing likes render their liked link/date at existing URLs instead of empty pages.

In `config/collections/index.js`, make `getGraph` use complete notes. Define `SYSTEM_TAGS` from internal collection names; derive public topics from authored posts/notes/bookmarks, preserving case and note/bookmark-only topics. Make `src/pages/tags.njk` paginate those topics, removing only inventoried accidental system routes.

Create `src/_data/feeds.js` with descriptors for blog, notes and bookmarks and existing limits. Consolidate Atom/RSS bodies under `src/_includes/feeds/` and paginated templates under `src/feeds/`. Implement JSON feeds as `src/feeds/json.11ty.js` returning `JSON.stringify` of objects; likewise replace the bookmark JSON export identified in M0. Preserve all nine `/follow/<kind>/feed.{atom,rss,json}` and legacy `/feed.xml` and `/bookmarks/feed.xml`. Preserve each feed's own IDs, order, dates, limits, bookmark footer/related links and `_posse` fields unless an explicit defect correction is recorded. Use a legacy-contract option where necessary. Generate discovery links from descriptors. Use actual `meta.url`, language and blog-description fields consistently.

Fix `src/assets/scripts/theme-toggle.js` using existing `machiatto-base` and `latte-base` design tokens for dark/light. Remove the dead `page.data.image` block in `note.njk`. Preserve valid OG overrides and an existing image fallback until the common resolver in M5; never use the homepage URL as an image.

Create `src/redirects.11ty.js`, emitting an immediate meta-refresh, canonical link and visible destination link for every `redirectFrom` mapping. Reject source collisions/loops. `/2021/08/16/appraisal/` should produce a document pointing to `/blog/appraisal/`. This is an HTTP 200 static redirect document, not an HTTP 301. Keep Bunny edge redirects/headers separate; do not change `/feed/` to an assumed target. Retire Netlify files only after M7 verifies retained host behaviour.

Give active filter/shortcode/collection modules default-export registration functions consumed as Eleventy plugins, preserving named helpers imported elsewhere. Extract repeated pagination/footer fragments into `src/_includes/partials/` without incidental wording changes. Acceptance: serializer round trips pass, graph includes old notes, declared system-tag routes disappear, likes render links and all preserved feed contracts compare successfully.

### M3: explicit external data and verified removals

Create `helpers/sync-hobby.js`, `config/data/hobby.js` and versioned public `data/hobby.json`. `data:sync` requests `${MAGE_URL || 'https://mage.chrismcleod.dev'}/hobby` with Bearer `MAGE_API_TOKEN`, validates HTTP/shape/dates/counts, retains public fields used by templates, and replaces the snapshot atomically. Seed with real cached data or a successful authenticated refresh. Reject unexpected empty replacement unless `--allow-empty` is explicit. Failed sync exits nonzero and preserves byte-identical good data.

`src/_data/hobby.js` and `navigation.js` use the same per-build loader and sorted year groups. Navigation includes Paintslam only for a real available year. Missing snapshot warns and creates no dangling link; ship a validated snapshot before release. Watch reloads changed snapshots. Ordinary builds never refresh; CI may log and use a validated last-good hobby snapshot after failure.

Search before deleting across source, config, helpers, `.eleventy.js`, Tailwind config and workflows, including dynamic filename references. Candidates include `config/events/`, `includeRaw`, excluded `src/social-preview.njk`, unused schema/SVG partials, empty cards, subscription machinery, duplicate minifiers, unused filters/watch targets/fonts/preloads. Keep fonts used by OG preparation. Remove disabled Warcraft code/credentials only after declaring its currently empty JSON route an intentional removal.

Remove packages only after their final consumer disappears: candidates include lodash (replace used property-path `where` with a small predicate), clean-css, sanitize-html, netlify-plugin-cache, postcss-cli, unused inquirer and the bundle plugin package. Keep Eleventy 3's built-in `addBundle` where used and `html-minifier-terser` until M5 replaces its image consumer. Avoid broad helper refactors without actual duplication reduction. Acceptance: credentials-free builds use snapshots, navigation targets built years, failed refresh retains data, and every removed route/font/output has an allowed-change explanation.

### M4: prototype images, sync and recover legacy metadata

Implement the interfaces below additively before switching the shortcode. `docs/exec-plans/tools/prototype-picture.js` renders fixture metadata for a Mage upload, large legacy image, small Silverlight image and colliding `image.png`. Promote only when dimensions/fallbacks are valid, absent formats are omitted and collisions use originals. Measure catalogue bytes, load/index and lookup/render time for current data and 10,000 synthetic entries. Record evidence, not an invented latency target.

`helpers/sync-images.js` supplies `images:sync`. Request authenticated `/images/list` once; project public metadata into the schema below and merge existing legacy entries. Validate everything before writing. Reject malformed referenced records, HTTP failures, unexplained empty/shrinking Mage sets and conflicting identities. Explicit `--allow-shrink` accepts a reviewed nonempty deletion set, pruning only missing Mage-owned records while preserving legacy probe records. Empty responses always fail because Mage's database failure can return `[]`. CI never enables this override automatically; strict coverage must pass after pruning. Strip `outputPath`, EXIF, buffers, database fields and credentials. Preserve unrefreshed legacy records and the last-good whole file on failure. Assume neither pagination nor incremental cursors; measure response/sync cost before proposing another endpoint.

`helpers/backfill-images.js` supplies `images:backfill -- --report=/tmp/site-maintenance/legacy-images.json`, a separate explicit network command for referenced owned URLs absent from Mage. Download each original once and use installed `Image.ImageSize(buffer)` for dimensions; never call `Image()` or encode. Probe historical candidates under `https://assets.chrismcleod.dev/chrismcleod.dev/assets/resized/`, using the exact old filename algorithm (first filename segment before a dot), formats `avif,webp,jpeg`, widths `320,570,650,820,960,1200` plus original width. HEAD candidates; 404 means absent, while timeouts/authentication/5xx mean unknown/failure. Download successful candidates once to measure actual dimensions. Retain only validated exact URLs. Limit total in-flight requests to four, timeout each at ten seconds, retry transient failures at most twice. `--reprobe` explicitly refreshes resolved legacy entries.

Group collisions by actual candidate derivative URL across inventory and manifest. Different originals sharing a derivative must not use it unless their original byte digests establish identical underlying files. Equal aspect ratios/dimensions are insufficient. Store measured original-only entries with `fallbackReason: 'ambiguous-derivative'`. Apply this rule to unexpected Mage metadata collisions too. Do not regenerate images into the shared flat folder.

Before switching the shortcode, every owned URL it uses must have validated variants or an explicit measured original-only disposition. Unreachable originals remain unresolved and block switching their callers; do not silently degrade older posts. Save the manifest and coverage report. Unknown owned URLs in development render originals with one aggregated diagnostic; production `--require-images` fails for references without an entry/disposition. External images stay ordinary images.

Load/index the catalogue once in `eleventy.before`, shared by page/feed rendering and reloaded after watch changes. Keep path case and meaningful query parameters, drop fragments, normalise host spelling only. Add doubled-slash aliases only when actual metadata verifies them; variant aliases must be unique. Rendering performs no network, processing or writes.

Acceptance: fixture prototype passes; repeated sync against unchanged data has no diff; repeat backfill without `--reprobe` makes no requests for resolved legacy assets; unresolved coverage is zero before switching. Real URL checks run during explicit network work, not builds. Stored variants are verified, and ambiguous legacy images show the correct original.

### M5: integrate Markdown, feeds and social previews

Create `config/images/enrich.js` using existing direct Cheerio in fragment mode. This HTML transform layer replaces owned CDN `<img>` elements using `renderPicture`, skipping images already in `<picture>` and preserving alt/classes/sizes/loading. Register for final `.html`; explicitly enrich feed content BEFORE JSON serialization or XML escaping. Page transforms alone do not ensure enriched `post.templateContent`. Test idempotence and code/SVG/raw-HTML preservation.

In `config/plugins/markdown.js`, add a small token rule for paragraphs containing exactly one image. Render a figure and escaped visible figcaption from its nonempty title, removing the redundant title attribute. Reuse caption appearance through shared markup/CSS. Inline images stay inline with title attributes; raw HTML titles are not captions. Enrichment subsequently adds responsive markup in pages and feeds. No new figure plugin is necessary.

Replace `config/shortcodes/image/index.js` with a `renderPicture` adapter preserving `(src, alt, caption, sizes, classes, lazy, imgWidths)`. Preserve caption styling, classes and eager behaviour. Filter actual stored variants for explicit widths; never invent missing variants, and report requests that match none before falling back to available metadata. Expose a `picture` filter for gallery/template callers. Keep homepage portrait loading intentional. Remove both old guessed-metadata and `Image()` branches only after M4 coverage passes.

Create `docs/exec-plans/tools/image-shortcode-to-markdown.js` with `--check`/`--write`. Convert simple two/three-argument calls in `.md`, handling whitespace control, multiline arguments, escaped strings and Markdown delimiters. Report exceptional classes/sizes/widths/loading/non-text captions by file/line/reason and leave intact. Inline captioned calls need review rather than conversion that loses their visible caption. Add fixtures for quotes, URL parentheses, Unicode and inline cases.

Create `config/images/social.js`, respecting `ogImage`, then established committed preview filenames, then an existing default image configured in `meta.js`. Verify local targets. Use it in `src/_includes/partials/meta-info.njk` and feed `_posse.opengraph`. Retain explicit `helpers/generate-og-images.js` with direct dependencies, reliable failures and documented fonts. Remove screenshot-route fallback and retired SVG generation after checking callers. Ordinary rendering never prepares OG files or mutates front matter.

Compare shortcode and Markdown output before committing one content wave: routes/IDs, picture counts, alt/captions, classes and exceptions. Do not combine unrelated tag/front-matter edits. Run pinned Sequoia dry runs before/after with authorised credentials, recording touched posts, updates, creates and Bluesky candidates. Unexpected creates, missing state/`atUri` or unplanned announcements block release. Missing credentials leave this concrete release check pending while local work continues. The owner reviews the publication effect before the migration enters the publishing workflow.

Acceptance: captioned Markdown produces matching page/feed figures; external/unknown images stay valid; enrichment twice equals once; exceptions preserve appearance; rendering makes zero image fetch/encode calls. URLs/IDs remain intact. Record expected ATProto updates with the single content commit. Keep the adapter for deliberate exceptions and remove obsolete dependencies when unused.

### M6: separate CI validation, refresh, publishing and deployment

Maintenance ordering fixes can land after M1-M3; catalogue integration follows M4-M5. Add a credentials-free PR job using `npm ci`, tests, committed data, build and contract checks, with no sync/OG mutation/publish/deploy. Production admits `develop` pushes, existing repository dispatch and manual dispatch. Add workflow concurrency with `cancel-in-progress: false` so publishing/deploying runs do not race or interrupt external writes.

Production order: checkout with push permissions, Node setup, `npm ci`, Tailscale, `images:sync`, explicit `data:sync`, OG preparation, tests, preflight build/strict validation, reviewed Sequoia dry run, authorised publish, state persistence, final build/check, deployment. Image sync failure blocks a run with unresolved new images. A validated previous catalogue may be used only when strict coverage passes and stale refresh is explicitly logged. Hobby failure may similarly retain a validated last-good snapshot. Rendering needs no secrets.

Use local pinned `sequoia-cli@0.5.7`, preserving config/state. Validate migration dry-run actions against the recorded expectation before enabling that wave. Do not treat exit code alone as proof of valid proposed actions: inspect validation output and announcement candidates. Failed preflight prevents all publication. Never fabricate `atUri`.

After successful publication, persist `.sequoia-state.json`, exact changed post files and prepared assets/snapshots/catalogue before final render/deploy. Derive a changed-file list and validate categories; do not broadly stage `src/posts/` or mask git failure with `|| true`. Commit generated state with `[skip ci]`. Reject unrelated files/non-fast-forward pushes; never force-push/rebase after publication. On persistence failure save exact state/diff as a repository-readable public-file workflow artifact, fail, and recover before republishing. Exclude credentials from artifacts.

Later rendering/deploy can fail after publication; durable state makes retry skip unchanged documents/saved Bluesky references. Do not delete state or use `--force`. Final render includes newly assigned real identifiers. Deployment receives only validated final `dist/`. Limit network credentials to required stages. Rehearse preflight/persist/deploy failures using stubs, without external writes. Actual deployment/publication remains a separately authorised final action.

### M7: documentation and final evidence

Rewrite `readme.md` around final commands, content structure, retained exceptions, data/image refresh, OG preparation, pinned tools and recovery. Keep starter credit. Explain title-as-caption, service boundaries, unknown images and explicit legacy backfill.

Recheck Bunny redirects/headers read-only: record status/Location for `/feed/`, a historical URL and Bridgy `/.well-known/webfinger`/`host-meta` routes. Record dashboard-owned requirements, including security headers. An HTML redirect does not reproduce these HTTP behaviours. Remove Netlify files only after every retained requirement has a recorded home; live configuration changes need separate authorisation.

Inspect home, captioned post, collision-affected legacy post, note, like, bookmarks, archive/search, genuine topic and Paintslam at mobile/desktop sizes. Check theme persistence/meta colour, code highlighting, comments/subscriptions, discovery links, captions and Pagefind. Record comparable cold/warm build timing and catalogue costs with environment/dataset sizes; do not promise another machine's sub-30-second result. Complete living sections with actual results and pending live/authenticated checks.

## Concrete Steps

Run from this repository root. Reuse the worktree and preserve user changes. If an implementation branch is needed and the tree is suitable, use `codex/simplify-site-and-images`.

    pwd
    git status --short
    git rev-parse --short HEAD
    node --version
    npm --version

At M0 add the inventory/check scripts, then capture output before rendering changes. Current production avoids development image downloads but still fetches hobby data: record whether the baseline has authenticated/cached/no hobby data and compare using the same dataset.

    mkdir -p /tmp/site-maintenance/baseline
    npm ci
    ELEVENTY_PRODUCTION=true npx --no-install eleventy --output=/tmp/site-maintenance/baseline/site
    node helpers/inventory-site.js --site=/tmp/site-maintenance/baseline/site --out=/tmp/site-maintenance/baseline/contracts.json
    node helpers/check-build.js /tmp/site-maintenance/baseline/site --baseline=/tmp/site-maintenance/baseline/contracts.json --report-only

Expect valid inventory JSON and route/feed/image counts. Report-only checks name current defects, for example `FAIL images: undefined src/height`, while inventory itself succeeds. Save compact committed fixtures and allowed corrections, leaving generated HTML outside git.

At M1 install pinned tools, then repeat checks after each milestone:

    npm install --save-dev --save-exact pagefind@1.5.2 sequoia-cli@0.5.7 js-yaml@4.1.1
    npm test
    npm run build
    npm run check
    node helpers/check-build.js dist --baseline=/tmp/site-maintenance/baseline/contracts.json

Until M4-M5 finish, explicitly report known image failures; no broad suppression. Final `check` fails on every unresolved defect. For milestone snapshots use local Eleventy `--output=/tmp/site-maintenance/mN`; assets must follow that directory.

For M3/M4 supply `MAGE_API_TOKEN` through the protected environment, never printing it; private network access may be needed. `MAGE_URL` defaults to `https://mage.chrismcleod.dev`. Fixtures need no token.

    npm run data:sync
    node docs/exec-plans/tools/prototype-picture.js
    npm run images:sync
    npm run images:backfill -- --report=/tmp/site-maintenance/legacy-images.json
    npm run images:sync
    git diff -- config/images/manifest.json data/hobby.json
    npm run build
    node helpers/check-build.js dist --require-images

Expect deterministic JSON, `unresolved: 0` before switching, and unchanged last-good files after injected failures. Record real record counts/bytes/timings below. Repeat unchanged sync should produce no further diff.

For M5 capture publication dry runs before and after conversion using credentials only for this explicit read/preparation command:

    npx --no-install sequoia publish --dry-run --verbose
    node docs/exec-plans/tools/image-shortcode-to-markdown.js --check
    node docs/exec-plans/tools/image-shortcode-to-markdown.js --write
    git diff --stat
    npm test
    npm run build
    npm run check
    npx --no-install sequoia publish --dry-run --verbose

Expect `Dry run complete. No changes made.` and actions matching the reviewed migration expectation. Inspect the diff for unexpected mutations. Unexpected creates or announcements are a release blocker even with exit zero. Do not run real publish as a test.

Exercise watch in a separate terminal:

    npm start

Open `http://localhost:3000/`; edit a scratch template utility class and imported CSS/JS, observing byte/version changes. Remove only those scratch edits and stop with Ctrl-C. Then verify production search:

    npm run build
    npm run preview

Use the URL printed by Pagefind and search a known title. Finish with `git diff --check` and reviewed status. Commit authorised implementation milestones separately, with one content migration commit. Editing this plan does not itself authorise committing/pushing/publishing.

## Validation and Acceptance

`npm test` must exit zero with focused regressions passed; record the actual test count when implemented. Prove old failing/new passing behaviours for serialization, image metadata/collisions/captions, graph coverage, sync failure and workflow ordering. Build checks parse all JSON/XML contracts, compare feed-specific identifiers/dates/custom fields and routes with declared corrections, and verify Sequoia slugs/document links still resolve.

`npm run build` and `npm run check` must pass without Mage/ATProto credentials using committed data. Add `helpers/check-offline-build.js` to build programmatically with network requests blocked and image-processing calls instrumented to fail. Include it in final `check`. It must write output with assets while leaving source/state untouched and making no fetch or `Image()` call. A warm cache or absent processing logs is insufficient evidence.

Image checks reject undefined URLs, invalid dimensions on catalogued images, fabricated variants, unresolved owned references in strict mode and nested/double enrichment. Fixtures include absent JPEG, different widths by format, small originals and ambiguous aliases. External unknown images need not have known dimensions. Real URL validation occurs in explicit sync/backfill, never routine checks.

A standalone Markdown title `Caption` becomes exactly one visible escaped caption in page and feed content; inline images remain valid inline HTML. Preserve intentional eager loading. Collision-affected originals display correctly even when responsiveness is unavailable. Two enrichments equal one. Feed strings with quotes/newlines round-trip exactly. Graph checks derive complete source counts rather than assuming 150/154 notes.

Assets have shared stable versions for identical bytes and changed versions after watched imports/template classes; alternate output contains assets. Redirect documents point to built targets; live HTTP semantics are recorded separately. Workflow fixtures demonstrate no publish after failed preflight and durable state after later failure. Mark authenticated/live checks pending until performed; no test publishes or deploys.

## Idempotence and Recovery

Sync validates a complete prospective result, writes a temporary sibling and atomically renames only on success. Failures return nonzero and retain good files. Deterministic sorted JSON has no changing refresh timestamp. Repeated unchanged sync/backfill makes no diff; `--reprobe` is explicitly expensive. Interrupted backfill retains the last-good manifest and reports remaining work.

The codemod leaves Markdown/exceptions intact; its second run changes nothing. Content can be reverted independently while the adapter remains, but a revert after publication changes raw text again: inspect dry run rather than assuming silence. Never recreate/delete publication state to retry deployment.

Keep M0 evidence until acceptance; clean only task-owned temporary files/scratch edits. On publish/persistence failure recover exact generated state from the repository-readable public-file artifact, inspect against remote records, commit without forcing and re-run dry run. A competing push requires a fresh validated integration, not force-push. Document any published-but-not-deployed interval; external services do not support atomic rollback.

## Artifacts and Notes

M0 produces `/tmp/site-maintenance/baseline/contracts.json`, baseline output, `test/fixtures/site-contracts.json` and `test/fixtures/allowed-output-changes.json`. M4 produces manifest, legacy report and prototype results. M5 produces exceptional-call and before/after publication-action summaries without credentials. Implementation evidence (2026-10-10):

- Environment: Linux, Node 24.13.1, AMD Ryzen 7 7700 (16 logical CPUs), 30.2 GiB RAM. Dataset: 565 posts, 150 notes, 170 bookmarks, two likes and 145 hobby rows.
- Baseline production: 16.28s Eleventy, 1,198 written files/639 copies, with unavailable hobby API and no hobby rows. This differs from the final dataset; it is not a controlled same-data speedup claim.
- Final clean-output production builds with the same committed dataset: 4.81s and 4.85s Eleventy, 1,355 files/639 copies; the repeat command (including cleaning and Pagefind) took 5.773s wall time under `TZ=UTC`. Dependencies/filesystem caches were warm, processes were fresh; no image cache is needed. Pagefind indexed 887 pages/13,949 words. Offline alternate-output build: 4.83s Eleventy, zero blocked network/processing attempts, unchanged source/state.
- Initial local verification: `npm ci --offline` installs the final lockfile successfully; 23/23 tests pass before authenticated follow-up regressions. The fresh-install UTC run measured 4.75s Eleventy and 4.60s for the offline build. `npm run build` and strict `check-build` pass; strict contracts also pass under `TZ=UTC`. `npm run check` includes the instrumented offline build. `git diff --check` is clean.
- Initial probe catalogue: 270 records, 2,133 variants, 529,252 formatted bytes (370,627 compact bytes), 14 measured original-only entries including ten ambiguous-derivative dispositions. Repeat backfill resolves all 271 owned references without requests; `results` is empty and `unresolved` is empty. Two further source image URLs are external.
- Latest prototype sample: catalogue load/index 14.30ms; 10,000 lookup/renders 111.46ms. Synthetic 10,000-record catalogue: 56.27ms load/index, 34.99ms for 10,000 lookup/renders. These are local samples, not performance guarantees.
- Migration comparison: 1,330 shared HTML pages and 328 images, zero media-presentation differences. Codemod second pass converts zero calls and reports the four retained exceptions. One broken Supports front-matter URL, previously literal Angel Exterminatus introductory Markdown, and 50 incorrect RSS summer timestamps are explicitly declared corrections.
- Watch rehearsal: imported CSS/JS edits and template utility `text-[13px]` → `text-[17px]` changed emitted bytes; current HTML hashes matched final bytes (CSS `338bc8333f44` → `735a77d1d2c8`, JS `8d56176a9aad` → `88083e60175a`). Scratch files/edits were removed.
- Browser checks: home, Supports, collision-affected Installing Threads, note, like, bookmarks, archive (`/blog/`), miniatures topic and Paintslam at 390×844 and 1440×1000; no remaining page overflow in checked views. Light/dark selections persist across reload and update both theme-colour metas (`#eff1f5` / `#24273a`). PHP sample has three highlighted code blocks/432 tokens. Comments/subscription controls remain rendered; no comment/subscription action was submitted. Production search for “Supports” returned 63 results with the correct post first. Pagefind preview starts at port 1414, which the browser integration blocks; the same built bytes were inspected through a loopback static server on port 3000.
- Public HTTP audit: `/feed/` 301 → `https://chrismcleod.dev/follow/blog/feed.atom`; `/2021/08/16/appraisal/` remains live 404 (local redirect now targets `/blog/appraisal/`); webfinger 302 → `https://fed.brid.gy/.well-known/webfinger?resource=acct:chrismcleod.dev@chrismcleod.dev`; host-meta 302 → `https://fed.brid.gy/.well-known/host-meta`. Responses report Bunny, CSP `upgrade-insecure-requests; block-all-mixed-content;`, `nosniff`, `strict-origin-when-cross-origin`, `DENY`; HSTS was absent in these observations. Dashboard configuration is not inspected or changed.
- Recovery fixtures cover failed preflight/dry run preventing publication, partial publisher failure persisting state, persistence failure stopping final render, failed final render/deploy after durable state, rejected unrelated files, exact saved state bytes after non-fast-forward push, and migration approval retiring only after reviewed hashes are saved. No external writes are used in these tests.
- Evidence files remain under `/tmp/site-maintenance/`: baseline output/contracts/logs, `final-{test,build,check}.log`, `build-repeat.log`, `prototype.log`, `image-comparison.json`, `watch-result.json`, `backfill-repeat-final.json`, `host-checks.json` and public Paintslam HTML. Temporary evidence is machine-local; compact durable contracts and release expectations are committed-source candidates under `test/fixtures/`.

Authenticated follow-up evidence (2026-10-10):

- Mage image refresh produces 368 records (120 Mage, 248 probe), 3,552 exact variants, 54 historical aliases and 879,969 formatted bytes. The 14 original-only entries and ten ambiguous dispositions remain. Two consecutive authenticated syncs are byte-identical. Subsequent checkpoint-assisted backfill resolves all owned references with zero probes and leaves catalogue bytes unchanged.
- Mage hobby refresh produces 145 rows/594 models with actual API timestamps; consecutive successful refreshes are byte-identical. Three additional regressions cover legacy timestamps, historical variant aliases and checkpoint identity merges; all 26 tests pass.
- Final authenticated-data UTC production build: 4.73s Eleventy, 1,355 written files/639 copies, Pagefind 887 pages/13,949 words. Strict checks pass with zero issues. Offline alternate-output build: 4.57s, zero network/processing calls and unchanged source/state. Repeated media comparison still reports 1,330 shared pages/328 images and zero presentation differences.
- Pinned Sequoia 0.5.7 `publish --dry-run --verbose` uses the existing login without a separate token. An isolated baseline project from `6e68cb1` with saved state/previews is up to date. Migrated content scans 565 posts, completes validation, and schedules exactly 109 updates, zero creates and zero Bluesky announcements. Action summaries are checked against the publication plan, rather than inferred from exit status. `.sequoia-state.json` and `sequoia.json` remain byte-identical to pre-check copies. This checks credential availability and the CLI's local dry-run path, which returns before remote publication.
- Public summaries are retained in `test/fixtures/publication-migration.json` and this plan. Machine-local evidence lives under `/tmp/site-maintenance/authenticated/`: `before-dry-run.log`, `after-dry-run.log`, `verification.json`, `hobby-refresh-differences.json`, `tests.log`, `build.log`, `check.log`, `backfill.log` and `image-comparison.json`. No credentials are copied into evidence or fixtures; `.env` remains ignored.

The migration expectation matches the actual dry-run actions. Owner review is still pending for digest `61f179e8c79d4eb22471f8c68e41ba2a5ca5e3ecb4c2bb48446fdefbf2bdcbf4`; no approval variable has been set and nothing has been published.

Preserve these verified source distinctions:

    Old production: staticData[format][i].src exists; lowsrc.url/height do not.
    Mage metadata: url/width/height exist; outputPath is private.
    Mage upload: UUID filename is assigned before processing.
    Sequoia detection: getContentHash(post.rawContent).
    Sequoia announcement: no bskyPostRef AND within maxAgeDays, for creates or updates.

## Interfaces and Dependencies

Use Node 24.13.1, existing Eleventy 3.1.2/Image 6.0.4, Markdown-it, Cheerio, PostCSS/esbuild and Node crypto/fs/fetch/tests. Add pinned Pagefind/Sequoia/YAML as specified, avoiding incidental dependencies. Installed Image exposes `Image.generateHTML(metadata, attributes)` and `Image.ImageSize(buffer)`. Rendering must never call its default processing function. No new Mage endpoint/deployment is required.

`config/images/manifest.js` validates version-1 records keyed by original URLs. Dimensions describe the original for probed images or widest known variant for Mage records lacking original dimensions; `dimensionSource` makes this explicit. Store exact variant URLs/dimensions, not generated filenames. Illustrative schema, not real metadata:

    {
      "version": 1,
      "images": {
        "https://assets.chrismcleod.dev/example.png": {
          "width": 320, "height": 240,
          "dimensionSource": "variant", "source": "mage",
          "variants": [
            { "format": "jpeg", "url": "https://assets.chrismcleod.dev/resized/example-320.jpeg", "width": 320, "height": 240 }
          ]
        }
      }
    }

Empty variants require measured original dimensions and `fallbackReason`. Source is `mage` or `probe`. Sort keys/variants and validate aliases. Required interfaces:

    normaliseUrl(src: string): string
    isCdnImage(src: string): boolean
    loadManifest(path: string): Promise<Manifest>
    buildImageIndex(manifest: Manifest): Map<string, ImageRecord>
    lookupImage(src: string): ImageRecord | undefined
    setImageIndex(index: Map<string, ImageRecord>): void

`config/images/picture.js` provides synchronous markup:

    renderPicture({ src, alt, sizes = '(min-width: 55rem) 820px, 100vw',
                    className = '', loading = 'lazy', widths }): string

Adapt variants to Eleventy metadata arrays with actual `url`, `width`, `height`, `format`, `sourceType`, and `srcset`, ordered by ascending width. Image's generator selects JPEG when present, otherwise its supported format preference. It escapes alt text itself but does not escape every other attribute in 6.0.4: escape non-alt string attributes and URL/srcset values explicitly, avoiding double-escaping alt. Original-only records use originals/dimensions; unknown URLs use escaped original images and aggregated diagnostics. Allow empty alt text for decorative Markdown images.

`config/images/enrich.js` exposes `enrichImages(html: string): string`; `config/images/social.js` exposes `resolveSocialImage(postData, siteMeta): string` returning a shared absolute verified/default URL. Page/feed code share one per-build index. Retain the shortcode signature from M5. The initially proposed template `picture` filter has no consumers and was removed during review; the exported renderer serves the shortcode and enrichment directly.

`config/assets/index.js` exposes its registration plugin, `compileAssets({ outputDir, production }): Promise<AssetState>` and `assetUrl(pathname: string): string`. State maps the two public paths to final hashes. Await compile/write before publishing new state; use `directories.output`. `config/data/hobby.js` exposes `loadHobbySnapshot(): Promise<HobbySnapshot>` and `groupHobbyByYear(snapshot): Record<string, HobbyItem[]>`, sharing validated per-build data between navigation and hobby.

Sync modules export functions accepting injected fetch/destination paths for fixtures; CLI entrypoints alone read credentials and perform network work. `inventory-site.js` accepts `--site`/`--out`; `check-build.js` accepts directory, `--baseline`, `--report-only`, `--require-images`, defaulting to committed contracts/allowed changes. Checks exit nonzero on unresolved errors except deliberate baseline report-only mode. `check-offline-build.js` performs the blocked-network/instrumented build. Document all commands/flags and side effects.

Revision note (2026-10-10): consolidated review feedback and the competing plan's concrete structure. Settled catalogue location and the owner's caption preference; added legacy recovery/collisions, production sync, asset ordering, measurable contracts and migration publication gates. Corrected upload-collision and silent-update assumptions against source. Retained last-good data, feed enrichment, idempotence and honest publishing recovery boundaries.


## Colleague review follow-up

The attached review was checked against the implementation and baseline. Confirmed defects and maintenance improvements are addressed without editing the 111 migrated content files or changing the publication review digest.

| Finding | Resolution |
| --- | --- |
| Tight-list caption emits orphan `figcaption` | Skip hidden paragraph tokens; tight-list titles remain inline. Tests also preserve valid loose-list and blockquote figures. |
| Redirect collisions omit collection-excluded routes | Check the resolved Eleventy content map before duplicate-permalink validation. A real temporary redirect to `/bookmarks/data.json` fails with the specific redirect diagnostic; scratch source was removed. |
| Unrelated rename described as post-publication recovery | Parse porcelain rename/copy records without throwing, then reject them as unrelated changes before publication. Persistence still saves other whitelisted recovery bytes before refusing staging. |
| Misplaced/unused filters and duplicate bookmark interface | Register `bookmarkUrl` with the filters plugin; use it consistently in bookmark layouts. Remove unused `escape`, `picture`, `likeUrl` filters and `bookmarkTarget` computed data. Keep the documented RSS override after the RSS plugin. |
| Missing XML dependency | Declare pinned `@rgrove/parse-xml` 4.2.0 directly in development dependencies and lockfile; installed offline. |
| One-time helpers and undocumented codemod flag | Archive comparison, benchmark and conversion scripts under `docs/exec-plans/tools/`. Implement read-only `--check` with exit 1 for pending conversions; reports write only with explicit `--report`. Regression checks source bytes remain unchanged. |
| Repeated image formats/sizes and copied footer | Share ordered `IMAGE_FORMATS` and `DEFAULT_SIZES`; reuse the footer partial with note-specific class/coffee prefix, preserving visible content. |
| Multiple source front-matter parsers | Share one YAML parser in `config/utils/frontmatter.js` between inventory/publication checks and OG preparation. Eleventy retains its own template parsing. |
| Topic and feed tag lists differ | Intentional compatibility distinction: public topics exclude collection names, while legacy feed categories additionally omit personal/site-meta. Merging policies would remove real public topics or alter existing feed fields. Documented at the filter. |
| Feed limits duplicated in checks | Read each feed's kind and limit from descriptors, including the legacy bookmark override. |
| Public fetch helper imported from backfill | Move it into `sync-utils.js`; Mage sync no longer imports Eleventy Image/Markdown through backfill. Remove the redundant concurrency limiter; four workers each await body consumption. |
| Hard-coded site URLs | Use `meta.url` in redirect canonicals and build checks; redirect language also uses `meta.lang`. |
| Dry-run log has no reader | Print the validated verbose output to the workflow log; remove the unused temporary log write. |
| Sparse comments | Add focused comments/JSDoc for route timing, deletion acceptance, public fetch credentials, concurrency ownership and distinct tag policies. Existing image identity/enrichment comments explain the non-obvious invariants. |
| Discovery titles/type changed without declaration | Restore baseline Atom/RSS labels, main-blog naming and ordering. Capture nine actual baseline links; declare only the three JSON media-type corrections and the main-blog JSOM typo. Check exact links on every generated base-layout HTML page. |
| Mage deletions cannot be accepted | Explicit `images:sync -- --allow-shrink` prunes missing Mage records from a valid nonempty response; preserves probe records. Empty/malformed responses still preserve good bytes. CI stays conservative. |
| Stale Netlify plugin | Remove the obsolete cache-plugin block; retain historical headers/redirects until the Bunny dashboard audit. |
| Publisher state used for slug redirects | Retain intentional compatibility behavior for 98 saved standard.site slug links. State is committed public input; builds perform no publisher reads/writes over the network. |
| Saved theme preference overrides system changes | Retain deliberate preference persistence from M7 acceptance checks. System changes still apply until a visitor saves a preference. Document the reason beside the listener. |
| Markdown alt renderer differs from default | Retain the narrow `text_special` normalization needed to preserve escaped punctuation/entities through migration. Exact-alt round-trip regression and 328-image presentation comparison cover it. |
| Production gate blocks ordinary content before migration approval | Intentional while the migration remains in Sequoia's pending set. Publishing ordinary content would also publish the migration. Tests prove unrelated-only actions pass and completed waves retire the gate; README makes the pre-merge requirement explicit. |
| Recovery artifact is repository-readable | State the exact access model in README/workflow: anyone with repository read access can download it for seven days. It contains only whitelisted public files; hidden state is included intentionally and credentials are excluded. |
| Content commits not separated | The review follow-up changed none of the migrated content bytes. Pull-request preparation keeps the 111 migrated content files in their own commit, separate from maintenance. |

Verification: 32/32 tests; UTC production build and strict checks pass with zero issues; offline build makes zero network/image-processing calls and preserves source/state. The media comparison remains 1,330 shared pages/328 images with zero differences. Logs and the real redirect-collision rehearsal are under `/tmp/site-maintenance/review-followup/`. Owner approval and Bunny dashboard review remain pending; no publication, deployment, commit or push occurred.

Revision note (2026-10-10, implementation): completed M0–M7 locally, recording baseline contracts, image probing, migration effects, offline/watch/browser checks and publication recovery behavior. Left changes uncommitted for review and external writes separately gated.

Revision note (2026-10-10, authenticated checks): used the owner's ignored Mage environment and existing Sequoia login. Normalized legacy hobby dates, retained historical image aliases/checkpoint identity merges, refreshed public snapshots and verified repeat-byte stability. Recorded actual baseline/migration dry-run actions without publication or state changes.

Revision note (2026-10-10, colleague review): fixed confirmed list-caption, excluded-route and rename-diagnostic defects; simplified helper boundaries/interfaces; declared dependency and discovery contracts; added explicit reviewed Mage pruning. Archived migration tools, documented intentional gate/theme/tag/state decisions and clarified artifact access. Added six focused tests, bringing the total to 32; all strict and offline checks pass.

Revision note (2026-10-11, pull-request preparation): the owner requested a PR. Refreshed `origin/develop` (still `6e68cb1`), repeated the UTC production build and all 32 tests/strict/offline checks successfully, and verified the migration digest still matches 109 expected updates with no inconsistencies. Prepare maintenance and content migration as separate commits and target `develop`; publication approval and the Bunny dashboard audit remain separate release requirements.
