import {
	ActivityPubService,
	type ApiTargetInterface,
	GroupedNotificationParser,
	ChatParser,
	DriverService,
} from '@dhaaga/bridge';
import type { NotificationObjectType, ResultPage } from '@dhaaga/bridge';
import { queryOptions } from '@tanstack/react-query';
import type { ChatRoomObjectType } from '@dhaaga/bridge';

const NOTIFICATION_PAGE_SIZE = 20;

type NotificationPage = ResultPage<NotificationObjectType[]>;

/**
 * Get Mentions
 *
 * - Grouped for Mastodon
 */
function getMentionNotificationsQueryOpts(
	client: ApiTargetInterface,
	maxId?: string,
) {
	async function api(): Promise<NotificationPage> {
		const results = await client.notifications.getMentions({
			limit: NOTIFICATION_PAGE_SIZE,
			maxId,
		});

		if (ActivityPubService.misskeyLike(client.driver)) {
			return GroupedNotificationParser.parseForMisskey(
				results.data,
				client.driver,
				client.server!,
			);
		} else if (ActivityPubService.supportsV2(client.driver)) {
			return GroupedNotificationParser.parseForMastodonV2(
				results,
				client.driver,
				client.server!,
			);
		} else if (ActivityPubService.pleromaLike(client.driver)) {
			return GroupedNotificationParser.parseForMastodonV1(
				results.data,
				client.driver,
				client.server!,
				'mentions',
			);
		} else if (ActivityPubService.blueskyLike(client.driver)) {
			return GroupedNotificationParser.parseForBluesky(
				results,
				client,
				client.driver,
				client.server!,
			);
		} else {
			throw new Error('unsupported driver');
		}
	}

	return queryOptions<NotificationPage>({
		queryKey: ['dhaaga/inbox/mentions', client?.key, maxId],
		queryFn: api,
		enabled: client !== null,
	});
}

/**
 * Fetches direct message data
 */
function getChatNotificationsQueryOpts(client: ApiTargetInterface) {
	async function api(): Promise<ResultPage<ChatRoomObjectType[]>> {
		const result = await client.notifications.getChats(client.driver!);

		return {
			...result,
			data: ChatParser.parse<unknown[]>(result.data, client),
		};
	}

	// Queries
	return queryOptions<ResultPage<ChatRoomObjectType[]>>({
		queryKey: ['dhaaga/inbox/chat', client?.key],
		queryFn: api,
		enabled: !!client,
	});
}

/**
 * Get all social updates
 * (likes/shares/reactions/follows)
 * for the active account
 * @param client
 * @param maxId
 */
function getSocialNotificationsQueryOpts(
	client: ApiTargetInterface,
	maxId?: string,
) {
	async function api(): Promise<NotificationPage> {
		const result = await client.notifications.getSocialUpdates({
			limit: NOTIFICATION_PAGE_SIZE,
			maxId,
		});

		if (ActivityPubService.misskeyLike(client.driver)) {
			return GroupedNotificationParser.parseForMisskey(
				result,
				client.driver,
				client.server!,
			);
		} else if (ActivityPubService.supportsV2(client.driver)) {
			return GroupedNotificationParser.parseForMastodonV2(
				result,
				client.driver,
				client.server!,
			);
		} else if (ActivityPubService.pleromaLike(client.driver)) {
			return GroupedNotificationParser.parseForMastodonV1(
				result,
				client.driver,
				client.server!,
				'social',
			);
		} else {
			throw new Error('unsupported driver');
		}
	}

	return queryOptions<NotificationPage>({
		queryKey: ['dhaaga/inbox/social', client?.key, maxId],
		queryFn: api,
		enabled: !!client,
	});
}

/**
 * Get all subscriptions for
 * the active account
 * @param client
 * @param maxId
 */
function getSubscriptionNotificationsQueryOpts(
	client: ApiTargetInterface,
	maxId?: string,
) {
	async function api(): Promise<ResultPage<NotificationObjectType[]>> {
		const result = await client.notifications.getSubscriptions(maxId);

		if (DriverService.supportsMisskeyApi(client.driver)) {
			return GroupedNotificationParser.parseForMisskey(
				result,
				client.driver,
				client.server!,
			);
		} else if (DriverService.supportsMastoApiV2(client.driver)) {
			return GroupedNotificationParser.parseForMastodonV2(
				result,
				client.driver,
				client.server!,
			);
		} else if (DriverService.supportsPleromaApi(client.driver)) {
			return GroupedNotificationParser.parseForMastodonV1(
				result,
				client.driver,
				client.server!,
				'updates',
			);
		} else if (DriverService.supportsAtProto(client.driver)) {
			return GroupedNotificationParser.parseForBluesky(
				result,
				client,
				client.driver,
				client.server!,
			);
		} else {
			throw new Error(`unsupported driver ${client.driver}`);
		}
	}
	return queryOptions<NotificationPage>({
		queryKey: ['dhaaga/inbox/updates', client?.key, maxId],
		queryFn: api,
		enabled: !!client,
	});
}

export {
	getMentionNotificationsQueryOpts,
	getChatNotificationsQueryOpts,
	getSocialNotificationsQueryOpts,
	getSubscriptionNotificationsQueryOpts,
};
