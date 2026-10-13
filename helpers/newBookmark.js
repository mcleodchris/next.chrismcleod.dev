#!/usr/bin/env node

import {
  ask,
  createContentFile,
  generateFrontmatter,
  getDateString,
  parseTags,
  promptForUrlWithMetadata,
  referenceKey
} from './shared-utils.js';
import { identity } from '../config/identity/index.js';

async function main() {
  const { url, metadata } = await promptForUrlWithMetadata('Enter the URL to bookmark:');

  const title = await ask({
    message: 'Enter the bookmark title:',
    default: metadata.title,
    validate: input => input.trim() ? true : 'Title cannot be empty.'
  });

  const tags = await ask({
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

  const filename = identity('bookmark', title).fileName(getDateString());
  createContentFile('bookmarks', filename, generateFrontmatter(undefined, undefined, frontmatterFields));
}

main().catch(console.error);
