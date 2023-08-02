import RestServices from "./native"

export class RestClient {
	/**
	 *
	 */
	url: string;
	accessToken: string;
	constructor(url: string, accessToken?: string) {
		this.url = url;
		this.accessToken = accessToken;
	}
}
