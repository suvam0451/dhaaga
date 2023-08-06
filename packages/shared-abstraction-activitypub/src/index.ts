import {
	RestClient,
	RestServices,
	mastodon,
} from "@dhaaga/shared-provider-mastodon/dist";
import {
	Note,
	createClient,
	misskeyApi,
} from "@dhaaga/shared-provider-misskey/dist";
import axios, { AxiosInstance } from "axios";

// export status adapters and interfaces
export {
	NoteToStatusAdapter,
	StatusToStatusAdapter,
	UnknownToStatusAdapter,
} from "./adapters/status/adapter";
export { NoteInstance, StatusInstance } from "./adapters/status/unique";
export { StatusInterface } from "./adapters/status/interface";

// export media atatchment adapters and interfaces
export {
	DriveFileToMediaAttachmentAdapter,
	MediaAttachmentToMediaAttachmentAdapter,
	UnknownToMediaAttachmentAdapter,
} from "./adapters/media-attachment/adapter";
export {
	DriveFileInstance,
	MediaAttachmentInstance,
} from "./adapters/media-attachment/unique";
export { MediaAttachmentInterface } from "./adapters/media-attachment/interface";

// stub types
export { ActivityPubStatus, ActivityPubStatuses } from "./types/activitypub";

type TimelineQuery = {
	maxId?: string;
	minId?: string;
};

interface ActivityPubClient {
	getHomeTimeline(): Promise<mastodon.v1.Status[] | Note[]>;
	getTimelineByHashtag(
		q: string,
		query?: TimelineQuery
	): Promise<mastodon.v1.Status[] | Note[]>;
}

type RestClientCreateDTO = {
	instance: string;
	token: string;
};

export class MisskeyRestClient implements ActivityPubClient {
	client: misskeyApi.APIClient;
	axiosClient: AxiosInstance;
	constructor(dto: RestClientCreateDTO) {
		this.client = createClient(dto.instance, dto.token);
		this.axiosClient = axios.create({
			baseURL: `${dto.instance}/api`,
		});
	}

	async getHomeTimeline(): Promise<Note[]> {
		return await this.client.request("notes/local-timeline", { limit: 20 });
	}
	async getTimelineByHashtag(q: string): Promise<Note[]> {
		const res = await this.axiosClient.post<Note[]>("/notes/search-by-tag", {
			limit: 20,
			tag: q,
		});
		return res.data;
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
	async getTimelineByHashtag(q: string): Promise<mastodon.v1.Status[]> {
		return RestServices.v1.default.timelines.default.getTimelineByHashtag(
			this.client,
			q
		);
	}
}

// null object pattern
// https://en.wikipedia.org/wiki/Null_object_pattern
export class UnknownRestClient implements ActivityPubClient {
	async getHomeTimeline() {
		console.log("");
		return [];
	}

	async getTimelineByHashtag(q: string) {
		return [];
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
