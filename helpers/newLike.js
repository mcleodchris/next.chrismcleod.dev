#!/usr/bin/env node

import {
  createContentFile,
  generateFrontmatter,
  getDateString,
  promptForUrlWithMetadata,
  randomString,
  referenceKey
} from './shared-utils.js';

async function main() {
  const { url, metadata } = await promptForUrlWithMetadata('Enter the URL to like:');

  const frontmatterFields = { likeOf: url };
  if (metadata.hEntry) {
    frontmatterFields.references = { [referenceKey(url)]: metadata.hEntry };
  }

  const filename = `${getDateString()}-${randomString()}.md`;
  createContentFile('likes', filename, generateFrontmatter(undefined, undefined, frontmatterFields));
}

main().catch(console.error);
