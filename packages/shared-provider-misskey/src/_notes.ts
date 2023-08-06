import { api as misskeyApi } from "misskey-js";

export class Noteservice {
	async show({
		client,
		noteId,
	}: {
		client: misskeyApi.APIClient;
		noteId: string;
	}) {
		return await client.request("notes/show", { noteId });
	}

	async getReactions({
		client,
		noteId,
	}: {
		client: misskeyApi.APIClient;
		noteId: string;
	}) {
		return await client.request("notes/reactions", { noteId });
	}

	async searchByTag({
		client,
		tag,
	}: {
		client: misskeyApi.APIClient;
		tag: string;
	}) {
		return await client.request("notes/search-by-tag", { limit: 20, tag });
	}
}
