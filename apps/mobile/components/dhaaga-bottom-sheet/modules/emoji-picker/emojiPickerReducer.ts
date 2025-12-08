import { produce } from 'immer';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import type { CustomEmojiObjectType } from '@dhaaga/bridge';
import AccountSessionManager from '#/services/session/account-session.service';

export type Emoji = {
	shortCode: string;
	url: string;
	tags: string[];
};

export type EMOJI_PICKER_STATE = {
	tagEmojiMap: Map<string, CustomEmojiObjectType[]>;
	allTags: string[];
	selectedReaction: CustomEmojiObjectType | null;
	// filter context
	searchTerm: string;
	selectedTag: string;
	// filter results
	visibleReactions: CustomEmojiObjectType[];
	// meta
	resultSize: number;
	totalSize: number;
};

export const defaultValue: EMOJI_PICKER_STATE = {
	tagEmojiMap: undefined,
	allTags: [],
	selectedReaction: null,
	// filter context
	searchTerm: '',
	selectedTag: '',
	// filter results
	visibleReactions: [],
	// meta
	resultSize: 0,
	totalSize: 0,
};

export enum EMOJI_PICKER_REDUCER_ACTION {
	INIT = 'init',
	SELECT = 'select',
	APPLY_SEARCH = 'applySearch',
	APPLY_TAG = 'applyTag',
}

function emojiPickerReducer(
	state: EMOJI_PICKER_STATE,
	action: { type: EMOJI_PICKER_REDUCER_ACTION; payload?: any },
): EMOJI_PICKER_STATE {
	switch (action.type) {
		case EMOJI_PICKER_REDUCER_ACTION.INIT: {
			const _domain = action.payload.domain;
			const _subdomain = action.payload.subdomain;
			const _acctManager: AccountSessionManager = action.payload.acctManager;
			_acctManager.loadReactions();
			const emojis = _acctManager.serverReactionCache;

			if (!emojis) {
				console.log('[INFO]: no emojis available for', _subdomain);
				return state;
			}

			return produce(state, (draft) => {
				draft.tagEmojiMap = new Map<string, CustomEmojiObjectType[]>();
				switch (_domain) {
					case KNOWN_SOFTWARE.PLEROMA:
					case KNOWN_SOFTWARE.AKKOMA: {
						for (const emoji of emojis) {
							if (
								emoji.tags !== undefined &&
								emoji.tags !== null &&
								Array.isArray(emoji.tags)
							) {
								for (let tag of emoji.tags) {
									if (tag === '') tag = '<Untagged>';
									if (draft.tagEmojiMap.has(tag)) {
										draft.tagEmojiMap.get(tag).push(emoji);
									} else {
										draft.tagEmojiMap.set(tag, [emoji]);
									}
								}
							} else {
								if (draft.tagEmojiMap.has(emoji.category)) {
									draft.tagEmojiMap.get(emoji.category).push(emoji);
								} else {
									draft.tagEmojiMap.set(emoji.category, [emoji]);
								}
							}
						}
						break;
					}
					default: {
						for (const emoji of emojis) {
							if (draft.tagEmojiMap.has(emoji.category)) {
								draft.tagEmojiMap.get(emoji.category).push(emoji);
							} else {
								draft.tagEmojiMap.set(emoji.category, [emoji]);
							}
						}
					}
				}

				// @ts-ignore-next-line
				const allTags = [...draft.tagEmojiMap.keys()];
				// @ts-ignore-next-line
				draft.allTags = allTags;
				draft.selectedTag = allTags[0];
				draft.searchTerm = '';

				// NOTE: it is possible for the emoji map to be empty
				const results = draft.tagEmojiMap.get(draft.selectedTag);

				draft.visibleReactions = results?.slice(0, 50) || [];
				draft.resultSize = draft.visibleReactions.length;
				draft.totalSize = results?.length || 0;
			});
		}
		case EMOJI_PICKER_REDUCER_ACTION.SELECT: {
			const _shortCode = action.payload.shortCode;

			return produce(state, (draft) => {
				// @ts-ignore-next-line
				for (const [k, v] of draft.tagEmojiMap) {
					// console.log(v.map((o) => o.shortCode));
					const match = v.find((o) => o.shortCode === _shortCode);
					// console.log(match);
					if (match) {
						draft.selectedReaction = match;
					}
				}
			});
		}
		case EMOJI_PICKER_REDUCER_ACTION.APPLY_SEARCH: {
			const _searchTerm = action.payload.searchTerm;

			const selectedTag = state.tagEmojiMap.get(state.selectedTag);
			if (!selectedTag) return state;

			return produce(state, (draft) => {
				const results = draft.tagEmojiMap
					.get(draft.selectedTag)
					.filter((o) => o.shortCode.includes(_searchTerm));

				draft.searchTerm = _searchTerm;
				draft.visibleReactions = results.slice(0, 50);
				draft.resultSize = draft.visibleReactions.length;
				draft.totalSize = results.length;
			});
		}
		case EMOJI_PICKER_REDUCER_ACTION.APPLY_TAG: {
			const _tag = action.payload.tag;

			return produce(state, (draft) => {
				draft.selectedTag = _tag;
				const results = draft.tagEmojiMap
					.get(draft.selectedTag)
					.filter((o) => o.shortCode.includes(draft.searchTerm));

				draft.visibleReactions = results.slice(0, 50);
				draft.resultSize = draft.visibleReactions.length;
				draft.totalSize = results.length;
			});
		}
	}
}

export default emojiPickerReducer;
