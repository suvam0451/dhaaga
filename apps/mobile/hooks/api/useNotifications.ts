import { useAppNotifSeenContext } from '../../components/screens/notifications/landing/state/useNotifSeen';
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
} from '../utility/global-state-extractors';
import { UserMiddleware } from '../../services/middlewares/user.middleware';
import ActivityPubService from '../../services/activitypub.service';
import { RandomUtil } from '../../utils/random.utils';

type useApiGetNotificationsProps = {
	include: DhaagaJsNotificationType[];
};

type HookResultType = {
	data: AppNotificationObject[];
	minId?: string;
	maxId?: string;
};

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

const defaultHookResult: HookResultType = {
	data: [],
};

/**
 * Generates
 */
function notificationTypeArrayGenerator(
	type: 'mentions' | 'chat' | 'socials' | 'updates',
) {}

/**
 * API Query for the notifications endpoint
 */
function useApiGetNotifications({ include }: useApiGetNotificationsProps) {
	const { acct } = useAppAcct();
	const { client, driver } = useAppApiClient();

	async function api(): Promise<HookResultType> {
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
				data: NotificationMiddleware.deserialize<unknown[]>( // ignore certain notification types
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
				data: NotificationMiddleware.deserialize<unknown[]>( // ignore certain notification types
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
	return useQuery<HookResultType>({
		queryKey: ['notifications', driver, acct?.server, include],
		queryFn: api,
		enabled: client !== null,
		initialData: { data: [] },
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

	async function api(): Promise<HookResultType> {
		const results = await client.notifications.getMentions(driver);
		if (results.error) {
			throw new Error(results.error.message);
		} else {
			const _data = results.data;
			if (ActivityPubService.misskeyLike(driver)) {
				return {
					data: _data.data.map((o: any) => {
						const _acct = UserMiddleware.deserialize<unknown>(
							o.user,
							driver,
							server,
						);
						const _post = PostMiddleware.deserialize<unknown>(
							o,
							driver,
							server,
						);
						const _obj: AppNotificationObject = {
							id: RandomUtil.nanoId(),
							type: _post.visibility === 'specified' ? 'chat' : 'mention',
							post: _post,
							user: _acct,
							read: false,
							createdAt: new Date(_post.createdAt),
							extraData: {},
						};
						return _obj;
					}),
					minId: null,
					maxId: null,
				};
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
				data: _retval,
				maxId: _data.maxId,
				minId: _data.minId,
			};
		}
	}

	// Queries
	return useQuery<HookResultType>({
		queryKey: ['notifications/mentions', acct],
		queryFn: api,
		enabled: client !== null,
		initialData: defaultHookResult,
	});
}

/**
 * Fetches direct message data
 */
function useApiGetChatUpdates() {
	const [Results, setResults] = useState<AppNotificationObject[]>([]);
	const { acct } = useAppAcct();
	const { driver, client } = useAppApiClient();

	useEffect(() => {
		setResults([]);
	}, [acct]);

	async function api() {
		switch (driver) {
			case KNOWN_SOFTWARE.MASTODON:
			case KNOWN_SOFTWARE.MISSKEY:
			case KNOWN_SOFTWARE.SHARKEY: {
				const chatResult = await client.notifications.getChats(driver);
				if (chatResult.error) {
					return null;
				} else {
					return chatResult.data;
				}
			}
		}
		console.log('[WARN]: driver does not implement chat module');
		return null;
	}

	// Queries
	const { fetchStatus, data, status, refetch } = useQuery<any>({
		queryKey: ['chat', acct],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		switch (driver) {
			case KNOWN_SOFTWARE.SHARKEY:
			case KNOWN_SOFTWARE.MISSKEY: {
				const interfaces = PostMiddleware.rawToInterface<unknown[]>(
					data,
					driver,
				);
				// (data as MisskeyNotificationResponseType)
			}
		}
	}, [fetchStatus]);

	return { data: Results, refetch };
}

function useApiGetSocialUpdates() {
	const { acct } = useAppAcct();
	const { driver, client, server } = useAppApiClient();

	async function api(): Promise<HookResultType> {
		const results = await client.notifications.getSocialUpdates({
			limit: 40,
			excludeTypes: [],
			types: [],
		});
		if (results.error) {
			throw new Error(results.error.message);
		} else {
			const _data = results.data;
			if (ActivityPubService.misskeyLike(driver)) {
				return {
					data: _data.data.map((o: any) => {
						const _acct = UserMiddleware.deserialize<unknown>(
							o.user,
							driver,
							server,
						);
						const _post = PostMiddleware.deserialize<unknown>(
							o,
							driver,
							server,
						);
						const _obj: AppNotificationObject = {
							id: RandomUtil.nanoId(),
							type: _post.visibility === 'specified' ? 'chat' : 'mention',
							post: _post,
							user: _acct,
							read: false,
							createdAt: new Date(_post.createdAt),
							extraData: {},
						};
						return _obj;
					}),
					minId: null,
					maxId: null,
				};
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
				.filter((o) => !!o)
				.filter((o) => !['mention'].includes(o.type));

			return {
				data: _retval,
				maxId: _data.maxId,
				minId: _data.minId,
			};
		}
	}

	// const { driver } = useAppApiClient();
	// const { data } = useApiGetNotifications({
	// 	include: ActivityPubService.mastodonLike(driver)
	// 		? [
	// 				// Mastodon
	// 				DhaagaJsNotificationType.FAVOURITE,
	// 				DhaagaJsNotificationType.POLL_ENDED,
	// 				DhaagaJsNotificationType.POLL_NOTIFICATION,
	// 				DhaagaJsNotificationType.POLL_VOTE,
	// 				DhaagaJsNotificationType.REBLOG,
	// 			]
	// 		: [],
	// });

	// Queries
	return useQuery<HookResultType>({
		queryKey: ['notifications/social', acct],
		queryFn: api,
		enabled: client !== null,
		initialData: defaultHookResult,
	});
}

function useApiGetSubscriptionUpdates() {
	const { data } = useApiGetNotifications({
		include: [
			// Mastodon
			DhaagaJsNotificationType.STATUS,
			DhaagaJsNotificationType.FOLLOW,
			DhaagaJsNotificationType.POLL_NOTIFICATION,
		],
	});

	return {
		data: {
			data: data.data.filter((o) => ['note', 'renote'].includes(o.type)),
			maxId: data.maxId,
			minId: data.minId,
		},
	};
}

export {
	useApiGetMentionUpdates,
	useApiGetSocialUpdates,
	useApiGetChatUpdates,
	useApiGetSubscriptionUpdates,
};
