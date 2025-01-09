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
	acct: Account;
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
	profile: Profile;
	acct: Account;
	pins: {
		timelines: ProfilePinnedTimeline[];
		users: ProfilePinnedUser[];
		tags: ProfilePinnedTag[];
	};
	lastUpdatedAt: Date;
};

export enum ACTION {
	INIT,
	RELOAD_PINS,
}

export const DEFAULT: State = {
	db: null,
	profile: null,
	acct: null,
	pins: {
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
			type: ACTION.RELOAD_PINS;
	  };

class Service {
	static refreshProfileList(db: DataSource, acct: Account): SocialHubProfile[] {
		const _profiles = ProfileService.getForAccount(db, acct);

		return _profiles.map((o) => {
			const _timelines = ProfilePinnedTimelineService.getShownForProfile(db, o);
			const _users = ProfilePinnedUserService.getShownForProfile(db, o);
			const _tags = ProfilePinnedTagService.getShownForProfile(db, o);
			const _acct = ProfileService.getOwnerAccount(db, o);

			return {
				acct: _acct,
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

	static refreshProfile(db: DataSource, profile: Profile): SocialHubProfile {
		const _timelines = ProfilePinnedTimelineService.getShownForProfile(
			db,
			profile,
		);
		const _users = ProfilePinnedUserService.getShownForProfile(db, profile);
		const _tags = ProfilePinnedTagService.getShownForProfile(db, profile);
		const _acct = ProfileService.getOwnerAccount(db, profile);

		return {
			acct: _acct,
			item: profile,
			pins: {
				timelines: _timelines,
				users: _users,
				tags: _tags,
			},
			lastUpdatedAt: new Date(),
		};
	}
}

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.INIT: {
			if (!action.payload.db || !action.payload.profile) return state;

			const _acct = ProfileService.getOwnerAccount(
				action.payload.db,
				action.payload.profile,
			);
			return produce(state, (draft) => {
				draft.db = action.payload.db;
				draft.profile = action.payload.profile;
				draft.acct = _acct;
			});
		}
		case ACTION.RELOAD_PINS: {
			const localRefreshedData = Service.refreshProfile(
				state.db,
				state.profile,
			);
			return produce(state, (draft) => {
				draft.pins = localRefreshedData.pins;
				draft.lastUpdatedAt = localRefreshedData.lastUpdatedAt;
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
