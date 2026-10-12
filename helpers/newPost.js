#!/usr/bin/env node

import { ask, createContentFile, generateFrontmatter, getDateString, parseTags, pathSafeSlug } from './shared-utils.js';

async function main() {
  const title = await ask({
    message: 'Enter the post title:',
    validate: input => input.trim() ? true : 'Title cannot be empty.'
  });

  const tags = await ask({
    message: 'Enter comma-separated tags (optional):'
  });

  const tagsArray = parseTags(tags);

  const filename = `${getDateString()}-${pathSafeSlug(title)}.md`;
  createContentFile('posts', filename, generateFrontmatter(undefined, undefined, { title, tags: tagsArray }));
}

main();
