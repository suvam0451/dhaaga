import { produce } from 'immer';
import { APP_POST_VISIBILITY } from '../../hooks/app/useVisibility';
import { AppPostObject } from '../../types/app-post.types';
import { Dispatch } from 'react';
import {
	InstanceApi_CustomEmojiDTO,
	TagInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { ImagePickerAsset } from 'expo-image-picker';

export type PostComposer_MediaState = {
	status: 'idle' | 'uploading' | 'uploaded';
	cwSyncStatus: 'idle' | 'uploading' | 'uploaded';
	previewUrl: string | null;
	remoteId: string | null;
	url: string | null;
	localUri: string;
	localCw: string | null;
	remoteCw: string | null;
	mimeType: string;
};

type Suggestion = {
	accounts: UserInterface[];
	hashtags: TagInterface[];
	emojis: InstanceApi_CustomEmojiDTO[];
};

const defaultSuggestions = {
	accounts: [],
	hashtags: [],
	emojis: [],
};

type SearchPrompt = {
	q: string;
	type: 'acct' | 'tag' | 'emoji' | 'none';
};

type State = {
	mode: 'txt' | 'emoji' | 'media'; // txt mode
	text: string | null;
	prompt: SearchPrompt;
	cw: string | null;
	isCwVisible: boolean;
	medias: PostComposer_MediaState[];

	keyboardSelection: { start: number; end: number };

	visibility: APP_POST_VISIBILITY;
	parent: AppPostObject | null;

	suggestions: Suggestion;
};

enum ACTION {
	// Modes
	SET_MODE_TEXT,
	SET_MODE_EMOJI,
	SET_MODE_MEDIA,

	SET_TEXT,
	CLEAR_TEXT,

	SET_SEARCH_PROMPT,

	SWITCH_TO_EMOJI_TAB,
	SWITCH_TO_TEXT_TAB,
	SWITCH_TO_MEDIA_TAB,
	SET_VISIBILITY,

	SET_CW,
	TOGGLE_CW_SECTION_SHOWN,
	SHOW_CW_SECTION,
	HIDE_CW_SECTION,

	SET_PARENT,

	SET_KEYBOARD_SELECTION,

	// media
	ADD_MEDIA,
	UPDATE_UPLOAD_STATUS,
	UPDATE_CW_STATUS,

	// suggestions
	SET_SUGGESTION,
	CLEAR_SUGGESTION,
}

const DEFAULT: State = {
	mode: 'txt',
	prompt: {
		q: '',
		type: 'none',
	},
	cw: null,
	isCwVisible: false,
	medias: [],
	text: null,
	visibility: APP_POST_VISIBILITY.PUBLIC,
	parent: null,
	keyboardSelection: {
		start: 0,
		end: 0,
	},
	suggestions: defaultSuggestions,
};

type Actions =
	| {
			type: ACTION.SET_MODE_TEXT;
	  }
	| {
			type: ACTION.SET_MODE_EMOJI;
	  }
	| {
			type: ACTION.SET_MODE_MEDIA;
	  }
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
	  }
	| {
			type: ACTION.SET_VISIBILITY;
			payload: {
				visibility: APP_POST_VISIBILITY;
			};
	  }
	| {
			type: ACTION.TOGGLE_CW_SECTION_SHOWN;
	  }
	| {
			type: ACTION.SHOW_CW_SECTION;
	  }
	| {
			type: ACTION.HIDE_CW_SECTION;
	  }
	| {
			type: ACTION.SET_PARENT;
			payload: {
				item: AppPostObject;
			};
	  }
	| {
			type: ACTION.SET_SEARCH_PROMPT;
			payload: SearchPrompt;
	  }
	| {
			type: ACTION.SET_KEYBOARD_SELECTION;
			payload: {
				start: number;
				end: number;
			};
	  }
	| {
			type: ACTION.SET_CW;
			payload: {
				content: string;
			};
	  }
	| {
			type: ACTION.SET_SUGGESTION;
			payload: Suggestion;
	  }
	| {
			type: ACTION.CLEAR_SUGGESTION;
	  }
	| {
			type: ACTION.ADD_MEDIA;
			payload: {
				item: ImagePickerAsset;
			};
	  }
	| {
			type: ACTION.UPDATE_UPLOAD_STATUS;
	  }
	| {
			type: ACTION.UPDATE_CW_STATUS;
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.SET_MODE_TEXT: {
			return produce(state, (draft) => {
				draft.mode = 'txt';
			});
		}
		case ACTION.SET_MODE_EMOJI: {
			return produce(state, (draft) => {
				draft.mode = 'emoji';
			});
		}
		case ACTION.SET_MODE_MEDIA: {
			return produce(state, (draft) => {
				draft.mode = 'media';
			});
		}
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
				draft.mode = 'emoji';
			});
		}
		case ACTION.SWITCH_TO_TEXT_TAB: {
			return produce(state, (draft) => {
				draft.mode = 'txt';
			});
		}
		case ACTION.SWITCH_TO_MEDIA_TAB: {
			return produce(state, (draft) => {
				draft.mode = 'media';
			});
		}
		case ACTION.SET_VISIBILITY: {
			return produce(state, (draft) => {
				draft.visibility = action.payload.visibility;
			});
		}
		case ACTION.TOGGLE_CW_SECTION_SHOWN: {
			return produce(state, (draft) => {
				draft.isCwVisible = !draft.isCwVisible;
			});
		}
		case ACTION.SHOW_CW_SECTION: {
			return produce(state, (draft) => {
				draft.isCwVisible = true;
			});
		}
		case ACTION.HIDE_CW_SECTION: {
			return produce(state, (draft) => {
				draft.isCwVisible = false;
			});
		}
		case ACTION.SET_PARENT: {
			if (!action.payload.item) return state;
			return produce(state, (draft) => {
				draft.parent = action.payload.item;
			});
		}
		case ACTION.SET_SEARCH_PROMPT: {
			return produce(state, (draft) => {
				draft.prompt = action.payload;
			});
		}
		case ACTION.SET_KEYBOARD_SELECTION: {
			return produce(state, (draft) => {
				draft.keyboardSelection = action.payload;
			});
		}
		case ACTION.SET_CW: {
			return produce(state, (draft) => {
				draft.cw = action.payload.content;
			});
		}
		case ACTION.SET_SUGGESTION: {
			return produce(state, (draft) => {
				draft.suggestions = action.payload;
			});
		}
		case ACTION.CLEAR_SUGGESTION: {
			return produce(state, (draft) => {
				draft.suggestions = defaultSuggestions;
			});
		}
		case ACTION.ADD_MEDIA: {
			return produce(state, (draft) => {
				draft.medias.push({
					status: 'idle',
					cwSyncStatus: 'idle',
					previewUrl: null,
					remoteId: null,
					url: null,
					localUri: action.payload.item.uri,
					localCw: null,
					remoteCw: null,
					mimeType: action.payload.item.mimeType,
				});
			});
		}
		default: {
			return state;
		}
	}
}

type PostComposerDispatchType = Dispatch<Actions>;

export {
	reducer as postComposerReducer,
	DEFAULT as postComposerReducerDefault,
	State as PostComposerReducerStateType,
	ACTION as PostComposerReducerActionType,
	Actions as postComposerReducerActions,
	PostComposerDispatchType,
};
