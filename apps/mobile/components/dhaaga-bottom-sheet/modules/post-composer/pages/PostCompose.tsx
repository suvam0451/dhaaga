import { memo, useMemo } from 'react';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import { ScrollView, StyleSheet, View } from 'react-native';
import { APP_FONT } from '../../../../../styles/AppTheme';
import ComposerTextInput from '../fragments/ComposerText';
import ActionButtons from '../fragments/ActionButtons';
import ComposerSpoiler from '../fragments/ComposerSpoiler';
import { useComposerContext } from '../api/useComposerContext';
import ComposerAlt from '../fragments/ComposerAlt';
import EmojiPickerBottomSheet from '../../emoji-picker/EmojiPickerBottomSheet';
import ComposerTopMenu from '../fragments/ComposerTopMenu';
import TextEditorService from '../../../../../services/text-editor.service';

type PostComposeProps = {
	requestId: string;
};
const PostCompose = memo(({}: PostComposeProps) => {
	const { visible } = useAppBottomSheet();
	const { editMode, setEditMode, setRawText } = useComposerContext();

	const EditorContent = useMemo(() => {
		switch (editMode) {
			case 'txt': {
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
					</ScrollView>
				);
			}
		}
	}, [editMode]);
	return (
		<View
			style={[
				styles.bottomSheetContentContainer,
				{ display: visible ? 'flex' : 'none' },
			]}
		>
			<ComposerTopMenu />
			{/*This section changes based on edit mode*/}
			{EditorContent}
			<ActionButtons />
		</View>
	);
});

const styles = StyleSheet.create({
	textInput: {
		textDecorationLine: 'none',
		textDecorationStyle: undefined,
		width: '100%',
		paddingVertical: 16,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		paddingBottom: 13,
	},
	rootContainer: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8,
		backgroundColor: '#2C2C2C',
	},
	bottomSheetContentContainer: {
		padding: 16,
		paddingTop: 0,
		height: '100%',
	},
	avatarContainer: {
		height: 48,
		width: 48,
		borderRadius: 8,
		opacity: 0.87,
	},
});

export default PostCompose;
