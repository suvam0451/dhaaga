import { produce } from 'immer';
import { useEffect, useReducer, useRef, useState } from 'react';
import {
	ProfilePinnedTag,
	ProfilePinnedTimeline,
	ProfilePinnedUser,
	Profile,
	ProfilePinnedTagService,
	ProfilePinnedUserService,
	ProfilePinnedTimelineService,
} from '@dhaaga/db';
import AppSessionManager from '../services/session/app-session.service';
import ProfileSessionManager from '../services/session/profile-session.service';

export type SocialHubTabPinData = {
	timelines: ProfilePinnedTimeline[];
	users: ProfilePinnedUser[];
	tags: ProfilePinnedTag[];
};

enum REDUCER_ACTION {
	INIT = 'init',
	REFRESH = 'refresh',
}

const reducerDefault: SocialHubTabPinData = {
	timelines: [],
	users: [],
	tags: [],
};

function reducer(
	state: SocialHubTabPinData,
	action: { type: REDUCER_ACTION; payload: any },
) {
	switch (action.type) {
		case REDUCER_ACTION.INIT: {
			const _profile = action.payload.profile;
			const _db = action.payload.db;

			const timelines = ProfilePinnedTimelineService.getShownForProfile(
				_db,
				_profile,
			);
			const users = ProfilePinnedUserService.getShownForProfile(_db, _profile);
			const tags = ProfilePinnedTagService.getShownForProfile(_db, _profile);

			return produce(state, (draft) => {
				draft.timelines = timelines;
				draft.users = users;
				draft.tags = tags;
			});
		}
		case REDUCER_ACTION.REFRESH: {
		}
	}
}

/**
 * Reactive representation of
 * a single profile in the Social
 * Hub module (as a tab)
 *
 * - Stores reference to owner profile,
 * - Stores pin data
 * - Performs hub refresh operations
 */
function useSocialHubTab(appManager: AppSessionManager, profile: Profile) {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const [OwnerProfile, setOwnerProfile] = useState<Profile>(null);

	const [Data, dispatch] = useReducer(reducer, reducerDefault);

	const Manager = useRef<ProfileSessionManager>(null);
	useEffect(() => {
		if (!appManager || !appManager.db || !profile) {
			setOwnerProfile(null);
			return;
		}

		Manager.current = new ProfileSessionManager(appManager.db);
		setOwnerProfile(profile);

		dispatch({
			type: REDUCER_ACTION.REFRESH,
			payload: {
				db: appManager.db,
				profile: profile,
			},
		});
	}, [profile]);

	function refreshSocialHub() {
		setIsRefreshing(true);
		setIsRefreshing(false);
	}

	return { data: Data, refreshing: IsRefreshing, refresh: refreshSocialHub };
}

export default useSocialHubTab;
