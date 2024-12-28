import { useEffect, useReducer, useState } from 'react';
import { Account } from '../database/_schema';
import { produce } from 'immer';
import useGlobalState from './_global';
import { useShallow } from 'zustand/react/shallow';
import { DataSource } from '../database/dataSource';
import { AccountService } from '../database/entities/account';
import { useAppPublishers } from '../hooks/utility/global-state-extractors';
import { APP_EVENT_ENUM } from '../services/publishers/app.publisher';

enum REDUCER_ACTION {
	INIT = 'init',
	REFRESH = 'refresh',
}

type State = {
	accounts: Account[];
};

function reducer(
	state: State,
	action: { type: REDUCER_ACTION; payload: any },
): State {
	switch (action.type) {
		case REDUCER_ACTION.INIT: {
			const _db: DataSource = action.payload.db;

			const accounts = AccountService.getAll(_db);
			return produce(state, (draft) => {
				draft.accounts = accounts;
			});
		}
		case REDUCER_ACTION.REFRESH: {
		}
	}
}

/**
 * NOTE: Social Hub will only show
 * profiles marked to be shown
 */
function useSocialHub() {
	const [TabIndex, setTabIndex] = useState(0);
	const [Data, dispatch] = useReducer(reducer, {
		accounts: [],
	});
	const { db } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
		})),
	);
	const { appSub } = useAppPublishers();

	function refresh() {
		if (!db) return;
		dispatch({
			type: REDUCER_ACTION.INIT,
			payload: {
				db,
			},
		});
	}

	useEffect(() => {
		refresh();
		appSub.subscribe(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED, refresh);
		return () => {
			appSub.unsubscribe(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED, refresh);
		};
	}, [db]);

	function onPageScroll(e: any) {
		const { offset, position } = e.nativeEvent;
		const newIndex = Math.round(position + offset);
		setTabIndex(newIndex);
	}

	return { index: TabIndex, onPageScroll, data: Data };
}

export default useSocialHub;
