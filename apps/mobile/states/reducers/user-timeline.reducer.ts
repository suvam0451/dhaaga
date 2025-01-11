import { DataSource } from '../../database/dataSource';
import { RandomUtil } from '../../utils/random.utils';
import { AppUserObject } from '../../types/app-user.types';
import { produce } from 'immer';
import { Dispatch } from 'react';
import {
	timelineReducerBaseDefaults,
	TimelineReducerBaseState,
} from './_timeline.shared';

type State = TimelineReducerBaseState<AppUserObject> & {};

export const DEFAULT: State = {
	...timelineReducerBaseDefaults,
};

export enum ACTION {
	INIT,
	RESET,
	APPEND_RESULTS,
	REQUEST_LOAD_MORE,
	SET_QUERY_OPTS,
}

type Actions =
	| {
			type: ACTION.INIT;
			payload: {
				db: DataSource;
			};
	  }
	| {
			type: ACTION.RESET;
	  }
	| {
			type: ACTION.REQUEST_LOAD_MORE;
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
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.INIT: {
			return produce(state, (draft) => {
				draft.db = action.payload.db;
				draft.seen = new Set();
				draft.sessionId = RandomUtil.nanoId();
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
				draft.isFirstLoad = false;
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
