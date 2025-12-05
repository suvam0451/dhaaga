import type {
	AppBskyNotificationListNotifications,
	ChatBskyConvoDefs,
	Facet,
} from '@atproto/api';
import type {
	MastoGroupedNotificationsResults,
	MastoNotification,
} from '#/types/mastojs.types.js';
import type { MegaNotification } from '#/types/megalodon.types.js';
import type { DriverNotificationType, KNOWN_SOFTWARE } from '#/data/driver.js';
import { PaginatedPromise } from './_types.js';
import { Endpoints } from 'misskey-js';

export type NotificationGetQueryDto = {
	limit: number;
	minId?: string;
	maxId?: string; // doubles as untilId for misskey
	accountId?: string; // restrict to notifications received from this account
	types?: DriverNotificationType[];
	excludeTypes?: DriverNotificationType[];
	markAsRead?: boolean; // misskey
	excludeType?: string[];
	includeType?: string[];
};

export type Pleroma_Notification_Type = '';

export interface NotificationsRoute {
	/**
	 * Query against all categories of notifications
	 * for the given user.
	 *
	 * NOTE: filters may or may not be supported. Dhaaga
	 * apps use dedicated functions for each category, which
	 * correctly apply the filters
	 * @param query
	 */
	getAllNotifications(
		query: NotificationGetQueryDto,
	): PaginatedPromise<
		| MastoNotification[]
		| MegaNotification[]
		| MastoGroupedNotificationsResults
		| AppBskyNotificationListNotifications.Notification[]
		| Endpoints['i/notifications-grouped']['res']
	>;

	getMentions(
		query: NotificationGetQueryDto,
	): PaginatedPromise<
		AppBskyNotificationListNotifications.Notification[] | any
	>;

	getChats(driver: KNOWN_SOFTWARE): PaginatedPromise<any>;

	getSocialUpdates(
		query: NotificationGetQueryDto,
	): PaginatedPromise<
		AppBskyNotificationListNotifications.Notification[] | any
	>;

	getChat(roomId: string): PaginatedPromise<any>;

	/**
	 * Get chat messages for a conversation
	 * @param roomId
	 */
	getChatMessages(roomId: string): PaginatedPromise<any>;

	/**
	 * Supporting text-only replies for now
	 * @param convoId
	 * @param content
	 */
	sendMessage(
		convoId: string,
		content: { text?: string; facets?: Facet[] },
	): Promise<ChatBskyConvoDefs.MessageView | void>;

	// e,g. of how to get new notifs
	// https://blob.cat/api/v1/notifications?since_id=2455610&with_muted=true&limit=20
}
