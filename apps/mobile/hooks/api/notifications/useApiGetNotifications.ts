import {
	DhaagaJsNotificationType,
	MisskeyRestClient,
	StatusInterface,
	UserInterface,
	KNOWN_SOFTWARE,
} from '@dhaaga/shared-abstraction-activitypub';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ActivityPubAdapterService from '../../../services/activitypub-adapter.service';
import ActivitypubAdapterService from '../../../services/activitypub-adapter.service';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

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
	acct?: UserInterface;
	post?: StatusInterface;
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
					acct:
						o.account || o.user
							? ActivityPubAdapterService.adaptUser(o.account || o.user, driver)
							: undefined,
					post:
						o.status || o.body || o.note
							? ActivitypubAdapterService.adaptStatus(
									o.status || o.data || o.note,
									driver,
								)
							: undefined,
					extraData: o.reaction,
					read: o.isRead,
				},
			})),
		);
	}, [fetchStatus]);

	return { Results, maxId: data?.maxId, minId: data?.minId, refetch };
}

export default useApiGetNotifications;
