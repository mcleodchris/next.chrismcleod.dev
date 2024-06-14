const { AssetCache } = require("@11ty/eleventy-fetch");
/**
 * This module exports an asynchronous function that queries a GraphQL endpoint for
 * a list of miniatures I've finished painting. It then groups the items by year and sorts
 * them by completion date.
 * 
 * @module
 * @async
 * @returns {Object} An object where each key is a year and the value is an array of items completed in that year.
 * 
 * @example
 * const getCompletedItems = require('./hobby.js');
 * getCompletedItems().then(items => console.log(items));
 * 
 * @throws {Error} If the fetch request fails, an error will be thrown.
 */
module.exports = async function () {
    // The GraphQL endpoint to query
    let asset = new AssetCache("paintslam_data");
    const endpoint = 'https://mage.chrismcleod.dev/hobby';

    // Send a GET request to the REST endpoint
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.MAGE_API_TOKEN}`,
        },
    });

    // Parse the JSON response (an array of items)
    const data  = await response.json();

    // Reduce the array of items into an object where each key is a year and the value is an array of items completed in that year
    const items = data.reduce((acc, item) => {
        const year = new Date(item.completedDate).getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }
        // convert the modelCount to an Integer
        item.modelCount = parseInt(item.modelCount, 10);
        acc[year].push(item);
        return acc;
    }, {});

    // within each year, sort the items by completed date ascending
    for (const year in items) {
        items[year].sort((a, b) => new Date(a.completedDate) - new Date(b.completedDate));
    }

    await asset.save(items, "json");
    return items;
}