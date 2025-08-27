#!/usr/bin/env node

import { ContentGenerator } from './content-generator.js';
import { generateFrontmatter } from './shared-utils.js';

// Helper to generate random 5-character string
function randomString(length = 5) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const generator = new ContentGenerator(import.meta.url, 'notes');
const dateStr = generator.getDateString();
const randStr = randomString();
const filename = `${dateStr}-${randStr}.md`;
const content = generateFrontmatter();

generator.createContent(filename, content);
