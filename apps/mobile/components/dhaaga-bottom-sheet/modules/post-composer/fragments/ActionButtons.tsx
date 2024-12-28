import { Fragment, memo } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useComposerContext } from '../api/useComposerContext';
import ComposerAutoCompletion from './ComposerAutoCompletion';
import VisibilityPicker from './VisibilityPicker';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';
import { PostComposerReducerActionType } from '../../../../../states/reducers/post-composer.reducer';

/**
 * The buttons at bottom row of
 * the composer sheet
 */
const ActionButtons = memo(() => {
	const { theme } = useAppTheme();
	const { dispatch, setCwShown, cw } = useComposerContext();

	function toggleCwShown() {
		setCwShown((o) => !o);
	}

	function onCustomEmojiClicked() {
		dispatch({
			type: PostComposerReducerActionType.SWITCH_TO_EMOJI_TAB,
		});
	}

	return (
		<Fragment>
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
		</Fragment>
	);
});
export default ActionButtons;
