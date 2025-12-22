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
function useNotificationStore(minResultsToShow: number = 25) {
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
	}

	useEffect(() => {
		if (state.items.length < minResultsToShow && !state.endOfList) {
			dispatch({
				type: InboxStateAction.LOAD_NEXT_PAGE,
			});
		}
	}, [state.maxId]);

	function reset() {
		dispatch({
			type: InboxStateAction.RESET,
		});
	}

	function loadNext() {
		if (!state.endOfList) {
			dispatch({
				type: InboxStateAction.LOAD_NEXT_PAGE,
			});
		}
	}

	return {
		state,
		append: appendNotifications,
		loadNext,
		maxId: state.appliedMaxId,
		reset,
	};
}

export default useNotificationStore;
