import { useMemo } from 'react';
import { View } from 'react-native';
import ComposerSpoiler from '#/components/dhaaga-bottom-sheet/modules/post-composer/fragments/ComposerSpoiler';
import ComposerMediaPresenter from './presenters/ComposerMediaPresenter';
import EmojiPickerBottomSheet from '#/components/dhaaga-bottom-sheet/modules/emoji-picker/EmojiPickerBottomSheet';
import ComposerTextModeMenu from '#/features/composer/components/ComposerTextModeMenu';
import TextEditorService from '#/services/text-editor.service';
import { useAppBottomSheet } from '#/states/global/hooks';
import { Emoji } from '#/components/dhaaga-bottom-sheet/modules/emoji-picker/emojiPickerReducer';
import BottomMenuPresenter from './presenters/BottomMenuPresenter';
import {
	PostComposerCtx,
	usePostComposerDispatch,
	PostComposerAction,
	usePostComposerState,
} from '@dhaaga/react';
import ComposerTextInput from './components/ComposerTextInput';
import { usePostComposerInputMode } from '#/features/composer/hooks';

function Generator() {
	const { visible } = useAppBottomSheet();
	const dispatch = usePostComposerDispatch();
	const { toTextMode } = usePostComposerInputMode();
	const state = usePostComposerState();

	function onEmojiApplied(o: Emoji) {
		dispatch({
			type: PostComposerAction.SET_TEXT,
			payload: {
				content: TextEditorService.addReactionText(state.text, o.shortCode),
			},
		});
		dispatch({
			type: PostComposerAction.SWITCH_TO_TEXT_TAB,
		});
	}

	const EditorContent = useMemo(() => {
		switch (state.mode) {
			case 'txt': {
				return (
					<View style={{ height: '100%' }}>
						<ComposerTextModeMenu />
						<ComposerSpoiler />
						<ComposerTextInput />
						<BottomMenuPresenter />
					</View>
				);
			}
			case 'emoji':
				return (
					<EmojiPickerBottomSheet
						onAccept={onEmojiApplied}
						onCancel={toTextMode}
					/>
				);
			case 'media': {
				return <ComposerMediaPresenter />;
			}
		}
	}, [state.mode]);

	return (
		<View
			style={{
				flex: 1,
				display: visible ? 'flex' : 'none',
			}}
		>
			{/*This section changes based on edit mode*/}
			{EditorContent}
		</View>
	);
}

function PostComposerSheet() {
	return (
		<PostComposerCtx>
			<Generator />
		</PostComposerCtx>
	);
}

export default PostComposerSheet;
