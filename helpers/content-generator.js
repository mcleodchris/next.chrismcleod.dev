import path from 'path';
import { getDirname, createFileWithContent, getDateString } from './shared-utils.js';

export class ContentGenerator {
  constructor(importMetaUrl, contentType) {
    this.dirname = getDirname(importMetaUrl);
    this.contentType = contentType;
    this.contentDir = path.join(this.dirname, `../src/${contentType}`);
  }

  generateFilePath(filename) {
    return path.join(this.contentDir, filename);
  }

  createContent(filename, content) {
    const filePath = this.generateFilePath(filename);
    createFileWithContent(filePath, content);
  }

  getDateString() {
    return getDateString();
  }
}
