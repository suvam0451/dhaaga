import {
	DhaagaJsNotificationType,
	MisskeyRestClient,
	StatusInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ActivityPubAdapterService from '../../../services/activitypub-adapter.service';
import ActivitypubAdapterService from '../../../services/activitypub-adapter.service';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';

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

const NOTIFICATION_GET_DEFAULT_PAYLOAD = {
	limit: 40,
	excludeTypes: [],
	types: [
		// Mastodon
		DhaagaJsNotificationType.MENTION,
		DhaagaJsNotificationType.STATUS,
		DhaagaJsNotificationType.REBLOG,
		DhaagaJsNotificationType.FOLLOW,
		DhaagaJsNotificationType.FOLLOW_REQUEST,
		DhaagaJsNotificationType.FAVOURITE,
		DhaagaJsNotificationType.POLL_NOTIFICATION,
		DhaagaJsNotificationType.STATUS_EDITED,
	],
};

/**
 * API Query for the notifications endpoint
 */
function useApiGetNotifications() {
	const { client, primaryAcct, domain } = useActivityPubRestClientContext();
	const [Results, setResults] = useState<Notification_FlatList_Entry[]>([]);

	async function api() {
		if (!client) return [];
		if (domain === KNOWN_SOFTWARE.FIREFISH) {
			/**
			 * Firefish does not support grouped-notifications
			 * Maybe Iceshrimp too?
			 * */
			const { data, error } = await (
				client as MisskeyRestClient
			).notifications.getUngrouped(NOTIFICATION_GET_DEFAULT_PAYLOAD);

			if (error) return [];
			return data as any;
		} else {
			const { data, error } = await client.notifications.get(
				NOTIFICATION_GET_DEFAULT_PAYLOAD,
			);
			if (error) return [];
			return data as any;
		}
	}

	// Queries
	const { fetchStatus, data, status, refetch } = useQuery<Api_Response_Type>({
		queryKey: ['notifications', primaryAcct?.domain, primaryAcct?.subdomain],
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
							? ActivityPubAdapterService.adaptUser(o.account || o.user, domain)
							: undefined,
					post:
						o.status || o.body || o.note
							? ActivitypubAdapterService.adaptStatus(
									o.status || o.data || o.note,
									domain,
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
