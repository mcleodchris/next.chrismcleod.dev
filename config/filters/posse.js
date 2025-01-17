const utils = require('./utils');
const cheerio = require('cheerio');
const { decode } = require('html-entities');
const mastodonCount = require('./mastodonCounter');
const meta = require('../../src/_data/meta');
/* original implementation by Robb Knight https://github.com/rknightuk/rknight.me/blob/master/config/filters/indieweb.js */

module.exports = {
    // Function to generate text for a Mastodon toot based on a post
    makeTootText: (post, maxLength = 500) => {
        const permalink = `${meta.url}${post.permalink}`;
        const { layout, title, content: postContent, author, link } = post;

        // If the layout is not 'bookmark' or 'note', return the title and permalink
        if (!['bookmark', 'note'].includes(layout)) {
            return `${decode(title)} ${permalink}`;
        }

        // Load the post content into cheerio for parsing
        const $ = cheerio.load(`<div id="content">${decode(postContent)}</div>`);
        let allText = $('#content').text().trim().replace('\n', '\n\n');

        // Format blockquotes in the content
        $('blockquote').get().forEach(element => {
            const text = $(element).text().trim();
            allText = allText.replace(text, `> "${text}"`);
        });

        const getLength = (text) => maxLength === 500 ? mastodonCount.getMastodonLength(text).length : text.length;

        // If the layout is 'note', check the length and truncate if necessary
        if (layout === 'note') {
            if (getLength(allText) <= maxLength - permalink.length - 1) {
                return `${allText}`;
            }
            return `${allText.slice(0, maxLength - permalink.length - 6)}…\n\n📌 ${permalink}`;
        }

        const mastoUsername = author?.mastodon ? `${new URL(author.mastodon).pathname.replace('/', '')}@${new URL(author.mastodon).host}` : null;
        const baseContent = `🔗 ${decode(title)} ${mastoUsername ? `by ${mastoUsername}` : ''} ${link}`;
        const contentWithAllText = `${baseContent}\n\n${allText}`;
        const firstQuote = `> "${$('blockquote').first().text().trim()}"`;
        const contentWithFirstQuote = `${baseContent}\n\n${firstQuote}`;

        // Return the appropriate content based on length constraints
        if (getLength(contentWithAllText) <= maxLength) {
            return contentWithAllText;
        } else if (getLength(contentWithFirstQuote) <= maxLength) {
            return contentWithFirstQuote;
        } else {
            const trimmedQuote = firstQuote.slice(0, maxLength - baseContent.length - permalink.length - 7);
            return `${baseContent}\n\n${trimmedQuote}…"\n\n📌 ${permalink}`;
        }
    },

    // Function to get the title for Open Graph metadata
    getTitleForOg: (post) => decode(post.data.title),

    // Function to get the URL of the Open Graph image
    getOgImageUrl: (page) => {
        if (page.attachments?.length > 0) {
            return page.attachments[0].url ?? page.attachments[0];
        }

        let path = page.url;
        if (page.permalink === '404.html') path = '/404/';
        if (path.startsWith('/notes/') && path !== '/notes/') path = '/notes/single/';

        const url = encodeURIComponent(`${meta.url}opengraph${path}`);
        return `https://v1.screenshot.11ty.dev/${url}/opengraph/_123`;
    },

    // Function to get the Open Graph URL
    getOpengraphUrl: (inputPath) => {
        let path = inputPath;
        if (path.startsWith('/notes/') && path !== '/notes/') path = '/notes/single/';

        const url = encodeURIComponent(`${meta.url}opengraph${path}`);
        return `https://v1.screenshot.11ty.dev/${url}/opengraph/_123`;
    }
};