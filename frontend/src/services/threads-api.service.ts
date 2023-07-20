import { ThreadsAPI } from "threads-api";

class ThreadsApiClient {
	username?: string;
	password?: string;
	fbLsdToken?: string;

	constructor({
		username,
		password,
		fbLsdToken,
	}: {
		username?: string;
		password?: string;
		fbLsdToken?: string;
	}) {
		this.username = username || undefined;
		this.password = password || undefined;
		this.fbLsdToken = fbLsdToken || undefined;
	}
  
	async retrieveTokens() {
		const client = new ThreadsAPI({
			username: this.username,
			password: this.password,
			fbLSDToken: this.fbLsdToken,
		});
		const res = await client.login();
		console.log(res);
	}
}

export default ThreadsApiClient;
