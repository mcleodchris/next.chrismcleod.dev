#!/usr/bin/env node

import { input } from '@inquirer/prompts';
import {
  createContentFile,
  generateFrontmatter,
  getDateString,
  parseTags,
  pathSafeSlug,
  promptForUrlWithMetadata,
  referenceKey
} from './shared-utils.js';

async function main() {
  const { url, metadata } = await promptForUrlWithMetadata('Enter the URL to bookmark:');

  const title = await input({
    message: 'Enter the bookmark title:',
    default: metadata.title,
    validate: input => input.trim() ? true : 'Title cannot be empty.'
  });

  const tags = await input({
    message: 'Enter comma-separated tags (optional):'
  });

  const tagsArray = parseTags(tags);

  const frontmatterFields = { title, bookmarkOf: url };
  if (tagsArray.length > 0) {
    frontmatterFields.tags = tagsArray;
  }
  if (metadata.hEntry) {
    frontmatterFields.references = { [referenceKey(url)]: metadata.hEntry };
  }

  const filename = `${getDateString()}-${pathSafeSlug(title)}.md`;
  createContentFile('bookmarks', filename, generateFrontmatter(undefined, undefined, frontmatterFields));
}

main().catch(console.error);
