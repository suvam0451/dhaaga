import { AppNotificationObject } from '../../../types/app-notification.types';
import { produce } from 'immer';
import { AppResultPageType } from '../../../types/app.types';
import { Dispatch } from 'react';

type State = {
	seen: Set<string>;
	isLoaded: boolean;
	items: AppNotificationObject[];
};

enum ACTION {
	APPEND_PAGE,
	RESET,
	REPLACE_WITH_PAGE,
}

const DEFAULT: State = {
	seen: new Set(),
	isLoaded: false,
	items: [],
};

type Actions =
	| {
			type: ACTION.APPEND_PAGE;
			payload: { page: AppResultPageType<AppNotificationObject> };
	  }
	| {
			type: ACTION.REPLACE_WITH_PAGE;
			payload: { page: AppResultPageType<AppNotificationObject> };
	  }
	| {
			type: ACTION.RESET;
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.RESET: {
			return produce(state, (draft) => {
				draft.seen = new Set();
				draft.isLoaded = false;
				draft.items = [];
			});
		}
		case ACTION.APPEND_PAGE: {
			return produce(state, (draft) => {
				for (const item of action.payload.page.items) {
					if (draft.seen.has(item.id)) continue;
					draft.seen.add(item.id);

					draft.items.push(item);
				}
				draft.isLoaded = true;
			});
		}
		case ACTION.REPLACE_WITH_PAGE: {
			return produce(state, (draft) => {
				draft.seen = new Set();
				draft.items = [];
				for (const item of action.payload.page.items) {
					if (draft.seen.has(item.id)) continue;
					draft.seen.add(item.id);

					draft.items.push(item);
				}
				draft.isLoaded = true;
			});
		}
	}
}

type DispatchType = Dispatch<Actions>;

export {
	reducer as inboxCategoryReducer,
	DEFAULT as inboxCategoryReducerDefault,
	State as inboxCategoryReducerStateType,
	ACTION as inboxCategoryActionType,
	Actions as inboxCategoryActions,
	DispatchType as inboxCategoryDispatchType,
};
