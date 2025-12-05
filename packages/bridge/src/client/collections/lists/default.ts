import { ListsRoute } from './_interface.js';

export class DefaultListRoute implements ListsRoute {
	async update(): Promise<any> {
		throw new Error('Method not implemented.');
	}
	async get(id: string): Promise<any> {
		throw new Error('Method not implemented.');
	}
	async list(): Promise<any[]> {
		throw new Error('Method not implemented.');
	}
}
