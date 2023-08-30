import {
	RestClient,
	RestServices,
	mastodon,
} from "@dhaaga/shared-provider-mastodon/src";
import {
	Note,
	UserDetailed,
	createClient,
	misskeyApi,
} from "@dhaaga/shared-provider-misskey/src";
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

// export user profile adapters and interfaces
export { UserDetailedToUserProfileAdapter } from "./adapters/profile/adapter";
export {
	UserDetailedInstance,
	AccountInstance,
} from "./adapters/profile/unique";
export { UserProfileInterface } from "./adapters/profile/interface";

// stub types
export {
	ActivityPubStatus,
	ActivityPubStatuses,
	ActivityPubAccount,
} from "./types/activitypub";

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
	getUserProfile(username: string): Promise<mastodon.v1.Account | UserDetailed>;
	getUserPosts(username: string): Promise<mastodon.v1.Status[] | Note[]>;
}

type RestClientCreateDTO = {
	instance: string;
	token: string;
};

export class MisskeyRestClient implements ActivityPubClient {
	// official, typed client from misskey.js
	client: misskeyApi.APIClient;
	// general axios client for untyped endpoints
	axiosClient: AxiosInstance;
	constructor(dto: RestClientCreateDTO) {
		this.client = createClient(dto.instance, dto.token);
		this.axiosClient = axios.create({
			baseURL: `${dto.instance}/api`,
		});
	}
	getUserPosts(userId: string) {
		return this.client.request("users/notes", {
			userId: userId,
			limit: 10,
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

	getUserProfile(
		username: string
	): Promise<mastodon.v1.Account | UserDetailed> {
		return this.client.request("users/show", { username });
	}
}

export class MastodonRestClient implements ActivityPubClient {
	client: RestClient;
	constructor(dto: RestClientCreateDTO) {
		this.client = new RestClient(dto.instance, dto.token);
	}
	getUserPosts(username: string): Promise<Note[] | mastodon.v1.Status[]> {
		throw new Error("Method not implemented.");
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

	getUserProfile(username: string): Promise<mastodon.v1.Account> {
		throw new Error("Method not implemented.");
	}
}

// null object pattern
// https://en.wikipedia.org/wiki/Null_object_pattern
export class UnknownRestClient implements ActivityPubClient {
	getUserPosts(username: string): Promise<Note[] | mastodon.v1.Status[]> {
		throw new Error("Method not implemented.");
	}
	async getHomeTimeline() {
		console.log("");
		return [];
	}

	async getTimelineByHashtag(q: string) {
		return [];
	}

	getUserProfile(username: string): Promise<mastodon.v1.Account> {
		throw new Error("Method not implemented.");
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
