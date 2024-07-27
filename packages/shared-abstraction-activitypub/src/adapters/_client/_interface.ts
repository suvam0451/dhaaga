import type { mastodon } from 'masto';
import type { UserDetailed } from 'misskey-js/autogen/models.js';
import type { Status, StatusArray } from '../status/_interface.js';
import { RouterInterface } from './_router/routes/_index.js';
import { InstanceRoute } from './_router/instance.js';

// megalodon types
import type { Status as MLStatus } from 'megalodon/lib/esm/src/entities/status.js';
import type { Reaction as MLReaction } from 'megalodon/lib/esm/src/entities/reaction.js';
import type { Notification as MLNotification } from 'megalodon/lib/esm/src/entities/notification.js';
import type { Tag as MLTag } from 'megalodon/lib/esm/src/entities/tag.js';
import type { FeaturedTag as MLFeaturedTag } from 'megalodon/lib/esm/src/entities/featured_tag.js';
import type { Account as MLAccount } from 'megalodon/lib/esm/src/entities/account.js';

/**
 * TS4053: Return type of public method
 * from exported class has or is using
 * name AccountCredentials from external module
 * but cannot be named.
 */
export type MastoStatus = mastodon.v1.Status;
export type MastoList = mastodon.v1.List;
export type MastoAccountCredentials = mastodon.v1.AccountCredentials;
export type MastoConversation = mastodon.v1.Conversation;
export type MastoContext = mastodon.v1.Context;
export type MastoRelationship = mastodon.v1.Relationship;
export type MastoTrendLink = mastodon.v1.TrendLink;
export type MastoTag = mastodon.v1.Tag;
export type MastoAccount = mastodon.v1.Account;
export type MastoFeaturedTag = mastodon.v1.FeaturedTag;
export type MastoFamiliarFollowers = mastodon.v1.FamiliarFollowers;
export type MastoNotification = mastodon.v1.Notification;

export type MegaStatus = MLStatus;
export type MegaReaction = MLReaction;
export type MegaNotification = MLNotification;
export type MegaTag = MLTag;
export type MegaFeaturedTag = MLFeaturedTag;
export type MegaAccount = MLAccount;

export type HashtagTimelineQuery = {
	limit: number;
	sinceId?: string;
	maxId?: string;
	minId?: string;
	any?: string[];
	all?: string[];
	none?: string[];
	onlyMedia?: boolean;
};

export type GetUserPostsQueryDTO = {
	limit: number;
	maxId?: string;
	excludeReplies: boolean;
};

export type GetPostsQueryDTO = {
	limit: number;
	sinceId?: string;
	minId?: string;
	maxId?: string;
};

export type GetTimelineQueryDTO = {
	limit: number;
	sinceId?: string;
	minId?: string;
	maxId?: string;
	remote?: boolean;
	local?: boolean;
	onlyMedia?: boolean;
};

export type GetTrendingPostsQueryDTO = {
	limit: number;
	offset?: number;
};

export type GetSearchResultQueryDTO = {
	type: 'accounts' | 'hashtags' | 'statuses' | null | undefined;
	following: boolean;
	limit: number;
	maxId?: string;
};

export type RestClientCreateDTO = {
	instance: string;
	token: string;
};

export type Tag = mastodon.v1.Tag | null | undefined;
export type TagArray = mastodon.v1.Tag[] | [];

export type TrendLinkArray = mastodon.v1.TrendLink[] | [];

export type MediaUploadDTO = {
	readonly file: Blob | string;
	readonly description?: string | null;
	readonly focus?: string | null;
	readonly thumbnail?: Blob | string | null;
	readonly skipPolling?: boolean;
};

export type FollowPostDto = {
	reblogs: boolean;
	notify: boolean;
	// (ISO 639-1 language two-letter code)
	languages?: string[];
};

/**
 * What common functionalities do we want to support
 * across all ActivityPub based clients
 */
interface ActivityPubClient extends RouterInterface {
	// routes
	instances: InstanceRoute;

	/**
	 * My
	 */
	getMyConversations(): Promise<mastodon.v1.Conversation[]>;

	getMyLists(): Promise<mastodon.v1.List[]>;

	// getMyFollowedTags(opts ): Promise<mastodon.v1.Tag[]>

	// a.k.a. - verifyCredentials
	getMe(): Promise<
		mastodon.v1.AccountCredentials | UserDetailed | null | undefined
	>;

	/** User */
	getUserProfile(username: string): Promise<mastodon.v1.Account | UserDetailed>;

	followUser(
		id: string,
		opts: FollowPostDto,
	): Promise<mastodon.v1.Relationship | any>;

	unfollowUser(id: string): Promise<mastodon.v1.Relationship | any>;

	getFavourites(opts: GetPostsQueryDTO): Promise<StatusArray>;

	getUserPosts(
		userId: string,
		opts: GetUserPostsQueryDTO,
	): Promise<StatusArray>;

	getBookmarks(opts: GetPostsQueryDTO): Promise<{
		data: StatusArray;
		minId?: string;
		maxId?: string;
	}>;

	getRelationshipWith(ids: string[]): Promise<mastodon.v1.Relationship[]>;

	getFollowing(id: string): Promise<mastodon.v1.Account[] | null>;

	getFollowers(id: string): Promise<mastodon.v1.Account[] | null>;

	uploadMedia(params: MediaUploadDTO): Promise<any>;

	/**
	 * Tags
	 */
	getFollowedTags(opts: GetPostsQueryDTO): Promise<
		| {
				data: mastodon.v1.Tag[];
				minId?: string;
				maxId?: string;
		  }
		| any[]
	>;

	muteUser(id: string): Promise<void>;

	/**
	 * Status
	 * */
	getStatus(id: string): Promise<Status>;

	getStatusContext(id: string): Promise<mastodon.v1.Context | any>;

	bookmark(id: string): Promise<Status>;

	unBookmark(id: string): Promise<Status>;

	favourite(id: string): Promise<Status>;

	unFavourite(id: string): Promise<Status>;

	reblog(id: string): Promise<Status | null>;

	undoReblog(id: string): Promise<Status | null>;

	search(
		q: string,
		dto: GetSearchResultQueryDTO,
	): Promise<{
		accounts: [];
		hashtags: [];
	}>;
}

export default ActivityPubClient;
