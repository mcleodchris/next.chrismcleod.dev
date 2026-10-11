import fs from 'node:fs';
import path from 'node:path';
import {slugifyString} from '../utils/index.js';
export function resolveSocialImage(postData, siteMeta) {
  const data = postData?.data || postData || {};
  const candidates = [];
  if (data.ogImage)
    candidates.push(
      /^https?:\/\//.test(data.ogImage) || data.ogImage.startsWith('/')
        ? data.ogImage
        : `/assets/images/social-preview/${data.ogImage}`
    );
  if (data.title)
    candidates.push(
      `/assets/images/social-preview/${slugifyString(data.title.replace(/\//g, '-'))}-preview.jpeg`
    );
  candidates.push(siteMeta.meta_data.opengraph_default);
  for (const candidate of candidates) {
    if (/^https?:\/\//.test(candidate)) return new URL(candidate).href;
    if (
      candidate?.startsWith('/') &&
      !candidate.includes('..') &&
      fs.existsSync(path.join('src', candidate))
    )
      return new URL(candidate, siteMeta.url).href;
  }
  throw new Error('No existing default social preview image');
}
