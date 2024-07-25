import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import {
	DhaagaJsNotificationType,
	StatusInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { useEffect, useState } from 'react';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import ActivitypubAdapterService from '../../../../services/activitypub-adapter.service';

type NotificationRenderType = {
	type: DhaagaJsNotificationType;
	account?: UserInterface;
	post?: StatusInterface;
	createdAt: Date;
	groupKey: string;
	id: string;
};

export type AppNotificationGroup = {
	id: string;
	latest: Date;
	items: NotificationRenderType[];
};

function useLandingPageStackApi() {
	const [Notifications, setNotifications] = useState<
		{
			type: string;
			props: AppNotificationGroup;
		}[]
	>([]);
	const { client, domain } = useActivityPubRestClientContext();

	async function api() {
		if (!client) {
			return [];
		}
		const { data, error } = await client.notifications.get({
			limit: 80,
			excludeTypes: [],
			types: [
				DhaagaJsNotificationType.FOLLOW,
				DhaagaJsNotificationType.FAVOURITE,
				DhaagaJsNotificationType.MENTION,
			],
		});
		return data as any;
	}

	// Queries
	const queryResults = useQuery<{
		data: any[];
		minId?: string;
		maxId?: string;
	}>({
		queryKey: [],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (!client) return;

		const { data, status } = queryResults;
		if (!data || !status) return;
		const results: NotificationRenderType[] = [];

		for (const datum of (data as any).data) {
			switch (datum.type) {
				case DhaagaJsNotificationType.STATUS:
				case DhaagaJsNotificationType.REBLOG:
				case DhaagaJsNotificationType.POLL_NOTIFICATION:
				case DhaagaJsNotificationType.FAVOURITE:
				case DhaagaJsNotificationType.FOLLOW:
				case DhaagaJsNotificationType.MENTION: {
					results.push({
						account: datum.account
							? ActivityPubAdapterService.adaptUser(datum.account, domain)
							: undefined,
						type: datum.type as DhaagaJsNotificationType.FAVOURITE,
						createdAt: datum.createdAt,
						groupKey: datum.groupKey,
						id: datum.id,
						post: datum.status
							? ActivitypubAdapterService.adaptStatus(datum.status, domain)
							: undefined,
					});
					break;
				}
				// case NotificationType.STATUS: {
				// 	const { account, type, status, ...rest } = datum;
				// 	console.log('poll', rest);
				// 	break;
				// }
				default: {
					console.log('unknown notification type', datum.type);
				}
			}
		}

		const mapper = new Map<string, NotificationRenderType[]>();
		for (const result of results) {
			if (!mapper.has(result.groupKey)) {
				mapper.set(result.groupKey, [result]);
			} else {
				mapper.get(result.groupKey)!.push(result);
			}
		}

		const appNotifs = [];
		// @ts-ignore-next-line
		for (const [k, v] of mapper) {
			const sorted = v.sort(
				(a: NotificationRenderType, b: NotificationRenderType) =>
					a.createdAt > b.createdAt ? 1 : -1,
			);
			appNotifs.push({
				type: sorted[0].type,
				props: {
					id: k,
					items: v,
					createdAt: sorted[0].createdAt,
				},
			});
		}
		setNotifications(appNotifs);
	}, [queryResults.fetchStatus]);

	return { Notifications };
}

export default useLandingPageStackApi;
