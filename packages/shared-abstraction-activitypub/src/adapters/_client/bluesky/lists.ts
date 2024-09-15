import { LibraryPromise } from '../_router/routes/_types.js';
import { ListsRoute } from '../_router/routes/lists.js';

export class BlueskyListRoute implements ListsRoute {
	update(): LibraryPromise<any> {
		throw new Error('Method not implemented.');
	}
	get(id: string): LibraryPromise<any> {
		throw new Error('Method not implemented.');
	}
	list(): LibraryPromise<
		| any[]
		| {
				id: string;
				createdAt: string;
				name: string;
				userIds?: string[] | undefined;
				isPublic: boolean;
		  }[]
	> {
		throw new Error('Method not implemented.');
	}
}
