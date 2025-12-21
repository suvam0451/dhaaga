import { useMemo } from 'react';
import { View } from 'react-native';
import ComposerSpoiler from '#/components/dhaaga-bottom-sheet/modules/post-composer/fragments/ComposerSpoiler';
import ComposerMediaModeView from './views/ComposerMediaModeView';
import EmojiPickerBottomSheet from '#/components/dhaaga-bottom-sheet/modules/emoji-picker/EmojiPickerBottomSheet';
import ComposerTextModeMenu from '#/features/composer/components/ComposerTextModeMenu';
import TextEditorService from '#/services/text-editor.service';
import { useAppBottomSheet } from '#/states/global/hooks';
import { Emoji } from '#/components/dhaaga-bottom-sheet/modules/emoji-picker/emojiPickerReducer';
import BottomMenuView from './views/BottomMenuView';
import {
	PostComposerCtx,
	usePostComposerDispatch,
	PostComposerAction,
	usePostComposerState,
} from '@dhaaga/react';
import ComposerTextInput from './components/ComposerTextInput';
import useComposerInputMode from '#/features/composer/hooks/useComposerInputMode';

function Generator() {
	const { visible } = useAppBottomSheet();
	const dispatch = usePostComposerDispatch();
	const { toTextMode } = useComposerInputMode();
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
						<BottomMenuView />
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
				return <ComposerMediaModeView />;
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
