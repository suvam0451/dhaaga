import { PostComposerAction, usePostComposerDispatch } from '@dhaaga/react';

function useComposerInputMode() {
	const dispatch = usePostComposerDispatch();

	function toTextMode() {
		dispatch({
			type: PostComposerAction.SWITCH_TO_TEXT_TAB,
		});
	}

	function toMediaMode() {}

	function toEmojiMode() {}

	function toGifMode() {}

	function onPressMediaTab() {
		dispatch({
			type: PostComposerAction.SWITCH_TO_MEDIA_TAB,
		});
	}

	function onPressEmojiTab() {
		dispatch({
			type: PostComposerAction.SWITCH_TO_EMOJI_TAB,
		});
	}

	function onPressContentWarningButton() {
		dispatch({
			type: PostComposerAction.TOGGLE_CW_SECTION_SHOWN,
		});
	}

	return {
		toTextMode,
		toMediaMode,
		toEmojiMode,
		toGifMode,
		onPressMediaTab,
		onPressEmojiTab,
		onPressContentWarningButton,
	};
}

export default useComposerInputMode;
