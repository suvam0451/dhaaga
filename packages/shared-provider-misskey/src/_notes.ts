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
}
