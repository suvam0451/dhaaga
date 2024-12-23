import { produce } from 'immer';

type PostComposer_MediaState = {
	previewUrl?: string;
	remoteId?: string;
	url?: string;
	uploaded: boolean;
	localUri: string;
	status?: string;
	cw?: string;
};

type State = {
	tab: 'txt' | 'emoji' | 'media';
	cw: string | null;
	isCwVisible: boolean;
	medias: [];
	text: string | null;
};

export enum ACTION {
	SET_TEXT,
	CLEAR_TEXT,
	SWITCH_TO_EMOJI_TAB,
	SWITCH_TO_TEXT_TAB,
	SWITCH_TO_MEDIA_TAB,
}

const DEFAULT: State = {
	tab: 'txt',
	cw: null,
	isCwVisible: false,
	medias: [],
	text: null,
};

type Actions =
	| {
			type: ACTION.SET_TEXT;
			payload: {
				content: string;
			};
	  }
	| {
			type: ACTION.CLEAR_TEXT;
	  }
	| {
			type: ACTION.SWITCH_TO_MEDIA_TAB;
	  }
	| {
			type: ACTION.SWITCH_TO_EMOJI_TAB;
	  }
	| {
			type: ACTION.SWITCH_TO_TEXT_TAB;
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.SET_TEXT: {
			return produce(state, (draft) => {
				draft.text = action.payload.content;
			});
		}
		case ACTION.CLEAR_TEXT: {
			return produce(state, (draft) => {
				draft.text = null;
			});
		}
		case ACTION.SWITCH_TO_EMOJI_TAB: {
			return produce(state, (draft) => {
				draft.tab = 'emoji';
			});
		}
		case ACTION.SWITCH_TO_TEXT_TAB: {
			return produce(state, (draft) => {
				draft.tab = 'txt';
			});
		}
		case ACTION.SWITCH_TO_MEDIA_TAB: {
			return produce(state, (draft) => {
				draft.tab = 'media';
			});
		}
	}
}

export {
	reducer as postComposerReducer,
	DEFAULT as postComposerReducerDefault,
};
