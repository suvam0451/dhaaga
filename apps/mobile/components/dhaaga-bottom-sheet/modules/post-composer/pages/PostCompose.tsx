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
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const PostCompose = memo(() => {
	const { visible } = useGlobalState(
		useShallow((o) => ({
			visible: o.bottomSheet.visible,
		})),
	);
	const { editMode, setEditMode, setRawText } = useComposerContext();
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	const EditorContent = useMemo(() => {
		switch (editMode) {
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
							setEditMode('txt');
						}}
						onSelect={async (shortCode: string) => {
							setRawText((o) =>
								TextEditorService.addReactionText(o, shortCode),
							);
							setEditMode('txt');
						}}
					/>
				);
			}
			case 'alt': {
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
	}, [editMode, theme]);

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
