import { useComposerCtx } from '../contexts/useComposerCtx';
import { AppUserObject } from '../../../types/app-user.types';
import { PostComposerReducerActionType } from '../../../states/interactors/post-composer.reducer';
import TextEditorService from '../../../services/text-editor.service';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/bridge';

function useComposer() {
	const { state, dispatch } = useComposerCtx();

	function onAcctAutofill(item: AppUserObject) {
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
