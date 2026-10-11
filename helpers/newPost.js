#!/usr/bin/env node

import { input } from '@inquirer/prompts';
import { createContentFile, generateFrontmatter, getDateString, parseTags, pathSafeSlug } from './shared-utils.js';

async function main() {
  const title = await input({
    message: 'Enter the post title:',
    validate: input => input.trim() ? true : 'Title cannot be empty.',
    required: true
  });

  const tags = await input({
    message: 'Enter comma-separated tags (optional):'
  });

  const tagsArray = parseTags(tags);

  const filename = `${getDateString()}-${pathSafeSlug(title)}.md`;
  createContentFile('posts', filename, generateFrontmatter(undefined, undefined, { title, tags: tagsArray }));
}

main();
