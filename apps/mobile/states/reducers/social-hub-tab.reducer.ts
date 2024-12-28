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

type SocialHubProfile = {
	item: Profile;
	pins: {
		timelines: ProfilePinnedTimeline[];
		users: ProfilePinnedUser[];
		tags: ProfilePinnedTag[];
	};
	lastUpdatedAt: Date;
};

type State = {
	db: DataSource;
	acct: Account;
	profiles: SocialHubProfile[];
};

export enum ACTION {
	INIT,
	RELOAD_PINS,
}

export const DEFAULT: State = {
	db: null,
	acct: null,
	profiles: [],
};

type Actions =
	| {
			type: ACTION.INIT;
			payload: {
				db: DataSource;
				acct: Account;
			};
	  }
	| {
			type: ACTION.RELOAD_PINS;
	  };

class Service {
	static refreshProfileList(db: DataSource, acct: Account): SocialHubProfile[] {
		const _profiles = ProfileService.getForAccount(db, acct);

		return _profiles.map((o) => {
			const _timelines = ProfilePinnedTimelineService.getShownForProfile(db, o);
			const _users = ProfilePinnedUserService.getShownForProfile(db, o);
			const _tags = ProfilePinnedTagService.getShownForProfile(db, o);

			return {
				item: o,
				pins: {
					timelines: _timelines,
					users: _users,
					tags: _tags,
				},
				lastUpdatedAt: new Date(),
			};
		});
	}
}

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.INIT: {
			if (!action.payload.db || !action.payload.acct) return state;

			return produce(state, (draft) => {
				draft.db = action.payload.db;
				draft.acct = action.payload.acct;
				draft.profiles = Service.refreshProfileList(
					action.payload.db,
					action.payload.acct,
				);
			});
		}
		case ACTION.RELOAD_PINS: {
			return produce(state, (draft) => {
				draft.profiles = Service.refreshProfileList(state.db, state.acct);
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
