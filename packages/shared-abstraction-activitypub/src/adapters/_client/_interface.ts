import type { mastodon } from 'masto';
import type {
	UserDetailed,
	Note,
	User,
	UserDetailedNotMe,
} from 'misskey-js/autogen/models.js';
import type { Status } from '../status/_interface.js';
import { RouterInterface } from './_router/routes/_index.js';
import { InstanceRoute } from './_router/routes/instance.js';

// megalodon types
import type { Status as MLStatus } from 'megalodon/lib/esm/src/entities/status.js';
import type { Reaction as MLReaction } from 'megalodon/lib/esm/src/entities/reaction.js';
import type { Notification as MLNotification } from 'megalodon/lib/esm/src/entities/notification.js';
import type { Tag as MLTag } from 'megalodon/lib/esm/src/entities/tag.js';
import type { FeaturedTag as MLFeaturedTag } from 'megalodon/lib/esm/src/entities/featured_tag.js';
import type { Account as MLAccount } from 'megalodon/lib/esm/src/entities/account.js';
import type { List as MLList } from 'megalodon/lib/esm/src/entities/list.js';
import type { Relationship as MLRelationship } from 'megalodon/lib/esm/src/entities/relationship.js';
import type { Conversation as MLConversation } from 'megalodon/lib/esm/src/entities/conversation.js';

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
export type MastoGroupedNotificationsResults =
	mastodon.v1.GroupedNotificationsResults;
export type MastoScheduledStatus = mastodon.v1.ScheduledStatus;
export type MastoMediaAttachment = mastodon.v1.MediaAttachment;

export type MegaStatus = MLStatus;
export type MegaReaction = MLReaction;
export type MegaConversation = MLConversation;
export type MegaNotification = MLNotification;
export type MegaTag = MLTag;
export type MegaFeaturedTag = MLFeaturedTag;
export type MegaAccount = MLAccount;
export type MegaList = MLList;
export type MegaRelationship = MLRelationship;

export type MissUserDetailed = UserDetailed;
export type MissNote = Note;
export type MissUser = User;
export type MissUserDetailedNotMe = UserDetailedNotMe;
export type MissContext = {
	ancestors: any[];
	descendants: any[];
};

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

export type GetTrendingDTO = {
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
	// misskey, default false
	withReplies?: boolean;
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

	// a.k.a. - verifyCredentials
	getMe(): Promise<
		mastodon.v1.AccountCredentials | UserDetailed | null | undefined
	>;

	getRelationshipWith(ids: string[]): Promise<mastodon.v1.Relationship[]>;

	getFollowing(id: string): Promise<mastodon.v1.Account[] | null>;

	getFollowers(id: string): Promise<mastodon.v1.Account[] | null>;

	uploadMedia(params: MediaUploadDTO): Promise<any>;

	/**
	 * Status
	 * */
	favourite(id: string): Promise<Status>;

	unFavourite(id: string): Promise<Status>;
}

export default ActivityPubClient;
