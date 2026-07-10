/**
 * Generates OpenGraph preview images for all blog posts.
 *
 * Usage:
 *   npm run og           — generate missing images, add ogImage to frontmatter if absent
 *   npm run og:force     — regenerate all images, update all ogImage frontmatter
 *
 * Edit helpers/og-template.js to change the SVG design.
 * Images are written to src/assets/images/social-preview/ and committed to the repo.
 * The site build copies them to dist/ via Eleventy's passthrough copy.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import os from 'os';
import yaml from 'js-yaml';
import slugify from 'slugify';
import Image from '@11ty/eleventy-img';
import dayjs from 'dayjs';
import { renderOgTemplate } from './og-template.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const force = process.argv.includes('--force');

const POSTS_DIR = path.join(ROOT, 'src/posts');
const OUTPUT_DIR = path.join(ROOT, 'src/assets/images/social-preview');
const FONTS_DIR  = path.join(ROOT, 'src/assets/fonts');

/**
 * Install the iA Writer fonts to the user's font directory so librsvg/Sharp
 * can find them by their actual family names ("iA Writer Quattro S", "iA Writer Duo S").
 * Skips silently if already installed.
 */
const ensureFontsInstalled = () => {
  const targetDir = path.join(os.homedir(), '.local/share/fonts/ia-writer');
  const marker = path.join(targetDir, '.installed');
  if (fs.existsSync(marker)) return;
  fs.mkdirSync(targetDir, { recursive: true });
  const fonts = [
    'quattro/iAWriterQuattroS-Bold.woff',
    'quattro/iAWriterQuattroS-Regular.woff',
    'duo/iAWriterDuoS-Bold.woff',
    'duo/iAWriterDuoS-Regular.woff',
  ];
  for (const f of fonts) {
    const src = path.join(FONTS_DIR, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(targetDir, path.basename(src)));
    }
  }
  try {
    execSync('fc-cache -f', { stdio: 'pipe' });
  } catch { /* fc-cache unavailable — fonts may still work */ }
  fs.writeFileSync(marker, '');
  console.log('✓ iA Writer fonts installed to ~/.local/share/fonts/ia-writer/');
};

// Must match the slugify config in config/utils/index.js
const slugifyString = (str) =>
  slugify(str, { replacement: '-', remove: /[#,&,+()$~%.'":*?<>{}]/g, lower: true });

/**
 * Derive a flat image basename from a post title.
 * Replaces `/` with `-` before slugifying to prevent nested directory creation.
 */
const getImageBasename = (title) => {
  const safeTitle = title.replace(/\//g, '-');
  return `${slugifyString(safeTitle)}-preview`;
};

/** Parse YAML frontmatter from markdown content, returning the data object or null. */
const parseFrontmatter = (content) => {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1]) || {};
  } catch {
    return null;
  }
};

/**
 * Add or replace the `ogImage` key in a file's frontmatter without re-serialising
 * the whole block (preserving existing formatting, dates, etc.).
 */
const writeOgImageFrontmatter = (content, jpegFilename, replaceExisting) => {
  if (replaceExisting && /^ogImage:/m.test(content)) {
    return content.replace(/^ogImage:.*$/m, `ogImage: ${jpegFilename}`);
  }
  // Insert before the closing `---`
  return content.replace(/^(---\r?\n[\s\S]*?)\r?\n---/m, `$1\nogImage: ${jpegFilename}\n---`);
};

const main = async () => {
  ensureFontsInstalled();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const postFiles = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));

  let generated = 0;
  let skipped = 0;
  let frontmatterUpdated = 0;

  for (const file of postFiles) {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = parseFrontmatter(content);

    if (!data || !data.title) {
      console.log(`⚠ Skipping ${file} (no title or unreadable frontmatter)`);
      continue;
    }

    const basename = getImageBasename(data.title);
    const svgPath = path.join(OUTPUT_DIR, `${basename}.svg`);
    const jpegPath = path.join(OUTPUT_DIR, `${basename}.jpeg`);
    const jpegFilename = `${basename}.jpeg`;

    const jpegExists = fs.existsSync(jpegPath);

    if (jpegExists && !force) {
      skipped++;
      // Still backfill ogImage frontmatter if missing
      if (!data.ogImage) {
        const updated = writeOgImageFrontmatter(content, jpegFilename, false);
        fs.writeFileSync(filePath, updated);
        frontmatterUpdated++;
      }
      continue;
    }

    // Delete existing JPEG so eleventy-img doesn't skip it due to its own cache
    if (force && jpegExists) {
      fs.unlinkSync(jpegPath);
    }

    // Render SVG from template
    const formattedDate = data.date ? dayjs(data.date).format('DD / MM / YYYY') : '';
    const svgContent = renderOgTemplate({
      title: data.title,
      date: formattedDate,
      siteName: 'Chris McLeod',
      siteUrl: 'chrismcleod.dev',
    });

    fs.writeFileSync(svgPath, svgContent);

    // Convert SVG → JPEG
    try {
      await Image(svgPath, {
        formats: ['jpeg'],
        outputDir: OUTPUT_DIR,
        filenameFormat: (_id, _src, _width, format) => `${basename}.${format}`,
      });
      fs.unlinkSync(svgPath);
      generated++;
      console.log(`✓ ${jpegFilename}`);
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
      if (fs.existsSync(svgPath)) fs.unlinkSync(svgPath);
      continue;
    }

    // Write ogImage to frontmatter
    if (!data.ogImage || force) {
      const replaceExisting = force && !!data.ogImage;
      const updated = writeOgImageFrontmatter(content, jpegFilename, replaceExisting);
      fs.writeFileSync(filePath, updated);
      frontmatterUpdated++;
    }
  }

  console.log(
    `\nDone: ${generated} generated, ${skipped} skipped, ${frontmatterUpdated} frontmatter updated`
  );
};

main().catch(console.error);
