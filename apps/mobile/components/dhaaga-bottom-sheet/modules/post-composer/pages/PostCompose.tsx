import { memo, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ComposerTextInput from '../fragments/ComposerText';
import ActionButtons from '../fragments/ActionButtons';
import ComposerSpoiler from '../fragments/ComposerSpoiler';
import { useComposerContext } from '../api/useComposerContext';
import ComposerAlt from '../fragments/ComposerAlt';
import EmojiPickerBottomSheet from '../../emoji-picker/EmojiPickerBottomSheet';
import ComposerTopMenu from '../fragments/ComposerTopMenu';
import TextEditorService from '../../../../../services/text-editor.service';
import {
	useAppBottomSheet_Improved,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { PostComposerReducerActionType } from '../../../../../states/reducers/post-composer.reducer';

const PostCompose = memo(() => {
	const { visible } = useAppBottomSheet_Improved();
	const { state, dispatch } = useComposerContext();
	const { theme } = useAppTheme();

	const EditorContent = useMemo(() => {
		switch (state.mode) {
			case 'txt': {
				return (
					<ScrollView>
						<ComposerTopMenu />
						<ComposerSpoiler />
						<ComposerTextInput />
					</ScrollView>
				);
			}
			case 'emoji': {
				return (
					<EmojiPickerBottomSheet
						onCancel={() => {
							dispatch({
								type: PostComposerReducerActionType.SWITCH_TO_TEXT_TAB,
							});
						}}
						onSelect={async (shortCode: string) => {
							dispatch({
								type: PostComposerReducerActionType.SET_TEXT,
								payload: {
									content: TextEditorService.addReactionText(
										state.text,
										shortCode,
									),
								},
							});
							dispatch({
								type: PostComposerReducerActionType.SWITCH_TO_TEXT_TAB,
							});
						}}
					/>
				);
			}
			case 'media': {
				return (
					<ScrollView
						style={{
							flexGrow: 1,
							display: 'flex',
							flexDirection: 'column',
						}}
						contentContainerStyle={{
							flexGrow: 1,
						}}
					>
						<ComposerAlt />
						<ActionButtons />
					</ScrollView>
				);
			}
		}
	}, [state.mode, theme]);

	return (
		<View
			style={[
				styles.bottomSheetContentContainer,
				{
					display: visible ? 'flex' : 'none',
					backgroundColor: theme.palette.menubar,
					position: 'relative',
				},
			]}
		>
			{/*This section changes based on edit mode*/}
			{EditorContent}
			<ActionButtons />
		</View>
	);
});

const styles = StyleSheet.create({
	bottomSheetContentContainer: {
		padding: 16,
		paddingHorizontal: 10,
		paddingTop: 0,
		height: '100%',
	},
});

export default PostCompose;
