import { Fragment, memo, useCallback } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import { useComposerContext } from '../api/useComposerContext';

const TextModeActionButtons = memo(() => {
	const { cw, setCwShown, setEditMode } = useComposerContext();
	function onCustomEmojiClicked() {
		setEditMode((o) => {
			if (o === 'txt') return 'emoji';
		});
	}
	const toggleCwShown = useCallback(() => {
		setCwShown((o) => !o);
	}, []);

	return (
		<Fragment>
			<TouchableOpacity onPress={onCustomEmojiClicked} style={{ width: 32 }}>
				<FontAwesome6 name="smile" size={24} color={APP_FONT.MONTSERRAT_BODY} />
			</TouchableOpacity>
			<TouchableOpacity
				style={{ marginLeft: 12, width: 32 }}
				onPress={toggleCwShown}
			>
				<FontAwesome
					name="warning"
					size={24}
					color={
						cw === '' ? APP_FONT.MONTSERRAT_BODY : APP_THEME.COLOR_SCHEME_C
					}
				/>
			</TouchableOpacity>
		</Fragment>
	);
});

/**
 * The buttons at bottom row of
 * the composer sheet
 */
const ActionButtons = memo(() => {
	const { setVisible, visible } = useAppBottomSheet();
	const { setEditMode, editMode } = useComposerContext();

	const close = useCallback(() => {
		setVisible(false);
	}, []);

	const toggleEditMode = useCallback(() => {
		setEditMode((o) => {
			if (o === 'txt') return 'alt';
			return 'txt';
		});
	}, []);

	if (!visible || editMode === 'emoji') return <View />;
	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
			}}
		>
			<TouchableOpacity style={{ width: 64 }} onPress={toggleEditMode}>
				<View
					style={{
						padding: 8,
						paddingVertical: 4,
						borderRadius: 8,
						// borderWidth: 1,
						borderColor: APP_FONT.DISABLED,
						maxWidth: 128,
					}}
				>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontFamily: APP_FONTS.INTER_700_BOLD,
							fontSize: 18,
						}}
					>
						{editMode === 'alt' ? 'TXT' : 'IMG'}
					</Text>
				</View>
			</TouchableOpacity>

			{editMode === 'txt' && <TextModeActionButtons />}

			<View style={{ flexGrow: 1, flex: 1 }} />
			<Pressable
				style={{
					// flex: 1,
					backgroundColor: APP_THEME.INVALID_ITEM_BODY,
					flexDirection: 'row',
					alignItems: 'center',
					paddingHorizontal: 12,
					borderRadius: 8,
					paddingVertical: 6,
				}}
				onTouchStart={close}
			>
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
					}}
				>
					Cancel
				</Text>
				<AntDesign
					name="close"
					size={20}
					color={APP_FONT.MONTSERRAT_BODY}
					style={{ marginLeft: 4 }}
				/>
			</Pressable>
		</View>
	);
});
export default ActionButtons;
