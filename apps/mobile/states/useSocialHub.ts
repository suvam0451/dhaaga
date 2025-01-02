import { useEffect, useReducer, useState } from 'react';
import { Profile } from '../database/_schema';
import { produce } from 'immer';
import useGlobalState from './_global';
import { useShallow } from 'zustand/react/shallow';
import { DataSource } from '../database/dataSource';
import { AccountService } from '../database/entities/account';
import { useAppPublishers } from '../hooks/utility/global-state-extractors';
import { APP_EVENT_ENUM } from '../services/publishers/app.publisher';
import { ProfileService } from '../database/entities/profile';

enum REDUCER_ACTION {
	INIT = 'init',
	REFRESH = 'refresh',
}

type State = {
	profiles: Profile[];
};

function reducer(
	state: State,
	action: { type: REDUCER_ACTION; payload: any },
): State {
	switch (action.type) {
		case REDUCER_ACTION.INIT: {
			const _db: DataSource = action.payload.db;

			const profiles = ProfileService.getAllShown(_db);
			const accounts = AccountService.getAll(_db);

			for (const profile of profiles)
				profile.account = accounts.find((o) => o.id === profile.accountId);

			return produce(state, (draft) => {
				draft.profiles = profiles.filter((o) => !!o.account);
			});
		}
		case REDUCER_ACTION.REFRESH: {
			return state;
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
		profiles: [],
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
