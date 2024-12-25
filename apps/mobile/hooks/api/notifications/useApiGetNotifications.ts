import {
	DhaagaJsNotificationType,
	MisskeyRestClient,
	KNOWN_SOFTWARE,
} from '@dhaaga/shared-abstraction-activitypub';
import { useQuery } from '@tanstack/react-query';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { NotificationMiddleware } from '../../../services/middlewares/notification.middleware';
import { AppNotificationObject } from '../../../types/app-notification.types';

type useApiGetNotificationsProps = {
	include: DhaagaJsNotificationType[];
};

type HookResultType = {
	data: AppNotificationObject[];
	minId?: string;
	maxId?: string;
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
					data.data,
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

export default useApiGetNotifications;
