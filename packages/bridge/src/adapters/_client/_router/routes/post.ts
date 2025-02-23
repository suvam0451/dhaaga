import { PostObjectType } from '../../../../parsers/post.js';

export interface PostRoute {
	toggleLike: (input: PostObjectType) => Promise<PostObjectType>;
	toggleShare: (input: PostObjectType) => Promise<PostObjectType>;
	loadBookmark: (input: PostObjectType) => Promise<PostObjectType>;
	toggleBookmark: (input: PostObjectType) => Promise<PostObjectType>;
}
