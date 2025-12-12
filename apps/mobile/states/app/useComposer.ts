import { useComposerCtx } from '#/features/composer/contexts/useComposerCtx';
import type { CustomEmojiObjectType, UserObjectType } from '@dhaaga/bridge';
import { PostComposerReducerActionType } from '#/features/composer/reducers/composer.reducer';
import TextEditorService from '#/services/text-editor.service';
import { useAppBottomSheet, useAppPublishers } from '#/states/global/hooks';
import { useEffect } from 'react';
import useAutoSuggestion from '#/features/composer/interactors/useAutoSuggestion';

function useComposer() {
	const { ctx, stateId } = useAppBottomSheet();
	const { state, dispatch } = useComposerCtx();
	const { postEventBus } = useAppPublishers();
	useAutoSuggestion(state, dispatch);

	// set parent post (if any)
	useEffect(() => {
		const postId = ctx?.$type === 'compose-reply' ? ctx.parentPostId : null;

		dispatch({
			type: PostComposerReducerActionType.SET_PARENT,
			payload: {
				item: postId ? postEventBus.read(postId) : null,
			},
		});
	}, [stateId]);

	function onAcctAutofill(item: UserObjectType) {
		dispatch({
			type: PostComposerReducerActionType.SET_TEXT,
			payload: {
				content: TextEditorService.autoCompleteHandler(
					state.text,
					item.handle,
					state.keyboardSelection,
				),
			},
		});
		dispatch({
			type: PostComposerReducerActionType.CLEAR_SEARCH_PROMPT,
		});
	}

	function onEmojiAutofill(item: CustomEmojiObjectType) {
		dispatch({
			type: PostComposerReducerActionType.SET_TEXT,
			payload: {
				content: TextEditorService.autoCompleteReaction(
					state.text,
					item.shortCode,
					state.keyboardSelection,
				),
			},
		});
		dispatch({
			type: PostComposerReducerActionType.CLEAR_SEARCH_PROMPT,
		});
	}

	function toHome() {
		dispatch({
			type: PostComposerReducerActionType.SWITCH_TO_TEXT_TAB,
		});
	}

	return { state, toHome, onAcctAutofill, onEmojiAutofill };
}

export default useComposer;
