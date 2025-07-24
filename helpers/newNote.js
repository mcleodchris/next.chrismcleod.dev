#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

// Helper to generate random 5-character string
function randomString(length = 5) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Get today's date in YYYY-MM-DD
function getDateString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const dateStr = getDateString();
const randStr = randomString();
const filename = `${dateStr}-${randStr}.md`;
const notesDir = path.join(__dirname, '../src/notes');
const filePath = path.join(notesDir, filename);

// Default content (can be customized)
const content = `---\nid: ${randomUUID()}\ndate: ${new Date().toISOString()}\n---\n\n`;

if (!fs.existsSync(notesDir)) {
  fs.mkdirSync(notesDir, { recursive: true });
}

fs.writeFileSync(filePath, content, { flag: 'wx' });
console.log(`Created: ${filePath}`);
