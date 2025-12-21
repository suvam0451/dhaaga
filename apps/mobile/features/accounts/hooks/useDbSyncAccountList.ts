import { Account, AccountService } from '@dhaaga/db';
import { useAppDb, useAppPublishers } from '#/states/global/hooks';
import { useEffect, useState } from 'react';
import { APP_EVENT_ENUM } from '#/states/event-bus/app.publisher';

function useDbSyncAccountList() {
	const [IsLoading, setIsLoading] = useState(false);
	const { appEventBus } = useAppPublishers();
	const { db } = useAppDb();
	const [Data, setData] = useState<Account[]>([]);

	useEffect(() => {
		if (!appEventBus) return;
		refresh();
		appEventBus.subscribe(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED, refresh);
		return () => {
			appEventBus.unsubscribe(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED, refresh);
		};
	}, [db]);

	function sync() {
		setIsLoading(true);
		try {
			setData(AccountService.getAll(db));
		} catch (e) {
			console.log('[ERROR]: failed to load account list', e);
			setData([]);
		} finally {
			setIsLoading(false);
		}
	}

	// populate an account list on a load and refresh
	function refresh() {
		sync();
	}

	return { accounts: Data, refresh, isLoading: IsLoading };
}

export default useDbSyncAccountList;
