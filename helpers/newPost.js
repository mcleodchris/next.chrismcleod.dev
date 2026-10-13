#!/usr/bin/env node

import { ask, createContentFile, generateFrontmatter, getDateString, parseTags } from './shared-utils.js';
import { identity } from '../config/identity/index.js';

async function main() {
  const title = await ask({
    message: 'Enter the post title:',
    validate: input => input.trim() ? true : 'Title cannot be empty.'
  });

  const tags = await ask({
    message: 'Enter comma-separated tags (optional):'
  });

  const tagsArray = parseTags(tags);

  const filename = identity('post', title).fileName(getDateString());
  createContentFile('posts', filename, generateFrontmatter(undefined, undefined, { title, tags: tagsArray }));
}

main();
