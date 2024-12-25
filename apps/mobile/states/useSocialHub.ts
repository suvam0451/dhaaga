import { useEffect, useReducer, useState } from 'react';
import { Profile } from '../database/_schema';
import { produce } from 'immer';
import { ProfileService } from '../database/entities/profile';
import useGlobalState from './_global';
import { useShallow } from 'zustand/react/shallow';
import { DataSource } from '../database/dataSource';

enum REDUCER_ACTION {
	INIT = 'init',
	REFRESH = 'refresh',
}

function reducer(
	state: { profiles: Profile[] },
	action: { type: REDUCER_ACTION; payload: any },
): { profiles: Profile[] } {
	switch (action.type) {
		case REDUCER_ACTION.INIT: {
			const _db: DataSource = action.payload.db;

			const shownProfiles = ProfileService.getShownProfiles(_db);
			return produce(state, (draft) => {
				draft.profiles = shownProfiles;
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
	const { db } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
		})),
	);

	const [TabIndex, setTabIndex] = useState(0);

	const [Data, dispatch] = useReducer(reducer, {
		profiles: [],
	});

	useEffect(() => {
		if (!db) return;
		dispatch({
			type: REDUCER_ACTION.INIT,
			payload: {
				db,
			},
		});
	}, [db]);

	function onPageScroll(e: any) {
		const { offset, position } = e.nativeEvent;
		const newIndex = Math.round(position + offset);
		setTabIndex(newIndex);
	}

	return { index: TabIndex, onPageScroll, data: Data };
}

export default useSocialHub;
