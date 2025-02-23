import useAppPaginator from '../../../hooks/app/useAppPaginator';
import { AppResultPageType } from '../../../types/app.types';
import { NotificationObjectType } from '@dhaaga/bridge';
import {
	InboxStateAction,
	useInboxState,
	useInboxDispatch,
} from '@dhaaga/core';

/**
 * Help manage notifications for
 * an inbox category
 */
function useNotificationStore() {
	const { lastId, loadNext, MaxId, reset: resetPaginator } = useAppPaginator();
	const state = useInboxState();
	const dispatch = useInboxDispatch();

	function appendNotifications(
		page: AppResultPageType<NotificationObjectType>,
	) {
		dispatch({
			type: InboxStateAction.APPEND,
			payload: {
				page: page,
			},
		});
		lastId.current = page.maxId;
	}

	function reset() {
		dispatch({
			type: InboxStateAction.RESET,
		});
		resetPaginator();
	}

	return {
		state,
		append: appendNotifications,
		loadNext,
		maxId: MaxId,
		reset,
	};
}

export default useNotificationStore;
