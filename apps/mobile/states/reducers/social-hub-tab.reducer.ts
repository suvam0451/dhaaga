import { produce } from 'immer';
import {
	Account,
	Profile,
	ProfilePinnedTag,
	ProfilePinnedTimeline,
	ProfilePinnedUser,
} from '../../database/_schema';
import { ProfilePinnedTimelineService } from '../../database/entities/profile-pinned-timeline';
import { DataSource } from '../../database/dataSource';
import { ProfilePinnedUserService } from '../../database/entities/profile-pinned-user';
import { ProfilePinnedTagService } from '../../database/entities/profile-pinned-tag';
import { ProfileService } from '../../database/entities/profile';

type State = {
	db: DataSource;
	acct: Account;
	profile: Profile;
	pinned: {
		timelines: ProfilePinnedTimeline[];
		users: ProfilePinnedUser[];
		tags: ProfilePinnedTag[];
	};
	lastUpdatedAt: Date;
};

export enum ACTION {
	INIT,
	LOAD_PINS,
}

export const DEFAULT = {
	db: null,
	acct: null,
	profile: null,
	pinned: {
		timelines: [],
		users: [],
		tags: [],
	},
	lastUpdatedAt: new Date(),
};

type Actions =
	| {
			type: ACTION.INIT;
			payload: {
				db: DataSource;
				profile: Profile;
			};
	  }
	| {
			type: ACTION.LOAD_PINS;
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.INIT: {
			return produce(state, (draft) => {
				// TODO: dont perform update if intermediate step fails
				draft.db = action.payload.db;
				draft.profile = action.payload.profile;
				draft.acct = ProfileService.getOwnerAccount(
					action.payload.db,
					action.payload.profile,
				);
			});
		}
		case ACTION.LOAD_PINS: {
			const _timelines = ProfilePinnedTimelineService.getShownForProfile(
				state.db,
				state.profile,
			);
			const _users = ProfilePinnedUserService.getShownForProfile(
				state.db,
				state.profile,
			);
			const _tags = ProfilePinnedTagService.getShownForProfile(
				state.db,
				state.profile,
			);

			return produce(state, (draft) => {
				draft.pinned = {
					timelines: _timelines,
					users: _users,
					tags: _tags,
				};
			});
		}
	}
}

export {
	reducer as socialHubTabReducer,
	DEFAULT as socialHubTabReducerDefault,
	Actions as socialHubTabReducerAction,
	ACTION as socialHubTabReducerActionType,
};
