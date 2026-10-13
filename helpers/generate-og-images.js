/**
 * Generates OpenGraph preview images for all blog posts.
 *
 * Usage:
 *   npm run og           — generate missing images, add ogImage to frontmatter if absent
 *   npm run og:force     — regenerate all images, update all ogImage frontmatter
 *
 * A post whose ogImage no longer matches its title's Slug has been renamed
 * (docs/adr/0002): it gets a new image, its old URL is added to redirectFrom,
 * and the old image is deleted unless another post still uses it.
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
import Image from '@11ty/eleventy-img';

import { renderOgTemplate } from './og-template.js';
import { formatDate } from '../config/utils/index.js';
import { formerUrl, identity } from '../config/identity/index.js';
import { appendToList, readFrontMatter, setValue } from './front-matter.js';

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

const main = async () => {
  ensureFontsInstalled();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const posts = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(POSTS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return { file, filePath, content, data: readFrontMatter(content) };
    });

  // Each post's ogImage as this run leaves it, and the images renamed posts stopped using:
  // a retired image is deleted after every post is processed, if no post refers to it then.
  const finalImages = new Map(posts.map(({ filePath, data }) => [filePath, data?.ogImage]));
  const retiredImages = new Set();

  let generated = 0;
  let skipped = 0;
  let frontmatterUpdated = 0;
  let renamed = 0;
  let failed = 0;

  for (const { file, filePath, content, data } of posts) {
    if (!data || !data.title) {
      console.log(`⚠ Skipping ${file} (no title or unreadable frontmatter)`);
      continue;
    }

    const jpegFilename = identity('post', data.title).previewImage;
    const basename = path.basename(jpegFilename, '.jpeg');
    const svgPath = path.join(OUTPUT_DIR, `${basename}.svg`);
    const jpegPath = path.join(OUTPUT_DIR, jpegFilename);

    const jpegExists = fs.existsSync(jpegPath);
    const isRenamed = Boolean(data.ogImage) && data.ogImage !== jpegFilename;

    if (jpegExists && !force && !isRenamed) {
      skipped++;
      // Still backfill ogImage frontmatter if missing
      if (!data.ogImage) {
        fs.writeFileSync(filePath, setValue(content, 'ogImage', jpegFilename));
        finalImages.set(filePath, jpegFilename);
        frontmatterUpdated++;
      }
      continue;
    }

    // Delete existing JPEG so eleventy-img doesn't skip it due to its own cache
    if (jpegExists) {
      fs.unlinkSync(jpegPath);
    }

    // Render SVG from template
    const formattedDate = data.date ? formatDate(data.date, 'MMMM Do, YYYY') : '';
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
      failed++;
      continue;
    }

    let updated = setValue(content, 'ogImage', jpegFilename);
    finalImages.set(filePath, jpegFilename);

    if (isRenamed) {
      renamed++;
      // A post with its own permalink does not move when its title changes.
      const former = data.permalink ? undefined : formerUrl('post', data.title, data.ogImage);
      if (former) updated = appendToList(updated, 'redirectFrom', former);
      console.log(`  renamed from ${data.ogImage}${former ? `; ${former} now redirects` : ''}`);
      retiredImages.add(data.ogImage);
    }

    if (updated !== content) {
      fs.writeFileSync(filePath, updated);
      frontmatterUpdated++;
    }
  }

  const stillUsed = new Set(finalImages.values());
  for (const image of retiredImages) {
    const oldPath = path.join(OUTPUT_DIR, path.basename(image));
    if (!stillUsed.has(image) && fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  console.log(
    `\nDone: ${generated} generated, ${renamed} renamed, ${skipped} skipped, ${frontmatterUpdated} frontmatter updated, ${failed} failed`
  );
  if (failed > 0) process.exitCode = 1;
};

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
