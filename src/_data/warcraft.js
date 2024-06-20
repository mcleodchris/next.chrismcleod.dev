/**
 * Fetches character data from the Battle.NET API for a predefined list of characters
 * specified in meta.js.
 */
const FETCH = require('@11ty/eleventy-fetch');
const {warcraft} = require('./meta');

const getData = async (href, token) => {
  return await FETCH(href, {
    type: 'json',
    duration: '5d',
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
};

const getToken = async () => {
  const {access_token: token} = await FETCH('https://oauth.battle.net/token', {
    type: 'json',
    fetchOptions: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${warcraft.clientId}:${warcraft.clientSecret}`
        ).toString('base64')}`
      },
      body: `grant_type=client_credentials`
    }
  });
  return token;
};

async function fetchAndMergeData(key, data, token) {
  if (data[key] && data[key].href) {
    data[key] = {
      ...data[key],
      ...(await getData(`${data[key].href}&locale=${warcraft.locale}`, token))
    };
  }
}

module.exports = async function () {
  const characters = warcraft.characters;
  const characterData = [];

  console.info('Fetching character data');

  const token = await getToken();

  for (const character of characters) {
    const href = `${warcraft.api_base}/profile/wow/character/${
      character.realm
    }/${character.name.toLowerCase()}?namespace=${warcraft.namespace}&locale=${
      warcraft.locale
    }`;
    const profile = await getData(href, token);

    //loop through each key in the profile object
    for (const key in profile) {
      await fetchAndMergeData(key, profile, token);
    }

    characterData.push(profile);
  }

  return characterData;
};
