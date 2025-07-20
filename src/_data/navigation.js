const getHobbyData = require('./hobby.js');

module.exports = async function() {
  const hobby = await getHobbyData();
  const years = Object.keys(hobby).map(Number);
  const latestYear = years.length ? Math.max(...years) : new Date().getFullYear();

  return {
    top: [
      {
        text: 'Blog',
        url: '/blog/'
      },
      {
        text: 'Bookmarks',
        url: '/bookmarks/0/'
      },
      {
        text: 'Paintslam',
        url: `/paintslam/${latestYear}/`
      },
      {
        text: 'Photos',
        url: 'https://chrismcleod.photos/'
      },
      {
        text: 'Follow',
        url: '/follow/'
      },
      {
        text: 'About',
        url: '/about/'
      }
    ],
    bottom: [
      {
        text: 'Privacy',
        url: '/privacy/'
      },
      {
        text: 'Roadmap',
        url: '/roadmap/'
      }
    ]
  };
};
