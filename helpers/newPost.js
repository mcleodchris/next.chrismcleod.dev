#!/usr/bin/env node

import { input } from '@inquirer/prompts';
import { slugifyString } from '../config/utils/index.js';
import { createContentFile, generateFrontmatter, getDateString } from './shared-utils.js';

async function main() {
  const title = await input({
    message: 'Enter the post title:',
    validate: input => input.trim() ? true : 'Title cannot be empty.',
    required: true
  });

  const tags = await input({
    message: 'Enter comma-separated tags (optional):'
  });

  const tagsArray = tags
    .split(',')
    .map(tag => slugifyString(tag.trim()))
    .filter(tag => tag.length > 0);

  const filename = `${getDateString()}-${slugifyString(title)}.md`;
  createContentFile('posts', filename, generateFrontmatter(undefined, undefined, { title, tags: tagsArray }));
}

main();
