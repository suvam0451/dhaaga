import { ListsRoute } from './_interface.js';

export class BlueskyListRoute implements ListsRoute {
	update(): Promise<any> {
		throw new Error('Method not implemented.');
	}
	get(id: string): Promise<any> {
		throw new Error('Method not implemented.');
	}
	list(): Promise<
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
