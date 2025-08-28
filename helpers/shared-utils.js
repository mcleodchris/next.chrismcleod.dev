import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

export function getDateString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function randomString(length = 5) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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
    if (typeof value === 'object' && value !== null) {
      // Handle nested objects (like references)
      const nestedYaml = Object.entries(value).map(([nestedKey, nestedValue]) => {
        if (typeof nestedValue === 'object' && nestedValue !== null) {
          const deepYaml = Object.entries(nestedValue).map(([deepKey, deepValue]) => 
            `    ${deepKey}: ${deepValue}`
          ).join('\n');
          return `  ${nestedKey}:\n${deepYaml}`;
        }
        return `  ${nestedKey}: ${nestedValue}`;
      }).join('\n');
      return `${key}:\n${nestedYaml}`;
    }
    return `${key}: ${value}`;
  });
  return `---\n${yamlLines.join('\n')}\n---\n\n`;
}

export async function fetchWebpageMetadata(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract basic metadata
    const title = $('title').text().trim() ||
                 $('meta[property="og:title"]').attr('content')?.trim() ||
                 $('meta[name="twitter:title"]').attr('content')?.trim() ||
                 '';
    
    const description = $('meta[name="description"]').attr('content')?.trim() ||
                       $('meta[property="og:description"]').attr('content')?.trim() ||
                       $('meta[name="twitter:description"]').attr('content')?.trim() ||
                       '';
    
    const author = $('meta[name="author"]').attr('content')?.trim() ||
                  $('meta[property="article:author"]').attr('content')?.trim() ||
                  $('[rel="author"]').text().trim() ||
                  '';
    
    const siteName = $('meta[property="og:site_name"]').attr('content')?.trim() ||
                    $('meta[name="application-name"]').attr('content')?.trim() ||
                    '';
    
    const image = $('meta[property="og:image"]').attr('content')?.trim() ||
                 $('meta[name="twitter:image"]').attr('content')?.trim() ||
                 '';
    
    // Extract microformat data (h-entry, h-card, etc.)
    const hEntry = extractHEntry($, url);
    
    return {
      title,
      description,
      author,
      siteName,
      image,
      hEntry,
      url
    };
  } catch (error) {
    console.warn(`Failed to fetch metadata for ${url}:`, error.message);
    return {
      title: '',
      description: '',
      author: '',
      siteName: '',
      image: '',
      hEntry: null,
      url
    };
  }
}

function extractHEntry($, url) {
  const hEntry = $('.h-entry');
  if (hEntry.length === 0) return null;
  
  const entry = {
    url: url,
    type: 'entry'
  };
  
  // Extract h-entry properties
  const name = hEntry.find('.p-name').first().text().trim() ||
              hEntry.find('.e-content').first().text().trim().substring(0, 100) + '...' ||
              '';
  if (name) entry.name = name;
  
  const summary = hEntry.find('.p-summary').first().text().trim() ||
                 hEntry.find('.e-content').first().text().trim().substring(0, 200) + '...' ||
                 '';
  if (summary) entry.summary = summary;
  
  const featured = hEntry.find('.u-featured img').attr('src') ||
                  hEntry.find('.u-photo img').attr('src') ||
                  '';
  if (featured) entry.featured = featured;
  
  const author = hEntry.find('.p-author .p-name').first().text().trim() ||
                hEntry.find('.p-author').first().text().trim() ||
                '';
  if (author) entry.author = author;
  
  const publication = hEntry.find('.p-publication').first().text().trim() ||
                     $('meta[property="og:site_name"]').attr('content')?.trim() ||
                     '';
  if (publication) entry.publication = publication;
  
  return entry;
}

export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
