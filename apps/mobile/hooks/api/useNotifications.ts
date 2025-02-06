import {
	DhaagaJsNotificationType,
	KNOWN_SOFTWARE,
	MastodonRestClient,
	MisskeyRestClient,
} from '@dhaaga/bridge';
import { useEffect, useState } from 'react';
import { AppNotificationObject } from '../../types/app-notification.types';
import { NotificationMiddleware } from '../../services/middlewares/notification.middleware';
import { useQuery } from '@tanstack/react-query';
import {
	useAppAcct,
	useAppApiClient,
	useAppDb,
} from '../utility/global-state-extractors';
import ActivityPubService from '../../services/activitypub.service';
import {
	AppBskyNotificationListNotifications,
	ChatBskyConvoListConvos,
} from '@atproto/api';
import ChatService, { AppChatRoom } from '../../services/chat.service';
import { AppResultPageType, pageResultDefault } from '../../types/app.types';
import { MisskeyService } from '../../services/misskey.service';
import { MastoApiV2Service } from '../../services/masto-api.service';

const NOTIFICATION_PAGE_SIZE = 20;

type useApiGetNotificationsProps = {
	include: DhaagaJsNotificationType[];
};

type NotificationResults = AppResultPageType<AppNotificationObject>;

/**
 * API Query for the notifications endpoint
 */
function useApiGetNotifications({ include }: useApiGetNotificationsProps) {
	const { acct } = useAppAcct();
	const { client, driver } = useAppApiClient();

	async function api(): Promise<NotificationResults> {
		if (!client) throw new Error('no client found');
		if (driver === KNOWN_SOFTWARE.FIREFISH) {
			/**
			 * Firefish does not support grouped-notifications
			 * Maybe Iceshrimp too?
			 * */
			const { data, error } = await (
				client as MisskeyRestClient
			).notifications.getUngrouped({
				limit: NOTIFICATION_PAGE_SIZE,
			});

			if (error) throw new Error(error.message);
			return {
				success: true,
				items: NotificationMiddleware.deserialize<unknown[]>( // ignore certain notification types
					data.data.filter((o) => ['login'].includes(o.type)),
					driver,
					acct?.server,
				),
				maxId: data.maxId,
				minId: data.minId,
			};
		} else {
			const { data, error } = await client.notifications.get({
				limit: NOTIFICATION_PAGE_SIZE,
			});

			if (error) throw new Error(error.message);
			return {
				success: true,
				items: NotificationMiddleware.deserialize<unknown[]>( // ignore certain notification types
					data.data,
					driver,
					acct?.server,
				),
				maxId: data.maxId,
				minId: data.minId,
			};
		}
	}

	// Queries
	return useQuery<NotificationResults>({
		queryKey: ['notifications', driver, acct?.server, include],
		queryFn: api,
		enabled: client !== null,
		initialData: pageResultDefault,
	});
}

/**
 * Get Mentions
 *
 * - Grouped for Mastodon
 */
function useApiGetMentionUpdates(maxId?: string | null) {
	const { acct } = useAppAcct();
	const { driver, client, server } = useAppApiClient();

	async function api(): Promise<NotificationResults> {
		const results = await client.notifications.getMentions({
			limit: NOTIFICATION_PAGE_SIZE,
			maxId,
		});
		if (results.error) throw new Error(results.error.message);

		if (ActivityPubService.misskeyLike(driver)) {
			return MisskeyService.packNotifs(results.data, driver, server);
		} else if (driver === KNOWN_SOFTWARE.MASTODON) {
			return MastoApiV2Service.packNotifs(results.data, driver, server);
		} else if (ActivityPubService.blueskyLike(driver)) {
			const _data =
				results.data as AppBskyNotificationListNotifications.OutputSchema;
		} else {
			return pageResultDefault;
		}
	}

	// Queries
	return useQuery<NotificationResults>({
		queryKey: ['notifications/mentions', acct, maxId],
		queryFn: api,
		enabled: client !== null,
		initialData: pageResultDefault,
	});
}

/**
 * Fetches direct message data
 */
function useApiGetChatUpdates() {
	const [Results, setResults] = useState<AppNotificationObject[]>([]);
	const { acct } = useAppAcct();
	const { driver, client, server } = useAppApiClient();
	const { db } = useAppDb();

	useEffect(() => {
		setResults([]);
	}, [acct]);

	async function api(): Promise<AppChatRoom[]> {
		const result = await client.notifications.getChats(driver);
		if (result.error) throw new Error(result.error.message);

		switch (driver) {
			case KNOWN_SOFTWARE.BLUESKY: {
				const _data: ChatBskyConvoListConvos.OutputSchema = result.data;
				return ChatService.resolveAtProtoChat(db, _data, acct, driver, server);
			}
			case KNOWN_SOFTWARE.MASTODON:
			case KNOWN_SOFTWARE.MISSKEY:
			case KNOWN_SOFTWARE.SHARKEY: {
				if (result.error) {
					throw new Error(result.error.message);
				} else {
					return result.data;
				}
			}
		}
		return null;
	}

	// Queries
	return useQuery<AppChatRoom[]>({
		queryKey: ['chat', acct],
		queryFn: api,
		enabled: client !== null,
	});
}

/**
 * Get all social updates
 * (likes/shares/reactions/follows)
 * for the active account
 * @param maxId
 */
function useApiGetSocialUpdates(maxId?: string | null) {
	const { acct } = useAppAcct();
	const { driver, client, server } = useAppApiClient();

	// Queries
	return useQuery<NotificationResults>({
		queryKey: ['notifications/social', acct, maxId],
		queryFn: async () => {
			const result = await client.notifications.getSocialUpdates({
				limit: NOTIFICATION_PAGE_SIZE,
				maxId,
			});
			if (result.error) throw new Error(result.error.message);

			if (ActivityPubService.misskeyLike(driver)) {
				return MisskeyService.packNotifs(result.data, driver, server);
			} else if (ActivityPubService.supportsV2(driver)) {
				return MastoApiV2Service.packNotifs(result.data, driver, server);
			} else {
				return pageResultDefault;
			}
		},
		enabled: !!client,
		initialData: pageResultDefault,
	});
}

/**
 * Get all subscriptions for
 * the active account
 * @param maxId
 */
function useApiGetSubscriptionUpdates(maxId?: string | null) {
	const { acct } = useAppAcct();
	const { driver, client, server } = useAppApiClient();

	return useQuery<NotificationResults>({
		queryKey: ['notifications/subs', acct, maxId],
		queryFn: async () => {
			if (ActivityPubService.misskeyLike(driver)) {
				const result = await (
					client as MisskeyRestClient
				).notifications.getSubscriptions({
					limit: NOTIFICATION_PAGE_SIZE,
					maxId,
				});

				return MisskeyService.packNotifs(result.data, driver, server);
			} else if (ActivityPubService.supportsV2(driver)) {
				const result = await (
					client as MastodonRestClient
				).notifications.getSubscriptionUpdates({
					limit: NOTIFICATION_PAGE_SIZE,
					maxId,
				});
				return MastoApiV2Service.packNotifs(result.data, driver, server);
			} else {
				return pageResultDefault;
			}
		},
		enabled: !!client,
		initialData: pageResultDefault,
	});
}

export {
	useApiGetMentionUpdates,
	useApiGetSocialUpdates,
	useApiGetChatUpdates,
	useApiGetSubscriptionUpdates,
};
