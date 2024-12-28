import { memo, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useComposerContext } from '../api/useComposerContext';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import ComposerAutoCompletion from './ComposerAutoCompletion';
import VisibilityPicker from './VisibilityPicker';

/**
 * The buttons at bottom row of
 * the composer sheet
 */
const ActionButtons = memo(() => {
	const { visible, theme } = useGlobalState(
		useShallow((o) => ({
			visible: o.bottomSheet.visible,
			theme: o.colorScheme,
		})),
	);
	const { setEditMode, editMode, setCwShown, cw } = useComposerContext();

	const toggleEditMode = useCallback(() => {
		setEditMode((o) => {
			if (o === 'txt') return 'alt';
			return 'txt';
		});
	}, []);

	function toggleCwShown() {
		setCwShown((o) => !o);
	}

	function onCustomEmojiClicked() {
		setEditMode((o) => {
			if (o === 'txt') return 'emoji';
		});
	}

	if (!visible || editMode === 'emoji') return <View />;
	return (
		<View
			style={{
				display: 'flex',
			}}
		>
			<ComposerAutoCompletion />
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<View style={{ flexDirection: 'row', flex: 1 }}>
					<View style={{ paddingHorizontal: 6 }}>
						<Ionicons name="images" size={26} color={theme.secondary.a20} />
					</View>
					<Pressable style={{ paddingHorizontal: 6 }} onPress={toggleCwShown}>
						<Ionicons
							name="warning"
							size={26}
							color={cw === '' ? theme.secondary.a20 : theme.complementary.a0}
						/>
					</Pressable>
					<Pressable
						style={{
							paddingHorizontal: 6,
						}}
						onPress={onCustomEmojiClicked}
					>
						<Ionicons name={'happy'} size={26} color={theme.secondary.a20} />
					</Pressable>
				</View>
				<VisibilityPicker />
			</View>
		</View>
	);
});
export default ActionButtons;
