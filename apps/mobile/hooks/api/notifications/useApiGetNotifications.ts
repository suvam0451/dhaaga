import {
	DhaagaJsNotificationType,
	MisskeyRestClient,
	KNOWN_SOFTWARE,
} from '@dhaaga/shared-abstraction-activitypub';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppPostObject } from '../../../types/app-post.types';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';
import { AppUserObject } from '../../../types/app-user.types';
import { UserMiddleware } from '../../../services/middlewares/user.middleware';

type Api_Response_Type = {
	data: any[];
	minId?: string;
	maxId?: string;
};

export type Notification_Entry = {
	id: string;
	type: DhaagaJsNotificationType;
	createdAt: Date;
	groupKey?: string;
	acct?: AppUserObject;
	post?: AppPostObject;
	extraData?: string;
	read?: boolean;
};

export type Notification_FlatList_Entry = {
	type: DhaagaJsNotificationType;
	props: Notification_Entry;
};

type useApiGetNotificationsProps = {
	include: DhaagaJsNotificationType[];
};

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
	const [Results, setResults] = useState<Notification_FlatList_Entry[]>([]);

	useEffect(() => {
		setResults([]);
	}, [acct]);

	async function api() {
		if (!client) return [];
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

			if (error) return [];
			return data as any;
		} else {
			const { data, error } = await client.notifications.get({
				limit: 40,
				excludeTypes: [],
				types: include,
			});
			if (error) return [];
			return data as any;
		}
	}

	// Queries
	const { fetchStatus, data, status, refetch } = useQuery<Api_Response_Type>({
		queryKey: ['notifications', driver, acct?.server, include],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		setResults(
			data.data.map((o) => ({
				type: o.type as DhaagaJsNotificationType,
				props: {
					id: o.id,
					type: o.type as DhaagaJsNotificationType,
					createdAt: o.createdAt,
					groupKey: o.groupKey,
					acct: UserMiddleware.deserialize<unknown>(
						o.account || o.user,
						driver,
						acct?.server,
					),
					post: PostMiddleware.deserialize<unknown>(
						o.status || o.data || o.note,
						driver,
						acct?.server,
					),
					extraData: o.reaction,
					read: o.isRead,
				},
			})),
		);
	}, [fetchStatus]);

	return { Results, maxId: data?.maxId, minId: data?.minId, refetch };
}

export default useApiGetNotifications;
