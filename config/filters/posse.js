import * as utils from './utils.js';
import { decode } from 'html-entities';
import { getMastodonLength } from './mastodonCounter.js';
import TurndownService from 'turndown';
import meta from '../../src/_data/meta.js';
/* original implementation by Robb Knight https://github.com/rknightuk/rknight.me/blob/master/config/filters/indieweb.js */

const posseText = (post, postLength = 500) => {
    let content = ''
    const permalink = `${meta.url}${post.permalink}`

    if (!['bookmark', 'note'].includes(post.layout))
    {
        content = `${decode(post.title)} ${permalink}`

        return content
    }

    const turndownService = new TurndownService()
    turndownService.addRule('link', {
        filter: 'a',
        replacement: function (content, node) {
            // don't double link @mentions
            if (content.startsWith('@') && node.href.includes('/@'))
            {
                const url = new URL(node.href)
                const username = url.pathname.replace('/', '')
                const domain = url.host
                return `${username}@${domain}`
            }

            // don't double link URLs
            if (content === node.href) return content
            
            // <a href="/url">text</a> => text (/url)
            return `${content} (${node.href})`
        }
    })
    turndownService.addRule('blockquote', {
        filter: 'blockquote',
        replacement: function (content) {
            return `> "${content.trim()}"`
        }
    })
    turndownService.addRule('remove', {
        filter: ['img'],
        replacement: function (content, node) {
          return ''
        }
    })

    const turnedDown = turndownService.turndown(decode(post.content))

    if (post.layout === 'note') return formatNote(turnedDown, permalink, postLength)
    if (post.layout === 'bookmark') return formatLink(post, turnedDown, permalink, postLength)
}

const formatNote = (content, permalink, postLength) => {
    const combined = `${content}\n\n📌 ${permalink}`

    if (getMastodonLength(content).length <= (postLength - permalink.length) - 1)
    {
        return combined
    }

    return `${content.slice(0, (postLength - permalink.length) -13 )}…\n\n${permalink}`
}

const formatLink = (post, content, permalink, postLength) => {
    const getLength = (text) => postLength === 500 ? getMastodonLength(text).length : text.length;

    let formatted = ''

    formatted = `🔗 ${decode(post.title)} ${post.bookmark}`

    const firstLine = content.split('\n')[0]
    const formattedWithFirstLine = `${formatted}\n\n${firstLine}…\n\n📌 ${permalink}`
    const formattedWithAll = content ? `${formatted}\n\n${content}` : `${formatted}`

    if (getLength(formattedWithAll) <= postLength)
    {
        return formattedWithAll
    } else if (getLength(formattedWithFirstLine) <= postLength)
    {
        return formattedWithFirstLine
    }

    return formatted
}


export const makeTootText = (post) => posseText(post, 500);

export const makeBlueskyText = (post) => posseText(post, 295);

// Function to get the title for Open Graph metadata
export const getTitleForOg = (post) => decode(post.data.title);

// Function to get the URL of the Open Graph image
export const getOgImageUrl = (page) => {
    if (page.attachments?.length > 0) {
        return page.attachments[0].url ?? page.attachments[0];
    }

    let path = page.url;
    if (page.permalink === '404.html') path = '/404/';
    if (path.startsWith('/notes/') && path !== '/notes/') path = '/notes/single/';

    const url = encodeURIComponent(`${meta.url}opengraph${path}`);
    return `https://v1.screenshot.11ty.dev/${url}/opengraph/_123`;
};

// Function to get the Open Graph URL
export const getOpengraphUrl = (inputPath) => {
    let path = inputPath;
    if (path.startsWith('/notes/') && path !== '/notes/') path = '/notes/single/';

    const url = encodeURIComponent(`${meta.url}opengraph${path}`);
    return `https://v1.screenshot.11ty.dev/${url}/opengraph/_123`;
};

// Default export for backward compatibility
export default {
    makeTootText,
    makeBlueskyText,
    getTitleForOg,
    getOgImageUrl,
    getOpengraphUrl
};