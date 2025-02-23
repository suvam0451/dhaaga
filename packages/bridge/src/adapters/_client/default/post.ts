import { PostObjectType } from '../../../parsers/post.js';
import { PostRoute } from '../_router/routes/post.js';
import { ApiTargetInterface } from '../_router/routes/_index.js';

class Router implements PostRoute {
	client: ApiTargetInterface;
	constructor(client: ApiTargetInterface) {
		this.client = client;
	}
	async toggleLike(input: PostObjectType) {
		return input;
	}

	async toggleShare(input: PostObjectType) {
		return input;
	}

	async loadBookmark(input: PostObjectType) {
		return input;
	}

	async toggleBookmark(input: PostObjectType) {
		return input;
	}
}

export { Router as UnifiedPostRouter };
