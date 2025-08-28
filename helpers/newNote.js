#!/usr/bin/env node

import { ContentGenerator } from './content-generator.js';
import { generateFrontmatter, randomString } from './shared-utils.js';

const generator = new ContentGenerator(import.meta.url, 'notes');
const dateStr = generator.getDateString();
const randStr = randomString();
const filename = `${dateStr}-${randStr}.md`;
const content = generateFrontmatter();

generator.createContent(filename, content);
