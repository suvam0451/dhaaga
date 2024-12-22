import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useState } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { useQuery } from '@tanstack/react-query';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';
import { AppNotificationObject } from '../../../types/app-notification.types';

/**
 * Fetches direct message data
 */
function useApiGetChat() {
	const [Results, setResults] = useState<AppNotificationObject[]>([]);
	const { acct, driver, client } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			driver: o.driver,
			client: o.router,
		})),
	);

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
		console.log('chat data:', data);
	}, [fetchStatus]);

	return { data: Results, refetch };
}

export default useApiGetChat;
