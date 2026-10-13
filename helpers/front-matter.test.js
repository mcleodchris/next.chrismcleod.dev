import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appendToList, readFrontMatter, setValue } from './front-matter.js';

const post = frontMatter => `---\n${frontMatter}\n---\n\nBody text.\n`;

test('reads dates as Eleventy does', () => {
  const data = readFrontMatter(post("title: 'On/Off'\ndate: 2021-04-10"));
  assert.equal(data.title, 'On/Off');
  assert.ok(data.date instanceof Date);
});

test('unreadable or missing front matter reads as undefined', () => {
  assert.equal(readFrontMatter('No front matter'), undefined);
  assert.equal(readFrontMatter(post('title: [unclosed')), undefined);
});

test('setValue replaces only its own key', () => {
  const before = post("title: 'On/Off'\ndate: 2021-04-10\nogImage: old-preview.jpeg\ntags:\n  - misc");
  assert.equal(
    setValue(before, 'ogImage', 'on-off-preview.jpeg'),
    post("title: 'On/Off'\ndate: 2021-04-10\nogImage: on-off-preview.jpeg\ntags:\n  - misc")
  );
});

test('setValue adds a missing key at the end', () => {
  assert.equal(
    setValue(post('title: Hello\ndate: 2021-04-10'), 'ogImage', 'hello-preview.jpeg'),
    post('title: Hello\ndate: 2021-04-10\nogImage: hello-preview.jpeg')
  );
});

test('setValue keeps Windows line endings', () => {
  const before = '---\r\ntitle: Hello\r\nogImage: a.jpeg\r\n---\r\nBody';
  assert.equal(setValue(before, 'ogImage', 'b.jpeg'), '---\r\ntitle: Hello\r\nogImage: b.jpeg\r\n---\r\nBody');
});

test('appendToList handles every form redirectFrom takes', () => {
  const cases = [
    ['missing', 'title: On/Off', "title: On/Off\nredirectFrom: ['/blog/on/off/']"],
    ['single value', "redirectFrom: '/2021/04/10/on-off/'", "redirectFrom: ['/2021/04/10/on-off/', '/blog/on/off/']"],
    ['inline list', "redirectFrom: ['/2021/04/10/on-off/']", "redirectFrom: ['/2021/04/10/on-off/', '/blog/on/off/']"],
    ['inline list on the next line', "redirectFrom:\n  ['/2021/04/10/on-off/']\ndate: 2021-04-10", "redirectFrom: ['/2021/04/10/on-off/', '/blog/on/off/']\ndate: 2021-04-10"],
    ['block list', "redirectFrom:\n  - /a/\n  - /b/\ndate: 2021-04-10", "redirectFrom: ['/a/', '/b/', '/blog/on/off/']\ndate: 2021-04-10"],
    ['block list at the key\'s indent', "redirectFrom:\n- /a/\ndate: 2021-04-10", "redirectFrom: ['/a/', '/blog/on/off/']\ndate: 2021-04-10"],
    ['block list with a blank line', "redirectFrom:\n  - /a/\n\n  - /b/\ndate: 2021-04-10", "redirectFrom: ['/a/', '/b/', '/blog/on/off/']\ndate: 2021-04-10"],
    ['block list with a comment', "redirectFrom:\n  - /a/\n# moved twice\n  - /b/\ndate: 2021-04-10", "redirectFrom: ['/a/', '/b/', '/blog/on/off/']\ndate: 2021-04-10"],
    ['last key, trailing blank line kept', "date: 2021-04-10\nredirectFrom:\n  - /a/\n", "date: 2021-04-10\nredirectFrom: ['/a/', '/blog/on/off/']\n"]
  ];
  for (const [form, before, after] of cases) {
    assert.equal(appendToList(post(before), 'redirectFrom', '/blog/on/off/'), post(after), form);
  }
});

test('appendToList leaves the file alone when the value is already listed', () => {
  const text = post("redirectFrom: [ '/blog/on/off/' ]");
  assert.equal(appendToList(text, 'redirectFrom', '/blog/on/off/'), text);
});

test('values that need quoting are quoted', () => {
  assert.equal(
    appendToList(post('title: x'), 'redirectFrom', "/blog/don't/"),
    post("title: x\nredirectFrom: ['/blog/don''t/']")
  );
  assert.equal(setValue(post('title: x'), 'ogImage', 'a: b.jpeg'), post("title: x\nogImage: 'a: b.jpeg'"));
});

test('an edited block list still reads back as valid front matter', () => {
  const edited = appendToList(post("redirectFrom:\n  - /a/\n\n  - /b/\ndate: 2021-04-10"), 'redirectFrom', '/c/');
  assert.deepEqual(readFrontMatter(edited).redirectFrom, ['/a/', '/b/', '/c/']);
});
