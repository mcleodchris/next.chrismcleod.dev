import { identity } from '../../config/identity/index.js';

export default {
  layout: 'post',
  tags: ['posts', 'timeline'],
  permalink: data => `${identity('post', data.title).url}index.html`
};
