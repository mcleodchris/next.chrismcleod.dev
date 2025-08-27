#!/usr/bin/env node

import { Command } from 'commander';
import { input } from '@inquirer/prompts';
import { ContentGenerator } from './content-generator.js';
import { generateFrontmatter } from './shared-utils.js';

// Helper to slugify a string
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

async function main() {
  const program = new Command();
  program.parse(process.argv);

  // Prompt for title and tags
  const title = await input({
    message: 'Enter the post title:',
    validate: input => input.trim() ? true : 'Title cannot be empty.',
    required: true
  });
  
  const tags = await input({
    message: 'Enter comma-separated tags (optional):'
  });

  const generator = new ContentGenerator(import.meta.url, 'posts');
  const dateStr = generator.getDateString();
  const slug = slugify(title);
  const filename = `${dateStr}-${slug}.md`;

  // Parse and slugify tags
  let tagsArray = [];
  if (tags) {
    tagsArray = tags.split(',')
      .map(tag => slugify(tag.trim()))
      .filter(tag => tag.length > 0);
  }

  const content = generateFrontmatter(undefined, undefined, { 
    title, 
    tags: tagsArray 
  });

  generator.createContent(filename, content);
}

main();
