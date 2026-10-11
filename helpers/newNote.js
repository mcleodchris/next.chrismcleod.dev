#!/usr/bin/env node

import { createContentFile, generateFrontmatter, getDateString, randomString } from './shared-utils.js';

createContentFile('notes', `${getDateString()}-${randomString()}.md`, generateFrontmatter());
