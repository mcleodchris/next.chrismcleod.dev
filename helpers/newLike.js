#!/usr/bin/env node

import { Command } from 'commander';
import { input } from '@inquirer/prompts';
import { ContentGenerator } from './content-generator.js';
import { generateFrontmatter, fetchWebpageMetadata, isValidUrl, randomString } from './shared-utils.js';

async function main() {
  const program = new Command();
  program.parse(process.argv);

  // Prompt for URL only
  let url;
  do {
    url = await input({
      message: 'Enter the URL to like:',
      validate: input => {
        if (!input.trim()) return 'URL cannot be empty.';
        if (!isValidUrl(input.trim())) return 'Please enter a valid URL.';
        return true;
      }
    });
  } while (!isValidUrl(url));

  console.log('Fetching page metadata...');
  
  // Fetch webpage metadata (for potential microformat references)
  const metadata = await fetchWebpageMetadata(url);

  const generator = new ContentGenerator(import.meta.url, 'likes');
  const dateStr = generator.getDateString();
  const randStr = randomString();
  const filename = `${dateStr}-${randStr}.md`;

  // Prepare frontmatter fields
  const frontmatterFields = {
    likeOf: url
  };

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
