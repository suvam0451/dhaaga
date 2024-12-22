import { useEffect, useReducer, useState } from 'react';
import { Profile } from '../database/_schema';
import { ProfilePinnedTagService } from '../database/entities/profile-pinned-tag';
import { ProfilePinnedUserService } from '../database/entities/profile-pinned-user';
import { produce } from 'immer';
import { SocialHubTabPinData } from './useSocialHubTab';
import { ProfileService } from '../database/entities/profile';
import useGlobalState from './_global';
import { useShallow } from 'zustand/react/shallow';

enum REDUCER_ACTION {
	INIT = 'init',
	REFRESH = 'refresh',
}

function reducer(
	state: Profile[],
	action: { type: REDUCER_ACTION; payload: any },
) {
	switch (action.type) {
		case REDUCER_ACTION.INIT: {
			const _db = action.payload.db;

			const shownProfiles = ProfileService.getShownProfiles(_db);
			return produce(state, (draft) => {
				draft = shownProfiles;
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

	const [Data, dispatch] = useReducer(reducer, []);

	useEffect(() => {
		dispatch({
			type: REDUCER_ACTION.INIT,
			payload: {
				db,
			},
		});
	}, []);

	function onPageScroll(e: any) {
		const { offset, position } = e.nativeEvent;
		const newIndex = Math.round(position + offset);
		setTabIndex(newIndex);
	}

	return { index: TabIndex, onPageScroll, data: Data };
}

export default useSocialHub;
