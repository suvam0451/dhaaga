import {
	DhaagaJsNotificationType,
	KNOWN_SOFTWARE,
	MisskeyRestClient,
} from '@dhaaga/bridge';
import { useEffect, useState } from 'react';
import { AppNotificationObject } from '../../types/app-notification.types';
import { NotificationMiddleware } from '../../services/middlewares/notification.middleware';
import { useQuery } from '@tanstack/react-query';
import { PostMiddleware } from '../../services/middlewares/post.middleware';
import {
	useAppAcct,
	useAppApiClient,
	useAppDb,
} from '../utility/global-state-extractors';
import { UserMiddleware } from '../../services/middlewares/user.middleware';
import ActivityPubService from '../../services/activitypub.service';
import {
	AppBskyNotificationListNotifications,
	ChatBskyConvoListConvos,
} from '@atproto/api';
import ChatService, { AppChatRoom } from '../../services/chat.service';
import { AppResultPageType, pageResultDefault } from '../../types/app.types';
import { MisskeyService } from '../../services/misskey.service';

type useApiGetNotificationsProps = {
	include: DhaagaJsNotificationType[];
};

type NotificationResults = AppResultPageType<AppNotificationObject>;

type MastoGroupedNotificationType = {
	groupKey: string;
	notificationsCount: 1;
	type: 'mention';
	mostRecentNotificationId: number;
	pageMinId: string;
	pageMaxId: string;
	latestPageNotificationAt: Date;
	sampleAccountIds: string[];
	statusId: string;
};

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
				limit: 40,
				excludeTypes: [],
				types: include,
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
				limit: 40,
				excludeTypes: [],
				types: include,
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
function useApiGetMentionUpdates() {
	const { acct } = useAppAcct();
	const { driver, client, server } = useAppApiClient();

	async function api(): Promise<NotificationResults> {
		const results = await client.notifications.getMentions(driver);
		if (results.error) throw new Error(results.error.message);

		const _data = results.data;
		if (ActivityPubService.misskeyLike(driver))
			return MisskeyService.deserializeNotifications(
				results.data,
				driver,
				server,
			);
		if (ActivityPubService.blueskyLike(driver)) {
			const _data =
				results.data as AppBskyNotificationListNotifications.OutputSchema;
		}

		const acctList = _data.data.accounts;
		const postList = _data.data.statuses;
		const _retval = _data.data.notificationGroups
			.map((o: MastoGroupedNotificationType) => {
				const _acct = UserMiddleware.deserialize<unknown>(
					acctList.find((x) => x.id === o.sampleAccountIds[0]),
					driver,
					server,
				);
				const _post = PostMiddleware.deserialize<unknown>(
					postList.find((x) => x.id === o.statusId),
					driver,
					server,
				);

				// bring this back when chat is implemented
				// if (o.type === 'mention' && _post.visibility === 'direct')
				// 	return null;
				const _obj: AppNotificationObject = {
					id: o.groupKey,
					type: o.type,
					post: _post,
					user: _acct,
					read: false,
					createdAt: new Date(o.mostRecentNotificationId),
					extraData: {},
				};
				return _obj;
			})
			.filter((o) => !!o);

		return {
			success: true,
			items: _retval,
			maxId: _data.maxId,
			minId: _data.minId,
		};
	}

	// Queries
	return useQuery<NotificationResults>({
		queryKey: ['notifications/mentions', acct],
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
		console.log('[WARN]: driver does not implement chat module');
		return null;
	}

	// Queries
	return useQuery<AppChatRoom[]>({
		queryKey: ['chat', acct],
		queryFn: api,
		enabled: client !== null,
	});
}

function useApiGetSocialUpdates(maxId?: string | null) {
	const { acct } = useAppAcct();
	const { driver, client, server } = useAppApiClient();

	async function api(): Promise<NotificationResults> {
		const results = await client.notifications.getSocialUpdates({
			limit: 4,
			excludeTypes: [],
			types: [],
			maxId,
		});
		if (results.error) throw new Error(results.error.message);

		if (ActivityPubService.misskeyLike(driver))
			return MisskeyService.deserializeNotifications(
				results.data,
				driver,
				server,
			);

		const _data = results.data;
		const acctList = _data.data.accounts;
		const postList = _data.data.statuses;
		const _retval = _data.data.notificationGroups
			.map((o: MastoGroupedNotificationType) => {
				const _acct = UserMiddleware.deserialize<unknown>(
					acctList.find((x) => x.id === o.sampleAccountIds[0]),
					driver,
					server,
				);
				const _post = PostMiddleware.deserialize<unknown>(
					postList.find((x) => x.id === o.statusId),
					driver,
					server,
				);

				// bring this back when chat is implemented
				// if (o.type === 'mention' && _post.visibility === 'direct')
				// 	return null;
				const _obj: AppNotificationObject = {
					id: o.groupKey,
					type: o.type,
					post: _post,
					user: _acct,
					read: false,
					createdAt: new Date(o.mostRecentNotificationId),
					extraData: {},
				};
				return _obj;
			})
			.filter((o) => !!o)
			.filter((o) => !['mention'].includes(o.type));

		return {
			success: true,
			items: _retval,
			maxId: _data.maxId,
			minId: _data.minId,
		};
	}

	// Queries
	return useQuery<NotificationResults>({
		queryKey: ['notifications/social', acct, maxId],
		queryFn: api,
		enabled: !!client,
		initialData: pageResultDefault,
	});
}

function useApiGetSubscriptionUpdates() {
	const { acct } = useAppAcct();
	const { driver, client, server } = useAppApiClient();

	// const { data } = useApiGetNotifications({
	// 	include: [
	// 		// Mastodon
	// 		DhaagaJsNotificationType.STATUS,
	// 		DhaagaJsNotificationType.FOLLOW,
	// 		DhaagaJsNotificationType.POLL_NOTIFICATION,
	// 	],
	// });

	async function api() {
		if (ActivityPubService.misskeyLike(driver)) {
			const result = await (
				client as MisskeyRestClient
			).notifications.getSubscriptions({
				limit: 5,
				types: [],
				excludeTypes: [],
			});
			console.log(result.data);

			if (ActivityPubService.misskeyLike(driver)) {
				// obj.items = obj.items.filter(
				// 	(o) => !['mention', 'login', 'note', 'status'].includes(o.type),
				// );
				return MisskeyService.deserializeNotifications(
					result.data,
					driver,
					server,
				);
			}
		} else {
			return pageResultDefault;
		}
	}

	return useQuery<NotificationResults>({
		queryKey: ['notifications/subs', acct],
		queryFn: api,
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
