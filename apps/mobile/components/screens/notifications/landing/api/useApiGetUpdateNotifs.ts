import useApiGetNotifications from '../../../../../hooks/api/notifications/useApiGetNotifications';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { useEffect } from 'react';
import { useAppNotifSeenContext } from '../state/useNotifSeen';

function useApiGetSocialNotifs() {
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

export default useApiGetSocialNotifs;
