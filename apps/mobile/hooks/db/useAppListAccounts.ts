import { useEffect, useState } from 'react';
import { AccountService } from '@dhaaga/db';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function useAppListAccounts(stateId?: string) {
	const [Refreshing, setRefreshing] = useState(false);
	const { db } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
		})),
	);

	const [Data, setData] = useState([]);

	function reload() {
		try {
			setData(AccountService.getAll(db));
		} catch (e) {
			console.log('[ERROR]: failed to load account list', e);
			setData([]);
		}
	}

	// populate account list on load & refresh
	function onRefresh() {
		setRefreshing(true);
		reload();
		setRefreshing(false);
	}

	useEffect(() => {
		reload();
	}, [stateId]);

	return { data: Data, refresh: onRefresh, isRefreshing: Refreshing };
}

export { useAppListAccounts };
