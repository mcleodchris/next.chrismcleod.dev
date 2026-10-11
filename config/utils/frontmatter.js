import yaml from 'js-yaml';

/** Parse source YAML without changing the original text or front-matter formatting. */
export function frontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  return {
    data: match ? yaml.load(match[1]) || {} : {},
    body: match ? text.slice(match[0].length) : text
  };
}
