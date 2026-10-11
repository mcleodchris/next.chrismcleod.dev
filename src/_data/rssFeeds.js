import {xmlFeeds} from '../../config/feed-descriptors.js';
export default xmlFeeds.filter(feed => feed.format === 'rss');
