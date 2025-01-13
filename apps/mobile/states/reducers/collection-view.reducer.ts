import { AccountSavedPost, AccountSavedUser } from '../../database/_schema';
import { produce } from 'immer';
import { Dispatch } from 'react';

type CollectionDataViewUserEntry = {
	item: AccountSavedUser;
	shown: boolean;
	selected: boolean;
	postCount: number;
};

type State = {
	posts: AccountSavedPost[] /**
	 * 	this is what is shown to the user
	 * 	upto a maximum of 100 items, unless
	 * 	the user chooses to load more
	 */;
	results: AccountSavedPost[];
	users: CollectionDataViewUserEntry[];
	widgetShown: boolean;
	widgetDimmed: boolean;
};

const DEFAULT: State = {
	posts: [],
	results: [],
	users: [],
	widgetShown: false,
	widgetDimmed: false,
};

enum ACTION {
	LOAD,
	SELECT_ALL_USERS,
	SELECT_NONE_USERS,
	TOGGLE_USER_SELECT,
	HIDE_WIDGET,
	DIM_WIDGET,
}

type Actions =
	| {
			type: ACTION.LOAD;
			payload: {
				items: AccountSavedPost[];
			};
	  }
	| {
			type: ACTION.SELECT_ALL_USERS;
	  }
	| {
			type: ACTION.SELECT_NONE_USERS;
	  }
	| {
			type: ACTION.TOGGLE_USER_SELECT;
			payload: {
				id: string;
			};
	  }
	| {
			type: ACTION.HIDE_WIDGET;
	  }
	| {
			type: ACTION.DIM_WIDGET;
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.LOAD: {
			let users: Map<
				string,
				{
					item: AccountSavedUser;
					postCount: number;
				}
			> = new Map();
			for (const post of action.payload.items) {
				if (!post.savedUser) continue;
				const key = post.savedUser.identifier;

				if (users.has(key)) {
					users.get(key).postCount++;
					continue;
				}
				users.set(key, { item: post.savedUser, postCount: 0 });
			}

			return produce(state, (draft) => {
				draft.posts = action.payload.items;
				draft.results = action.payload.items.slice(0, 100);
				draft.users = Array.from(users.values()).map((o) => ({
					item: o.item,
					postCount: o.postCount,
					shown: true,
					selected: true,
				}));
			});
		}
		default: {
			return state;
		}
	}
}

type CollectionViewDispatchType = Dispatch<Actions>;
export {
	reducer as collectionViewReducer,
	DEFAULT as collectionViewDefault,
	ACTION as CollectionViewActionType,
	Actions as collectionViewReducerActions,
	State as CollectionViewStateType,
	CollectionViewDispatchType,
};
