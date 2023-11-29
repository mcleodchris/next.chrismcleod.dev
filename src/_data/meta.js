module.exports = {
  url: 'https://chrismcleod.dev',
  siteName: 'Chris McLeod',
  siteDescription:
    'Chris McLeod is a software developer with over 20 years of experience. Sometimes he writes about it.',
  siteType: 'Person', // schema
  locale: 'en_EN',
  lang: 'en',
  skipContent: 'Skip to content',
  author: 'Chris McLeod', // i.e. Lene Saile - author's name. Must be set.
  authorEmail: '', // i.e. hola@lenesaile.com - email of the author
  authorWebsite: 'https://chrismcleod.dev', // i.e. https.://www.lenesaile.com - the personal site of the author
  themeColor: '#D81E5B', //  Manifest: defines the default theme color for the application
  themeBgColor: '#F4F7F5', // Manifest: defines a placeholder background color for the application page to display before its stylesheet is loaded
  meta_data: {
    opengraph_default: '/assets/images/opengraph-default.jpg', // fallback/default meta image
    opengraph_default_alt:
      'Chris McLeod is a software developer with over 20 years of experience. Sometimes he writes about it.', // alt text for default meta image
    twitterSite: '', // i.e. @site - twitter profile of the site
    twitterCreator: '', // i.e. @author -  twitter profile of the site
    mastodonProfile: 'https://mastodon.online/@mstrkapowski' // i.e. https://front-end.social/@lene - url to your mastodon instance/profile
  },
  blog: {
    // this is for the rss feed
    name: "Chris McLeod's blog",
    description: 'Blog posts by Chris McLeod, posted to https://chrismcleod.dev'
  },
  pagination: {
    itemsPerPage: 20
  },
  address: {},
  menu: {
    closedText: 'Menu'
  },
  indieauth: 'https://github.com/mcleodchris'
};
