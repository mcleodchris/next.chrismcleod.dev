#!/usr/bin/env node

import { Command } from 'commander';
import { input } from '@inquirer/prompts';
import { ContentGenerator } from './content-generator.js';
import { generateFrontmatter, fetchWebpageMetadata, isValidUrl } from './shared-utils.js';

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

  // Prompt for URL
  let url;
  do {
    url = await input({
      message: 'Enter the URL to bookmark:',
      validate: input => {
        if (!input.trim()) return 'URL cannot be empty.';
        if (!isValidUrl(input.trim())) return 'Please enter a valid URL.';
        return true;
      }
    });
  } while (!isValidUrl(url));

  console.log('Fetching page metadata...');
  
  // Fetch webpage metadata
  const metadata = await fetchWebpageMetadata(url);
  
  // Prompt for title with extracted title as default
  const title = await input({
    message: 'Enter the bookmark title:',
    default: metadata.title,
    validate: input => input.trim() ? true : 'Title cannot be empty.'
  });
  
  // Prompt for optional tags
  const tags = await input({
    message: 'Enter comma-separated tags (optional):'
  });

  const generator = new ContentGenerator(import.meta.url, 'bookmarks');
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

  // Prepare frontmatter fields
  const frontmatterFields = {
    title,
    bookmarkOf: url
  };

  // Add tags if provided
  if (tagsArray.length > 0) {
    frontmatterFields.tags = tagsArray;
  }

  // Add references if microformat data was found
  if (metadata.hEntry) {
    // Create a clean key from the URL
    const urlKey = new URL(url).hostname.replace(/[^a-zA-Z0-9]/g, '') + 
                  new URL(url).pathname.replace(/[^a-zA-Z0-9]/g, '');
    frontmatterFields.references = {
      [urlKey]: metadata.hEntry
    };
  }

  const content = generateFrontmatter(undefined, undefined, frontmatterFields);

  generator.createContent(filename, content);
}

main().catch(console.error);
