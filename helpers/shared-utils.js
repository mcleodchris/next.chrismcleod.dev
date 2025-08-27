import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';

export function getDateString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getDirname(importMetaUrl) {
  const __filename = fileURLToPath(importMetaUrl);
  return path.dirname(__filename);
}

export function createFileWithContent(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, { flag: 'wx' });
  console.log(`Created: ${filePath}`);
}

export function generateFrontmatter(id = randomUUID(), date = new Date().toISOString(), additionalFields = {}) {
  const baseFields = { id, date, ...additionalFields };
  const yamlLines = Object.entries(baseFields).map(([key, value]) => {
    if (Array.isArray(value)) {
      return value.length > 0 
        ? `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`
        : `${key}: []`;
    }
    return `${key}: ${value}`;
  });
  return `---\n${yamlLines.join('\n')}\n---\n\n`;
}
