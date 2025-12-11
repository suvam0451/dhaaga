import { useMemo } from 'react';
import { View } from 'react-native';
import ComposerTextInput from '#/components/dhaaga-bottom-sheet/modules/post-composer/fragments/ComposerText';
import ComposerSpoiler from '#/components/dhaaga-bottom-sheet/modules/post-composer/fragments/ComposerSpoiler';
import { useComposerCtx } from '../contexts/useComposerCtx';
import ComposerMediaPresenter from './ComposerMediaPresenter';
import EmojiPickerBottomSheet from '#/components/dhaaga-bottom-sheet/modules/emoji-picker/EmojiPickerBottomSheet';
import ComposerTopMenu from '#/components/dhaaga-bottom-sheet/modules/post-composer/fragments/ComposerTopMenu';
import TextEditorService from '#/services/text-editor.service';
import { useAppBottomSheet } from '#/states/global/hooks';
import { Emoji } from '#/components/dhaaga-bottom-sheet/modules/emoji-picker/emojiPickerReducer';
import { PostComposerReducerActionType } from '../reducers/composer.reducer';
import BottomMenuPresenter from './BottomMenuPresenter';
import useComposer from '#/states/app/useComposer';

function ComposerPresenter() {
	const { visible } = useAppBottomSheet();
	const { dispatch } = useComposerCtx();
	const { state, toHome } = useComposer();

	function onEmojiApplied(o: Emoji) {
		dispatch({
			type: PostComposerReducerActionType.SET_TEXT,
			payload: {
				content: TextEditorService.addReactionText(state.text, o.shortCode),
			},
		});
		dispatch({
			type: PostComposerReducerActionType.SWITCH_TO_TEXT_TAB,
		});
	}

	const EditorContent = useMemo(() => {
		switch (state.mode) {
			case 'txt': {
				return (
					<View style={{ height: '100%' }}>
						<ComposerTopMenu />
						<ComposerSpoiler />
						<ComposerTextInput />
						<BottomMenuPresenter />
					</View>
				);
			}
			case 'emoji':
				return (
					<EmojiPickerBottomSheet onAccept={onEmojiApplied} onCancel={toHome} />
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

export default ComposerPresenter;
