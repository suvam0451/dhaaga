import { produce } from 'immer';
import { APP_POST_VISIBILITY } from '../../hooks/app/useVisibility';
import { AppPostObject } from '../../types/app-post.types';
import { Dispatch } from 'react';
import {
	InstanceApi_CustomEmojiDTO,
	TagInterface,
	UserInterface,
} from '@dhaaga/bridge';
import { ImagePickerAsset } from 'expo-image-picker';

export type ThreadGateSetting =
	| { type: 'nobody' }
	| { type: 'following' }
	| { type: 'mentioned' }
	| { type: 'list'; list: string };

export type PostComposer_MediaState = {
	status: 'idle' | 'uploading' | 'uploaded' | 'failed';
	altSyncStatus: 'idle' | 'uploading' | 'uploaded' | 'failed';
	previewUrl: string | null;
	remoteId: string | null;
	url: string | null;
	localUri: string;
	localAlt: string | null;
	remoteAlt: string | null;
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

	// at proto
	visibilityRules: ThreadGateSetting[];
};

enum ACTION {
	// Modes
	SET_MODE_TEXT,
	SET_MODE_EMOJI,
	SET_MODE_MEDIA,
	SWITCH_TO_EMOJI_TAB,
	SWITCH_TO_TEXT_TAB,
	SWITCH_TO_MEDIA_TAB,
	// text content
	SET_TEXT,
	CLEAR_TEXT,
	// cw
	SET_CW,
	TOGGLE_CW_SECTION_SHOWN,
	SHOW_CW_SECTION,
	HIDE_CW_SECTION,
	// media
	ADD_MEDIA,
	REMOVE_MEDIA,
	SET_UPLOAD_STATUS,
	UPDATE_CW_STATUS,
	SET_REMOTE_CONTENT,

	// reply context
	SET_PARENT,

	SET_SEARCH_PROMPT,
	CLEAR_SEARCH_PROMPT,

	SET_VISIBILITY,

	SET_KEYBOARD_SELECTION,

	// suggestions
	SET_SUGGESTION,
	CLEAR_SUGGESTION,

	// Alt text
	SET_ALT_TEXT,
	SET_ALT_TEXT_SYNC_STATUS,
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
	visibilityRules: [],
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
			type: ACTION.SET_UPLOAD_STATUS;
			payload: {
				localUri: string;
				status: 'idle' | 'uploading' | 'uploaded' | 'failed';
			};
	  }
	| {
			type: ACTION.UPDATE_CW_STATUS;
	  }
	| {
			type: ACTION.SET_ALT_TEXT;
			payload: {
				index: number;
				text: string;
			};
	  }
	| {
			type: ACTION.SET_ALT_TEXT_SYNC_STATUS;
			payload: {
				index: number;
				status: 'uploading' | 'uploaded' | 'failed';
			};
	  }
	| {
			type: ACTION.REMOVE_MEDIA;
			payload: {
				index: number;
			};
	  }
	| {
			type: ACTION.SET_REMOTE_CONTENT;
			payload: {
				localUri: string; // identifier
				remoteId: string;
				previewUrl: string;
			};
	  }
	| {
			type: ACTION.CLEAR_SEARCH_PROMPT;
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
		case ACTION.CLEAR_SEARCH_PROMPT: {
			return produce(state, (draft) => {
				draft.prompt = {
					type: 'none',
					q: '',
				};
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
					altSyncStatus: 'idle',
					previewUrl: null,
					remoteId: null,
					url: null,
					localUri: action.payload.item.uri,
					localAlt: null,
					remoteAlt: null,
					mimeType: action.payload.item.mimeType,
				});
			});
		}
		case ACTION.SET_ALT_TEXT: {
			const _index = action.payload.index;
			const _text = action.payload.text;
			if (state.medias.length <= _index) return state;
			return produce(state, (draft) => {
				draft.medias[_index].localAlt = _text === '' ? null : _text;
				draft.medias[_index].altSyncStatus = 'idle';
			});
		}
		case ACTION.SET_ALT_TEXT_SYNC_STATUS: {
			const _index = action.payload.index;
			const _status = action.payload.status;
			if (state.medias.length <= _index) return state;
			return produce(state, (draft) => {
				draft.medias[_index].altSyncStatus = _status;
				if (_status === 'uploaded') {
					draft.medias[_index].remoteAlt = state.medias[_index].localAlt;
				}
			});
		}
		case ACTION.REMOVE_MEDIA: {
			const _index = action.payload.index;
			return produce(state, (draft) => {
				draft.medias = [
					...draft.medias.slice(0, _index),
					...draft.medias.slice(_index + 1),
				];
			});
		}
		case ACTION.SET_REMOTE_CONTENT: {
			const _index = state.medias.findIndex(
				(o) => o.localUri === action.payload.localUri,
			);
			if (_index === -1) return state;
			return produce(state, (draft) => {
				draft.medias[_index].remoteId = action.payload.remoteId;
				draft.medias[_index].previewUrl = action.payload.previewUrl;
			});
		}
		case ACTION.SET_UPLOAD_STATUS: {
			const _index = state.medias.findIndex(
				(o) => o.localUri === action.payload.localUri,
			);
			if (_index === -1) return state;
			return produce(state, (draft) => {
				draft.medias[_index].status = action.payload.status;
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
