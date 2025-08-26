export const getAlmanacEmoji = (type) => {
    const emoji = {
        book: '📚',
        movie: '🍿',
        tv: '📺',
        game: '🎮',
    }

    return emoji[type]
};

export const getAlmanacVerb = (type) => {
    const verb = {
        book: 'Read',
        movie: 'Watched',
        tv: 'Watched',
        game: 'Played',
    }

    return verb[type]
};

export const getAlmanacImagePath = (type, file) => {
    return `/assets/catalog/almanac/${type}/${file}.jpg`
};

// Default export for backward compatibility
export default {
    getAlmanacEmoji,
    getAlmanacVerb,
    getAlmanacImagePath
};