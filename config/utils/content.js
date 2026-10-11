export const bookmarkUrl = data => data.bookmarkOf ?? data.bookmark_of ?? '';
export const likeUrl = data => data.likeOf ?? data.like_of ?? data['like-of'] ?? '';
