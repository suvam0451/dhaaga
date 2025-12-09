import {
	ActivityPubService,
	ApiTargetInterface,
	KNOWN_SOFTWARE,
	GroupedNotificationParser,
	MisskeyApiAdapter,
	MastoApiAdapter,
	PleromaApiAdapter,
} from '@dhaaga/bridge';
import type { NotificationObjectType, ResultPage } from '@dhaaga/bridge';
import { queryOptions } from '@tanstack/react-query';

const NOTIFICATION_PAGE_SIZE = 20;

type NotificationPage = ResultPage<NotificationObjectType[]>;

/**
 * Get Mentions
 *
 * - Grouped for Mastodon
 */
function getMentionNotificationsQueryOpts(
	client: ApiTargetInterface,
	driver: KNOWN_SOFTWARE,
	server: string,
	acctIdentifier: string,
	maxId?: string,
) {
	async function api(): Promise<NotificationPage> {
		const results = await client.notifications.getMentions({
			limit: NOTIFICATION_PAGE_SIZE,
			maxId,
		});

		if (ActivityPubService.misskeyLike(driver)) {
			return GroupedNotificationParser.parseForMisskey(
				results.data,
				driver,
				server,
			);
		} else if (ActivityPubService.supportsV2(driver)) {
			return GroupedNotificationParser.parseForMastodonV2(
				results,
				driver,
				server,
			);
		} else if (ActivityPubService.pleromaLike(driver)) {
			return GroupedNotificationParser.parseForMastodonV1(
				results.data,
				driver,
				server,
				'mentions',
			);
		} else if (ActivityPubService.blueskyLike(driver)) {
			return GroupedNotificationParser.parseForBluesky(
				results,
				client,
				driver,
				server,
			);
		} else {
			throw new Error('unsupported driver');
		}
	}

	return queryOptions<NotificationPage>({
		queryKey: ['dhaaga/inbox/mentions', acctIdentifier, maxId],
		queryFn: api,
		enabled: client !== null,
	});
}

/**
 * Fetches direct message data
 */
function getChatNotificationsQueryOpts(
	client: ApiTargetInterface,
	driver: KNOWN_SOFTWARE,
	server: string,
	acctIdentifier: string,
) {
	async function api(): Promise<any[]> {
		const result = await client.notifications.getChats(driver);
		if (result.error) throw new Error(result.error.message);

		// const _data: ChatBskyConvoListConvos.OutputSchema = result.data;
		// return ChatService.resolveAtProtoChat(db, _data, acct, driver, server);

		throw new Error('not implemented');
	}

	// Queries
	return queryOptions<any[]>({
		queryKey: ['dhaaga/inbox/chat', acctIdentifier],
		queryFn: api,
		enabled: client !== null,
	});
}

/**
 * Get all social updates
 * (likes/shares/reactions/follows)
 * for the active account
 * @param client
 * @param driver
 * @param server
 * @param acctIdentifier
 * @param maxId
 */
function getSocialNotificationsQueryOpts(
	client: ApiTargetInterface,
	driver: KNOWN_SOFTWARE,
	server: string,
	acctIdentifier: string,
	maxId?: string,
) {
	async function api() {
		const result = await client.notifications.getSocialUpdates({
			limit: NOTIFICATION_PAGE_SIZE,
			maxId,
		});

		if (ActivityPubService.misskeyLike(driver)) {
			return GroupedNotificationParser.parseForMisskey(result, driver, server);
		} else if (ActivityPubService.supportsV2(driver)) {
			return GroupedNotificationParser.parseForMastodonV2(
				result,
				driver,
				server,
			);
		} else if (ActivityPubService.pleromaLike(driver)) {
			return GroupedNotificationParser.parseForMastodonV1(
				result,
				driver,
				server,
				'social',
			);
		} else {
			throw new Error('unsupported driver');
		}
	}

	return queryOptions<NotificationPage>({
		queryKey: ['dhaaga/inbox/social', acctIdentifier, maxId],
		queryFn: api,
		enabled: !!client,
	});
}

/**
 * Get all subscriptions for
 * the active account
 * @param client
 * @param driver
 * @param server
 * @param acctIdentifier
 * @param maxId
 */
function getSubscriptionNotificationsQueryOpts(
	client: ApiTargetInterface,
	driver: KNOWN_SOFTWARE,
	server: string,
	acctIdentifier: string,
	maxId?: string,
) {
	async function api() {
		if (ActivityPubService.misskeyLike(driver)) {
			const result = await (
				client as MisskeyApiAdapter
			).notifications.getSubscriptions({
				limit: NOTIFICATION_PAGE_SIZE,
				maxId,
			});

			return GroupedNotificationParser.parseForMisskey(result, driver, server);
		} else if (ActivityPubService.supportsV2(driver)) {
			const result = await (
				client as MastoApiAdapter
			).notifications.getSubscriptionUpdates({
				limit: NOTIFICATION_PAGE_SIZE,
				maxId,
			});
			return GroupedNotificationParser.parseForMastodonV2(
				result,
				driver,
				server,
			);
		} else if (ActivityPubService.pleromaLike(driver)) {
			const result = await (
				client as PleromaApiAdapter
			).notifications.getSubscriptionUpdates({
				limit: NOTIFICATION_PAGE_SIZE,
				maxId,
			});
			return GroupedNotificationParser.parseForMastodonV1(
				result,
				driver,
				server,
				'updates',
			);
		} else {
			throw new Error('unsupported driver');
		}
	}
	return queryOptions<NotificationPage>({
		queryKey: ['dhaaga/inbox/updates', acctIdentifier, maxId],
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
