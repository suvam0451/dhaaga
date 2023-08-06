import {
	MastodonService,
	RestClient,
	RestServices,
	mastodon,
} from "@dhaaga/shared-provider-mastodon/dist";
import {
	Note,
	createClient,
	misskeyApi,
} from "@dhaaga/shared-provider-misskey/dist";
export {
	NoteToStatusAdapter,
	StatusToStatusAdapter,
	UnknownToStatusAdapter,
	NoteInstance,
} from "./adapters/status";
export { StatusInstance, StatusInterface } from "./interfaces/StatusInterface";

interface ActivityPubClient {
	getHomeTimeline(): Promise<mastodon.v1.Status[] | Note[]>;
}

type RestClientCreateDTO = {
	instance: string;
	token: string;
};

export class MisskeyRestClient implements ActivityPubClient {
	client: misskeyApi.APIClient;
	constructor(dto: RestClientCreateDTO) {
		this.client = createClient(dto.instance, dto.token);
	}

	async getHomeTimeline(): Promise<Note[]> {
		return await this.client.request("notes/local-timeline", { limit: 20 });
	}
}

export class MastodonRestClient implements ActivityPubClient {
	client: RestClient;
	constructor(dto: RestClientCreateDTO) {
		this.client = new RestClient(dto.instance, dto.token);
	}
	async getHomeTimeline(): Promise<mastodon.v1.Status[]> {
		return await RestServices.v1.default.timelines.default.getHomeTimeline(
			this.client
		);
	}
}

// null object pattern
// https://en.wikipedia.org/wiki/Null_object_pattern
export class UnknownRestClient implements ActivityPubClient {
	// private client: ActivityPubClient;

	async getHomeTimeline() {
		console.log("");
		return [];
		// throw new Error("Method not implemented.");
	}
}

const userMap = {
	mastodon: MastodonRestClient,
	misskey: MisskeyRestClient,
};

type UserMap = typeof userMap;
type Keys = keyof UserMap;
type Tuples<T> = T extends Keys ? [T, InstanceType<UserMap[T]>] : never;
type SingleKeys<K> = [K] extends (K extends Keys ? [K] : never) ? K : never;
type ClassType<A extends Keys> = Extract<Tuples<Keys>, [A, any]>[1];

export class ActivityPubClientFactory {
	static get<K extends Keys>(
		domain: SingleKeys<K>,
		payload: RestClientCreateDTO
	): ClassType<K> {
		return new userMap[domain](payload);
	}
}
