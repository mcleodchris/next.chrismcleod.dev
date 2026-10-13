# A Post's Preview image name records the Slug it was made for

A Post's URL follows its title, so renaming a published Post moves it, and nothing remembered the old URL. We decided that the stored Preview image name (`ogImage: <slug>-preview.jpeg`) doubles as the record of the Slug the Post had when its image was made: when `npm run og` finds that name no longer matches the current title's Slug, it adds the old URL to `redirectFrom`, makes a new Preview image, and deletes the old one (Sequoia keeps its own copy as a blob).

## Considered Options

- Store a `slug:` key in front matter so titles can change without moving the URL. More principled, but it adds a second source of truth to every new Post while all existing Posts have none.
- Document "add `redirectFrom` when renaming" and rely on memory. Renames are rare, and a forgotten redirect fails silently.

## Consequences

- A hand-picked `ogImage` that does not follow the Slug rule would be treated as a rename and replaced. None existed when this was decided.
- Bookmarks have no Preview image, so a renamed Bookmark still needs its Former URL added by hand.
