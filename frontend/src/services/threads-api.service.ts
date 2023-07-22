import { ThreadsAPI } from "threads-api";

class ThreadsApiClient {
	username?: string;
	password?: string;
	fbLsdToken?: string;
	deviceId?: string;
	token?: string;

	client: ThreadsAPI;

	constructor({
		username,
		password,
		fbLsdToken,
		deviceId,
		token,
	}: {
		username?: string;
		password?: string;
		fbLsdToken?: string;
		deviceId?: string;
		token?: string;
	}) {
		this.username = username || undefined;
		this.password = password || undefined;
		this.fbLsdToken = fbLsdToken || undefined;
		this.deviceId = deviceId || undefined;
		this.token = token || undefined;

		this.client = new ThreadsAPI({
			username: this.username,
			password: this.password,
			fbLSDToken: this.fbLsdToken,
			deviceID: this.deviceId,
			token: this.token,
		});
	}

	async retrieveTokens() {
		const res = await this.client.login();
		console.log(res);
	}

	async fetchOnePageForUser(userId: string) {
		const { threads, next_max_id } =
			await this.client.getUserProfileThreadsLoggedIn(userId);
		return {
			items: threads,
			cursor: next_max_id,
		};
	}
}

export default ThreadsApiClient;
