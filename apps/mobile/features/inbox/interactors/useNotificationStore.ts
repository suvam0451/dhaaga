import useAppPaginator from '../../../hooks/app/useAppPaginator';
import { AppResultPageType } from '../../../types/app.types';
import { AppNotificationObject } from '../../../types/app-notification.types';
import {
	useInboxCategoryDispatch,
	useInboxCategoryState,
} from '../contexts/useInboxCategoryCtx';
import { inboxCategoryActionType as ActionType } from '../reducers/inbox-category.reducer';

/**
 * Help manage notifications for
 * an inbox category
 */
function useNotificationStore() {
	const { lastId, loadNext, MaxId, reset: resetPaginator } = useAppPaginator();
	const state = useInboxCategoryState();
	const dispatch = useInboxCategoryDispatch();

	function appendNotifications(page: AppResultPageType<AppNotificationObject>) {
		dispatch({
			type: ActionType.APPEND_PAGE,
			payload: {
				page: page,
			},
		});
		lastId.current = page.maxId;
	}

	function reset() {
		dispatch({
			type: ActionType.RESET,
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
