import getHobbyData from './hobby.js';

export default function() {
  const years = Object.keys(getHobbyData()).map(Number);
  const paintslam = years.length
    ? [{ text: 'Paintslam', url: `/paintslam/${Math.max(...years)}/` }]
    : [];

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
      ...paintslam,
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
