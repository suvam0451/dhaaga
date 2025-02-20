import { useComposerCtx } from '../contexts/useComposerCtx';
import type { UserObjectType } from '@dhaaga/core';
import { PostComposerReducerActionType } from '../reducers/composer.reducer';
import TextEditorService from '../../../services/text-editor.service';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/bridge';
import {
	useAppBottomSheet,
	useAppPublishers,
} from '../../../hooks/utility/global-state-extractors';
import { useEffect } from 'react';
import useAutoSuggestion from './useAutoSuggestion';

function useComposer() {
	const { visible, ctx, stateId } = useAppBottomSheet();
	const { state, dispatch } = useComposerCtx();
	const { postPub } = useAppPublishers();
	useAutoSuggestion(state, dispatch);

	useEffect(() => {
		if (!visible) return;

		if (ctx.uuid && postPub.readCache(ctx.uuid)) {
			// set parent post
			dispatch({
				type: PostComposerReducerActionType.SET_PARENT,
				payload: {
					item: postPub.readCache(ctx.uuid),
				},
			});
		} else {
			// clear parent post
			dispatch({
				type: PostComposerReducerActionType.SET_PARENT,
				payload: {
					item: null,
				},
			});
		}
	}, [stateId, ctx, visible]);

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

	function onEmojiAutofill(item: InstanceApi_CustomEmojiDTO) {
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
