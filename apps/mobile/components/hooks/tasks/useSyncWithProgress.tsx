import { useState } from 'react';
// import { useRealm } from '@realm/react';
import BookmarkBrowserService from '../../../services/bookmark-browser.service';
import AccountService from '../../../services/account.service';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';

export enum ACTIVITYPUB_SYNC_TASK {
	BOOKMARK_SYNC = 'BOOKMARK_SYNC',
	CLEAR_BOOKMARK_CACHE = 'CLEAR_BOOKMARK_CACHE',
}

/**
 * Used to perform and indicate progress
 * statuses for various sync tasks
 * @param task
 * @param onSuccess is ran on success
 */
function useSyncWithProgress(
	task: ACTIVITYPUB_SYNC_TASK,
	{
		onSuccess,
	}: {
		onSuccess?: () => void;
	},
) {
	const { client, primaryAcct } = useActivityPubRestClientContext();
	// const db = useRealm();

	const [Numerator, setNumerator] = useState(0);
	const [IsTaskRunning, setIsTaskRunning] = useState(false);

	async function Task() {
		setIsTaskRunning(true);
		switch (task) {
			case ACTIVITYPUB_SYNC_TASK.BOOKMARK_SYNC: {
				// await BookmarkBrowserService.updateBookmarkCache(
				// 	primaryAcct,
				// 	client,
				// 	db,
				// 	setNumerator,
				// );
				// AccountService.updateBookmarkSyncStatus(db, primaryAcct);
				break;
			}
			case ACTIVITYPUB_SYNC_TASK.CLEAR_BOOKMARK_CACHE: {
				// BookmarkBrowserService.clearBookmarkCache(db, primaryAcct);
				break;
			}
			default: {
				break;
			}
		}
		setIsTaskRunning(false);
		setNumerator(0);
		if (onSuccess) {
			onSuccess();
		}
	}

	return { Task, Numerator, IsTaskRunning };
}

export default useSyncWithProgress;
