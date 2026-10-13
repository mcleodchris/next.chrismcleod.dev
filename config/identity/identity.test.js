import { test } from 'node:test';
import assert from 'node:assert/strict';
import { identity, slug } from './index.js';

test('a Post is named everywhere after its title', () => {
  const { slug: postSlug, url, previewImage, sequoiaPath, fileName } = identity('post', 'Whimsy Is Enough');
  assert.equal(postSlug, 'whimsy-is-enough');
  assert.equal(url, '/blog/whimsy-is-enough/');
  assert.equal(previewImage, 'whimsy-is-enough-preview.jpeg');
  assert.equal(sequoiaPath, '/blog/whimsy-is-enough');
  assert.equal(fileName('2025-01-24'), '2025-01-24-whimsy-is-enough.md');
});

test('a Bookmark has a URL and file name but no Preview image or Sequoia path', () => {
  const bookmark = identity('bookmark', 'HTML Is for People');
  assert.equal(bookmark.url, '/bookmarks/html-is-for-people/');
  assert.equal(bookmark.fileName('2024-11-15'), '2024-11-15-html-is-for-people.md');
  assert.equal(bookmark.previewImage, undefined);
  assert.equal(bookmark.sequoiaPath, undefined);
});

test('punctuation: the site and Sequoia slugify titles differently', () => {
  const cases = [
    ['Why? Because & stuff', '/blog/why-because-and-stuff/', '/blog/why-because--stuff'],
    ['C++ vs. C#', '/blog/c-vs-c/', '/blog/c-vs-c'],
    ['Hey 👋🏻 Goodbye', '/blog/hey-👋🏻-goodbye/', '/blog/hey--goodbye'],
    ["Don't Panic: A Guide", '/blog/dont-panic-a-guide/', '/blog/dont-panic-a-guide']
  ];
  for (const [title, url, sequoiaPath] of cases) {
    assert.deepEqual(
      { url: identity('post', title).url, sequoiaPath: identity('post', title).sequoiaPath },
      { url, sequoiaPath },
      title
    );
  }
});

test('a title with a slash', () => {
  const post = identity('post', 'On/Off');
  assert.equal(post.url, '/blog/on/off/');
  assert.equal(post.previewImage, 'on-off-preview.jpeg');
  assert.equal(post.fileName('2021-04-10'), '2021-04-10-on-off.md');
  assert.equal(post.sequoiaPath, '/blog/onoff');
});

test('the Slug rule also names heading anchors', () => {
  assert.equal(slug('Step 2: Install & Configure'), 'step-2-install-and-configure');
});

test('an unknown kind is an error', () => {
  assert.throws(() => identity('note', 'Anything'), /Unknown kind "note"/);
});
