// https://github.com/mastodon/mastodon/blob/5d5c0f4f4358f4349d9e2db59cf90b1f5de24e81/app/javascript/mastodon/features/compose/util/url_regex.js

export const getMastodonLength = (string) => {
    const urlPlaceholder = 'xxxxxxxxxxxxxxxxxxxxxxx'

    return string
        .replace(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm, urlPlaceholder)
        .replace(/(^|[^\/\w])@(([a-z0-9_]+)@[a-z0-9\.\-]+[a-z0-9]+)/ig, '$1@$3')
}