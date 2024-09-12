import useApiGetNotifications from '../../../../../hooks/api/notifications/useApiGetNotifications';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { useEffect } from 'react';
import { useAppNotifSeenContext } from '../state/useNotifSeen';

function useApiGetSocialNotifs() {
	const { appendNotifs } = useAppNotifSeenContext();
	const { Results } = useApiGetNotifications({
		include: [
			DhaagaJsNotificationType.MENTION,
			DhaagaJsNotificationType.REBLOG,
			DhaagaJsNotificationType.FAVOURITE,
		],
	});

	useEffect(() => {
		appendNotifs(Results.map((o) => o.props.id));
	}, [Results]);

	return { items: Results };
}

export default useApiGetSocialNotifs;
