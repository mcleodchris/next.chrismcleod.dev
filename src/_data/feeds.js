const FETCH = require('@11ty/eleventy-fetch');

module.exports = async function () {
  const auth = Buffer.from(
    `${process.env.FEEDBIN_USER}:${process.env.FEEDBIN_PASSWORD}`,
    'utf-8'
  ).toString('base64');

  console.log('Fetching Feedbin subscriptions...');

  const subsEndpoint = process.env.FEEDBIN_SUBSCRIPTION_ENDPOINT;
  const tagsEndpoint = process.env.FEEDBIN_TAGGINGS_ENDPOINT;
  const options = {
    duration: '1d',
    type: 'json',
    fetchOptions: {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      }
    }
  };

  try {
    const [feeds, tags] = await Promise.allSettled([
      FETCH(subsEndpoint, options),
      FETCH(tagsEndpoint, options)
    ]);

    if (feeds.status === 'rejected') {
      console.error('Error fetching feeds:', feeds.reason);
      return [];
    }

    if (tags.status === 'rejected') {
      console.error('Error fetching tags:', tags.reason);
      return [];
    }

    const feedsData = feeds.value;
    const tagsData = tags.value;

    feedsData.forEach(feed => {
      const url = new URL(feed.site_url);
      feed.domain = url.hostname;
    });

    const uniqueTagsWithFeeds = [...new Set(tagsData.map(tag => tag.name))].map(name => ({
      name,
      feeds: feedsData.filter(feed =>
        tagsData.some(tag => tag.feed_id === feed.feed_id && tag.name === name)
      )
    }));

    return uniqueTagsWithFeeds;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
