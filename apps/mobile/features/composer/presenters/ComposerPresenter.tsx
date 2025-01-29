import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ComposerTextInput from '../../../components/dhaaga-bottom-sheet/modules/post-composer/fragments/ComposerText';
import ComposerSpoiler from '../../../components/dhaaga-bottom-sheet/modules/post-composer/fragments/ComposerSpoiler';
import { useComposerCtx } from '../contexts/useComposerCtx';
import ComposerMediaPresenter from './ComposerMediaPresenter';
import EmojiPickerBottomSheet from '../../../components/dhaaga-bottom-sheet/modules/emoji-picker/EmojiPickerBottomSheet';
import ComposerTopMenu from '../../../components/dhaaga-bottom-sheet/modules/post-composer/fragments/ComposerTopMenu';
import TextEditorService from '../../../services/text-editor.service';
import {
	useAppBottomSheet_Improved,
	useAppPublishers,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { Emoji } from '../../../components/dhaaga-bottom-sheet/modules/emoji-picker/emojiPickerReducer';
import { PostComposerReducerActionType } from '../../../states/interactors/post-composer.reducer';
import BottomMenuPresenter from './BottomMenuPresenter';

function ComposerPresenter() {
	const { visible, ctx, stateId } = useAppBottomSheet_Improved();
	const { state, dispatch } = useComposerCtx();
	const { theme } = useAppTheme();
	const { postPub } = useAppPublishers();

	useEffect(() => {
		if (!visible) return;
		if (ctx.uuid && postPub.readCache(ctx.uuid)) {
			dispatch({
				type: PostComposerReducerActionType.SET_PARENT,
				payload: {
					item: postPub.readCache(ctx.uuid),
				},
			});
		} else {
			dispatch({
				type: PostComposerReducerActionType.SET_PARENT,
				payload: {
					item: null,
				},
			});
		}
	}, [stateId, ctx, visible]);

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

	function onCancelFromAuxTab() {
		dispatch({
			type: PostComposerReducerActionType.SWITCH_TO_TEXT_TAB,
		});
	}

	const EditorContent = useMemo(() => {
		switch (state.mode) {
			case 'txt': {
				return (
					<View style={{ height: '100%' }}>
						<ScrollView>
							<ComposerTopMenu />
							<ComposerSpoiler />
							<ComposerTextInput />
						</ScrollView>
						<BottomMenuPresenter />
					</View>
				);
			}
			case 'emoji':
				return (
					<EmojiPickerBottomSheet
						onAccept={onEmojiApplied}
						onCancel={onCancelFromAuxTab}
					/>
				);
			case 'media': {
				return <ComposerMediaPresenter />;
			}
		}
	}, [state.mode, theme]);

	return (
		<View
			style={[
				styles.root,
				{
					display: visible ? 'flex' : 'none',
				},
			]}
		>
			{/*This section changes based on edit mode*/}
			{EditorContent}
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
});

export default ComposerPresenter;
