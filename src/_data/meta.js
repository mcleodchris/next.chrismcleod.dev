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
  authorEmail: 'feedback@chrismcleod.dev', // i.e. hola@lenesaile.com - email of the author
  authorWebsite: 'https://chrismcleod.dev/', // i.e. https.://www.lenesaile.com - the personal site of the author
  themeColor: '#D81E5B', //  Manifest: defines the default theme color for the application
  themeBgColor: '#F4F7F5', // Manifest: defines a placeholder background color for the application page to display before its stylesheet is loaded
  meta_data: {
    opengraph_default: '/assets/images/opengraph-default.jpg', // fallback/default meta image
    opengraph_default_alt:
      'Chris McLeod is a software developer with over 20 years of experience. Sometimes he writes about it.', // alt text for default meta image
    twitterSite: '', // i.e. @site - twitter profile of the site
    twitterCreator: '', // i.e. @author -  twitter profile of the site
    mastodonProfile: 'https://social.lol/@chrisplusplus', // i.e. https://front-end.social/@lene - url to your mastodon instance/profile
    fediverseCreator: '@chrisplusplus@social.lol' // i.e. username@instance - fediverse profile of the author
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
  indieauth: 'https://github.com/mcleodchris',
  feeds: [
    {
      title: 'chrismcleod.dev: main blog feed',
      url: 'https://chrismcleod.dev/feed.xml',
      type: 'atom+xml'
    },
    {
      title: 'chrismcleod.dev: bookmarks feed',
      url: 'https://chrismcleod.dev/bookmarks/feed.xml',
      type: 'atom+xml'
    }
  ],
  magetower: {
    api_base: 'https://mage.chrismcleod.dev',
    token: process.env.MAGE_API_TOKEN
  },
  warcraft: {
    api_base: 'https://eu.api.blizzard.com',
    region: 'eu',
    namespace: 'profile-eu',
    locale: 'en_GB',
    clientId: process.env.BLIZZARD_CLIENT_ID,
    clientSecret: process.env.BLIZZARD_CLIENT_SECRET,
    characters: [
      {
        name: 'reinias',
        realm: 'dragonblight'
      },
      {
        name: 'faerlune',
        realm: 'dragonblight'
      },
      {
        name: 'shaasvre',
        realm: 'dragonblight'
      },
      {
        name: 'faerilina',
        realm: 'dragonblight'
      },
      {
        name: 'faerlorna',
        realm: 'dragonblight'
      },
      {
        name: 'faerelune',
        realm: 'dragonblight'
      },
      {
        name: 'faerefel',
        realm: 'dragonblight'
      }
    ]
  },
  indieweb: {
    avatar: "https://assets.chrism.cloud/chrismcleod.dev/assets/resized/06_1280-320.jpeg"
  }
};
