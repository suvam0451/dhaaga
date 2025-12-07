import {
	DriverNotificationType,
	KNOWN_SOFTWARE,
	MastoApiAdapter,
	MisskeyApiAdapter,
	PleromaApiAdapter,
	ActivityPubService,
} from '@dhaaga/bridge';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	useAppAcct,
	useAppApiClient,
	useAppDb,
} from '../utility/global-state-extractors';
import {
	AppBskyNotificationListNotifications,
	ChatBskyConvoListConvos,
} from '@atproto/api';
import ChatService, { AppChatRoom } from '../../services/chat.service';
import { AppResultPageType, pageResultDefault } from '../../types/app.types';
import { MisskeyService } from '../../services/misskey.service';
import {
	MastoApiV1Service,
	MastoApiV2Service,
} from '../../services/masto-api.service';
import type { NotificationObjectType } from '@dhaaga/bridge/typings';

const NOTIFICATION_PAGE_SIZE = 20;

type useApiGetNotificationsProps = {
	include: DriverNotificationType[];
};

type NotificationResults = AppResultPageType<NotificationObjectType>;

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
		} else if (ActivityPubService.supportsV2(driver)) {
			return MastoApiV2Service.packNotifs(results.data, driver, server);
		} else if (ActivityPubService.pleromaLike(driver)) {
			return MastoApiV1Service.packNotifs(
				results.data,
				driver,
				server,
				'mentions',
			);
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
	const [Results, setResults] = useState<NotificationObjectType[]>([]);
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
			} else if (ActivityPubService.pleromaLike(driver)) {
				return MastoApiV1Service.packNotifs(
					result.data,
					driver,
					server,
					'social',
				);
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
					client as MisskeyApiAdapter
				).notifications.getSubscriptions({
					limit: NOTIFICATION_PAGE_SIZE,
					maxId,
				});

				return MisskeyService.packNotifs(result.data, driver, server);
			} else if (ActivityPubService.supportsV2(driver)) {
				const result = await (
					client as MastoApiAdapter
				).notifications.getSubscriptionUpdates({
					limit: NOTIFICATION_PAGE_SIZE,
					maxId,
				});
				return MastoApiV2Service.packNotifs(result.data, driver, server);
			} else if (ActivityPubService.pleromaLike(driver)) {
				const result = await (
					client as PleromaApiAdapter
				).notifications.getSubscriptionUpdates({
					limit: NOTIFICATION_PAGE_SIZE,
					maxId,
				});
				return MastoApiV1Service.packNotifs(
					result.data,
					driver,
					server,
					'updates',
				);
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
