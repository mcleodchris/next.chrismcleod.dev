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
