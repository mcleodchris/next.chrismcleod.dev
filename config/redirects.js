/** Check resolved routes, including templates excluded from collections.all. */
export function assertRedirectRoutes(inputPathToUrl) {
  const entries = Object.entries(inputPathToUrl);
  const isRedirect = file => file.replace(/^\.\//, '') === 'src/redirects.11ty.js';
  const redirects = new Set(
    entries.filter(([file]) => isRedirect(file)).flatMap(([, urls]) => urls)
  );
  for (const [file, urls] of entries) {
    if (isRedirect(file)) continue;
    for (const url of urls)
      if (redirects.has(url)) throw new Error(`Redirect collision: ${url} (${file})`);
  }
}
export default function redirectsPlugin(config) {
  // Eleventy resolves all pagination/permalinks before this event, and checks duplicates after it.
  config.on('eleventy.contentMap', ({inputPathToUrl}) =>
    assertRedirectRoutes(inputPathToUrl)
  );
}
