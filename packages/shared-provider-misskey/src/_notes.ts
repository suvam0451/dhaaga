import { api as misskeyApi } from 'misskey-js';

export class NoteService {
	static async show({
		client,
		noteId,
	}: {
		client: misskeyApi.APIClient;
		noteId: string;
	}) {
		return await client.request('notes/show', { noteId });
	}

	static async getReactions({
		client,
		noteId,
	}: {
		client: misskeyApi.APIClient;
		noteId: string;
	}) {
		return await client.request('notes/reactions', { noteId });
	}

	static async searchByTag({
		client,
		tag,
	}: {
		client: misskeyApi.APIClient;
		tag: string;
	}) {
		return await client.request('notes/search-by-tag', { limit: 20, tag });
	}
}
