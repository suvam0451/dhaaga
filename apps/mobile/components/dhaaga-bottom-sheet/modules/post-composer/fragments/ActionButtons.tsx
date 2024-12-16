import { Fragment, memo, useCallback } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { APP_THEME } from '../../../../../styles/AppTheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { useComposerContext } from '../api/useComposerContext';
import { AppIcon } from '../../../../lib/Icon';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const TextModeActionButtons = memo(() => {
	const { cw, setCwShown, setEditMode } = useComposerContext();
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

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
				<FontAwesome6 name="smile" size={24} color={theme.textColor.medium} />
			</TouchableOpacity>
			<TouchableOpacity
				style={{ marginLeft: 12, width: 32 }}
				onPress={toggleCwShown}
			>
				<FontAwesome
					name="warning"
					size={24}
					color={cw === '' ? theme.textColor.medium : APP_THEME.COLOR_SCHEME_C}
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
	const { hide, visible, theme } = useGlobalState(
		useShallow((o) => ({
			visible: o.bottomSheet.visible,
			hide: o.bottomSheet.hide,
			theme: o.colorScheme,
		})),
	);
	const { setEditMode, editMode } = useComposerContext();
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
						maxWidth: 128,
					}}
				>
					<Text
						style={{
							color: theme.textColor.medium,
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
					backgroundColor: APP_THEME.INVALID_ITEM_BODY,
					flexDirection: 'row',
					alignItems: 'center',
					paddingHorizontal: 12,
					borderRadius: 8,
					paddingVertical: 6,
				}}
				onTouchStart={hide}
			>
				<Text
					style={{
						color: theme.textColor.high,
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
					}}
				>
					Cancel
				</Text>
				<AppIcon
					id={'clear'}
					size={20}
					iconStyle={{ marginLeft: 4 }}
					emphasis={'high'}
				/>
			</Pressable>
		</View>
	);
});
export default ActionButtons;
