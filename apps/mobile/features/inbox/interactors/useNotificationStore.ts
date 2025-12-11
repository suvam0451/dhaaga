import useAppPaginator from '#/hooks/app/useAppPaginator';
import type { NotificationObjectType, ResultPage } from '@dhaaga/bridge';
import {
	InboxStateAction,
	useInboxState,
	useInboxDispatch,
} from '@dhaaga/core';
import { useActiveUserSession } from '#/states/global/hooks';
import { useEffect } from 'react';

/**
 * Help manage notifications for
 * an inbox category
 */
function useNotificationStore() {
	const { lastId, loadNext, MaxId, reset: resetPaginator } = useAppPaginator();
	const state = useInboxState();
	const dispatch = useInboxDispatch();
	const { acct } = useActiveUserSession();

	useEffect(() => {
		reset();
	}, [acct]);

	function appendNotifications(page: ResultPage<NotificationObjectType[]>) {
		if (!page) return;
		dispatch({
			type: InboxStateAction.APPEND,
			payload: {
				page,
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
