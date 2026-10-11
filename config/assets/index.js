import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssImportExtGlob from 'postcss-import-ext-glob';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import esbuild from 'esbuild';
let state = {};
export function assetUrl(pathname) {
  if (!state[pathname]) throw new Error(`Asset has not been compiled: ${pathname}`);
  return `${pathname}?v=${state[pathname]}`;
}
export async function compileAssets({outputDir, production = false}) {
  const cssPath = 'src/assets/css/global.css';
  const [css, js] = await Promise.all([
    fs
      .readFile(cssPath, 'utf8')
      .then(content =>
        postcss([
          postcssImportExtGlob,
          postcssImport,
          tailwindcss('./tailwind.config.js'),
          autoprefixer,
          ...(production ? [cssnano] : [])
        ]).process(content, {from: cssPath})
      ),
    esbuild.build({
      target: 'es2020',
      entryPoints: ['src/assets/scripts/app.js'],
      minify: production,
      bundle: true,
      write: false
    })
  ]);
  const outputs = {
    '/assets/css/global.css': css.css,
    '/assets/scripts/app.js': js.outputFiles[0].text
  };
  const next = {};
  for (const [pathname, content] of Object.entries(outputs)) {
    const dest = path.join(outputDir, pathname);
    await fs.mkdir(path.dirname(dest), {recursive: true});
    await fs.writeFile(dest, content);
    next[pathname] = createHash('sha256').update(content).digest('hex').slice(0, 12);
  }
  state = next;
  return next;
}
export default function assetsPlugin(config) {
  config.on('eleventy.before', ({directories}) =>
    compileAssets({
      outputDir: directories.output,
      production: process.env.ELEVENTY_PRODUCTION === 'true'
    })
  );
  config.addNunjucksGlobal('assetUrl', assetUrl);
  for (const target of [
    'src/assets/',
    'src/_data/designTokens/',
    'tailwind.config.js',
    'config/assets/'
  ])
    config.addWatchTarget(target);
}
