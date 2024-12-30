import { DataSource } from '../../database/dataSource';
import { RandomUtil } from '../../utils/random.utils';
import { AppUserObject } from '../../types/app-user.types';
import { produce } from 'immer';
import { Dispatch } from 'react';

type State = {
	db: DataSource | null;
	sessionIdentifier: string;

	// pagination state
	isFirstLoadPending: boolean;

	isEol: boolean;
	opts: { limit: number; q?: string };
	items: AppUserObject[];
	seen: Set<string>;

	minId: string | null;
	maxId: string | null;

	/**
	 * Updating this value will result in
	 * fetching the next set of data
	 */
	appliedMaxId: string | null;
};

export const DEFAULT: State = {
	db: null,
	sessionIdentifier: RandomUtil.nanoId(),
	isEol: false,
	opts: { limit: 20 },
	isFirstLoadPending: true,
	items: [],
	seen: new Set<string>(),
	minId: null,
	maxId: null,
	appliedMaxId: null,
};

export enum ACTION {
	INIT,
	APPEND_RESULTS,
	SET_QUERY_OPTS,
	REQUEST_LOAD_MORE,
	RESET,
}

type Actions =
	| {
			type: ACTION.INIT;
			payload: {
				db: DataSource;
			};
	  }
	| {
			type: ACTION.APPEND_RESULTS;
			payload: {
				items: AppUserObject[];
				minId?: string;
				maxId?: string;
			};
	  }
	| {
			type: ACTION.SET_QUERY_OPTS;
			payload: { limit: number; q?: string };
	  }
	| {
			type: ACTION.REQUEST_LOAD_MORE;
	  }
	| {
			type: ACTION.RESET;
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.INIT: {
			return produce(state, (draft) => {
				draft.db = action.payload.db;
				draft.seen = new Set();
				draft.sessionIdentifier = RandomUtil.nanoId();
			});
		}
		case ACTION.REQUEST_LOAD_MORE: {
			return produce(state, (draft) => {
				draft.appliedMaxId = state.maxId;
			});
		}
		case ACTION.RESET: {
			return produce(state, (draft) => {
				draft.items = [];
				draft.maxId = null;
				draft.minId = null;
				draft.isEol = false;
				draft.isFirstLoadPending = true;
				draft.seen = new Set();
			});
		}
		case ACTION.APPEND_RESULTS: {
			const copy = Array.from(state.items);
			for (const item of action.payload.items) {
				if (state.seen.has(item.id)) continue;
				copy.push(item);
			}
			return produce(state, (draft) => {
				draft.items = copy;
				draft.maxId = action.payload.maxId;
			});
		}
		case ACTION.SET_QUERY_OPTS: {
			return produce(state, (draft) => {
				draft.opts = action.payload;
			});
		}
	}
}

type AppUserTimelineReducerDispatchType = Dispatch<Actions>;

export {
	State as AppUserTimelineReducerStateType,
	reducer as appUserTimelineReducer,
	DEFAULT as appUserTimelineReducerDefault,
	ACTION as AppUserTimelineReducerActionType,
	Actions as appUserTimelineActions,
	AppUserTimelineReducerDispatchType,
};
