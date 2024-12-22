import useApiGetNotifications from '../../../../../hooks/api/notifications/useApiGetNotifications';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { useEffect } from 'react';
import { useAppNotifSeenContext } from '../state/useNotifSeen';

function useApiGetSocialNotifs() {
	const { appendNotifs } = useAppNotifSeenContext();
	const { data } = useApiGetNotifications({
		include: [
			DhaagaJsNotificationType.MENTION,
			DhaagaJsNotificationType.REBLOG,
			DhaagaJsNotificationType.FAVOURITE,
		],
	});

	useEffect(() => {
		appendNotifs(data.data.map((o) => o.id));
	}, [data]);

	return { data };
}

export default useApiGetSocialNotifs;
