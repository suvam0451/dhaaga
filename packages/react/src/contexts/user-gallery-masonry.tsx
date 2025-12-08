import type {
	PostMediaAttachmentType,
	PostObjectType,
	ResultPage,
} from '@dhaaga/bridge';
import { produce } from 'immer';
import { MediaAttachmentViewer } from '@dhaaga/bridge';
import {
	createContext,
	useContext,
	useReducer,
	type Dispatch,
	type ReactNode,
} from 'react';

type MediaPostTuple = { media: PostMediaAttachmentType; post: PostObjectType };

type Page = { left: MediaPostTuple[]; right: MediaPostTuple[] };

type State = {
	posts: any[];
	bundles: MediaPostTuple[];
	items: Page[];

	maxId?: string | null;
	appliedMaxId?: string | null;

	splits: MediaPostTuple[][][];
	numColumns: number;
	// dedup
	seen: Set<string>;
};

const DEFAULT: State = {
	bundles: [],
	numColumns: 0,
	posts: [],
	seen: new Set(),
	splits: [],
	items: [],
};

enum ACTION {
	INIT,
	RESET,
	APPEND,
	REQUEST_LOAD_MORE,
}

type Actions =
	| {
			type: ACTION.INIT;
	  }
	| {
			type: ACTION.RESET;
	  }
	| {
			type: ACTION.APPEND;
			payload: ResultPage<PostObjectType[]>;
	  }
	| {
			type: ACTION.REQUEST_LOAD_MORE;
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.INIT:
		case ACTION.RESET: {
			return produce(state, (draft) => {
				draft.posts = [];
				draft.items = [];
				draft.maxId = null;
				draft.splits = [];
				draft.numColumns = 2;
				draft.seen = new Set();
				draft.bundles = [];
			});
		}
		case ACTION.APPEND: {
			const copy = Array.from(state.posts);
			const bundleCopy = Array.from(state.bundles);

			return produce(state, (draft) => {
				console.log(action.payload);
				for (const item of action.payload.data as PostObjectType[]) {
					if (draft.seen.has(item.id)) continue;
					draft.seen.add(item.id);
					copy.push(item);

					for (const media of item.content.media) {
						if (!MediaAttachmentViewer.isImage(media)) continue;
						bundleCopy.push({ media, post: item });
					}
				}

				let nextSplits: Page[] = [];

				let nextLeftPage: MediaPostTuple[] = [];
				let nextRightPage: MediaPostTuple[] = [];
				let counter = 0;
				let leftHeight = 0,
					rightHeight = 0;
				for (const tuple of bundleCopy) {
					if (rightHeight >= leftHeight) {
						nextLeftPage.push(tuple);
						leftHeight += tuple.media.height ?? 1; // 1, to evenly spread
					} else {
						nextRightPage.push(tuple);
						rightHeight += tuple.media.height ?? 1; // 1, to evenly spread
					}
					counter++;
					if (counter >= 10) {
						nextSplits.push({ left: nextLeftPage, right: nextRightPage });
						nextLeftPage = [];
						nextRightPage = [];
						counter = 0;
					}
				}

				draft.items = nextSplits;
			});
		}
		case ACTION.REQUEST_LOAD_MORE: {
			return produce(state, (draft) => {
				draft.appliedMaxId = state.maxId;
			});
		}
	}
}

type DispatchType = Dispatch<Actions>;

// contexts
const StateCtx = createContext<State | null>(null);
const DispatchCtx = createContext<DispatchType | null>(null);
// hooks
const useUserMasonryGalleryState = () => useContext(StateCtx);
const useUserMasonryGalleryDispatch = () => useContext(DispatchCtx);
// wrapper
function Ctx({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(reducer, DEFAULT);
	return (
		<StateCtx.Provider value={state}>
			<DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
		</StateCtx.Provider>
	);
}

export {
	Ctx as UserMasonryGalleryCtx,
	useUserMasonryGalleryState,
	useUserMasonryGalleryDispatch,
	ACTION as UserMasonryGalleryStateAction,
};
export type {
	State as UserMasonryGalleryStateType,
	DispatchType as UserMasonryGalleryDispatchType,
};
