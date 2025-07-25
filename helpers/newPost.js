#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { Command } = require('commander');
const { input } = require('@inquirer/prompts');

// Helper to slugify a string
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

// Get today's date in YYYY-MM-DD
function getDateString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function main() {
  const program = new Command();
  program.parse(process.argv);

  // Prompt for title and tags
  const title = await input(
    {
      message: 'Enter the post title:',
      validate: input => input.trim() ? true : 'Title cannot be empty.',
      required: true
    });
    const tags = await input(
    {
      message: 'Enter comma-separated tags (optional):'
    });

  const dateStr = getDateString();
  const slug = slugify(title);
  const filename = `${dateStr}-${slug}.md`;
  const postsDir = path.join(__dirname, '../src/posts');
  const filePath = path.join(postsDir, filename);

  // Parse and slugify tags
  let tagsArray = [];
  if (tags) {
    tagsArray = tags.split(',')
      .map(tag => slugify(tag.trim()))
      .filter(tag => tag.length > 0);
  }

  // Default content
  const tagsYaml = tagsArray.length > 0
    ? `tags:\n${tagsArray.map(t => `  - ${t}`).join('\n')}`
    : 'tags: []';
  const content = `---\nid: ${randomUUID()}\ndate: ${new Date().toISOString()}\ntitle: ${title}\n${tagsYaml}\n---\n\n`;

  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  fs.writeFileSync(filePath, content, { flag: 'wx' });
  console.log(`Created: ${filePath}`);
}

main();
