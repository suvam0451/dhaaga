import { Profile, ProfileService } from '@dhaaga/db';
import {
	AppStateImmerGetObject,
	AppStateImmerSetObject,
} from '#/states/global/typings';

export type AppStateHubSessionState = {
	profiles: Profile[];
	pageIndex: number;
};

export type AppStateHubSessionActions = {
	refresh: () => void;
	loadNext: () => void;
	loadPrev: () => void;
	selectProfile: (index: number) => void;
};

function createHubSessionSlice(
	set: AppStateImmerSetObject,
	get: AppStateImmerGetObject,
) {
	return {
		/**
		 * ---- State ----
		 */

		profiles: [],
		pageIndex: -1,

		/**
		 * ---- Actions ----
		 */

		refresh: () => {
			const _acct = get().userSession.acct;
			const _db = get().appSession.db;
			if (!_acct || !_db) return;

			const profiles = ProfileService.getForAccount(_db, _acct);
			if (profiles.length === 0) return;
			set((state) => {
				state.hubSession.profiles = ProfileService.getForAccount(_db, _acct);
				state.hubSession.pageIndex = 0;
			});
		},
		loadNext: () => {
			// return state
		},
		loadPrev: () => {
			// return state
		},
		selectProfile: (index: number) => {
			set((state) => {
				state.hubSession.pageIndex = index;
			});
		},
	};
}

export default createHubSessionSlice;
