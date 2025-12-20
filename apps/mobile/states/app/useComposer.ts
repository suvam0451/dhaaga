import type { CustomEmojiObjectType, UserObjectType } from '@dhaaga/bridge';
import TextEditorService from '#/services/text-editor.service';
import { useAppBottomSheet, useAppPublishers } from '#/states/global/hooks';
import { useEffect } from 'react';
import useAutoSuggestion from '#/features/composer/interactors/useAutoSuggestion';
import {
	usePostComposerDispatch,
	usePostComposerState,
	PostComposerAction,
} from '@dhaaga/react';

function useComposer() {
	const { ctx, stateId } = useAppBottomSheet();
	const state = usePostComposerState();
	const dispatch = usePostComposerDispatch();
	const { postEventBus } = useAppPublishers();
	useAutoSuggestion(state, dispatch);

	// set parent post (if any)
	useEffect(() => {
		const postId = ctx?.$type === 'compose-reply' ? ctx.parentPostId : null;

		dispatch({
			type: PostComposerAction.SET_PARENT,
			payload: {
				item: postId ? postEventBus.read(postId) : null,
			},
		});
	}, [stateId]);

	function onAcctAutofill(item: UserObjectType) {
		dispatch({
			type: PostComposerAction.SET_TEXT,
			payload: {
				content: TextEditorService.autoCompleteHandler(
					state.text,
					item.handle,
					state.keyboardSelection,
				),
			},
		});
		dispatch({
			type: PostComposerAction.CLEAR_SEARCH_PROMPT,
		});
	}

	function onEmojiAutofill(item: CustomEmojiObjectType) {
		dispatch({
			type: PostComposerAction.SET_TEXT,
			payload: {
				content: TextEditorService.autoCompleteReaction(
					state.text,
					item.shortCode,
					state.keyboardSelection,
				),
			},
		});
		dispatch({
			type: PostComposerAction.CLEAR_SEARCH_PROMPT,
		});
	}

	function toHome() {
		dispatch({
			type: PostComposerAction.SWITCH_TO_TEXT_TAB,
		});
	}

	return { state, toHome, onAcctAutofill, onEmojiAutofill };
}

export default useComposer;
