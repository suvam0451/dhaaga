import { useAppNotifSeenContext } from '../../components/screens/notifications/landing/state/useNotifSeen';
import {
	DhaagaJsNotificationType,
	KNOWN_SOFTWARE,
	MisskeyRestClient,
} from '@dhaaga/bridge';
import { useEffect, useState } from 'react';
import { AppNotificationObject } from '../../types/app-notification.types';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { NotificationMiddleware } from '../../services/middlewares/notification.middleware';
import { useQuery } from '@tanstack/react-query';
import { PostMiddleware } from '../../services/middlewares/post.middleware';
import {
	useAppAcct,
	useAppApiClient,
} from '../utility/global-state-extractors';

type useApiGetNotificationsProps = {
	include: DhaagaJsNotificationType[];
};

type HookResultType = {
	data: AppNotificationObject[];
	minId?: string;
	maxId?: string;
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
	const { client, acct, driver } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			acct: o.acct,
			driver: o.driver,
		})),
	);

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
				data: NotificationMiddleware.deserialize<unknown[]>(
					// ignore certain notification types
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
				data: NotificationMiddleware.deserialize<unknown[]>(
					// ignore certain notification types
					data.data.filter((o) => ['login'].includes(o.type)),
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
					console.log(chatResult);
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
	const { appendNotifs } = useAppNotifSeenContext();
	const { data } = useApiGetNotifications({
		include: [
			// Mastodon
			DhaagaJsNotificationType.STATUS,
			DhaagaJsNotificationType.FOLLOW,
			DhaagaJsNotificationType.POLL_NOTIFICATION,
		],
	});

	useEffect(() => {
		appendNotifs(data.data.map((o) => o.id));
	}, [data]);

	return { data };
}

export { useApiGetSocialUpdates, useApiGetChatUpdates };
