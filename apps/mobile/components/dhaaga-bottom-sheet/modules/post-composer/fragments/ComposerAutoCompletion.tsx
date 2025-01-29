import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useComposerCtx } from '../../../../../features/composer/contexts/useComposerCtx';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/bridge';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import TextEditorService from '../../../../../services/text-editor.service';
import { PostComposerReducerActionType } from '../../../../../states/interactors/post-composer.reducer';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';

function ComposerAutoCompletion() {
	const { theme } = useAppTheme();
	const { state, dispatch } = useComposerCtx();

	const available = useSharedValue(0);

	const HAS_NO_CONTENT =
		state.suggestions.accounts.length === 0 &&
		state.suggestions.emojis.length === 0 &&
		state.suggestions.hashtags.length === 0;

	useEffect(() => {
		if (HAS_NO_CONTENT) {
			available.value = withSpring(0);
		}
		available.value = withSpring(1);
	}, [state.suggestions]);

	const animatedContainerStyle = useAnimatedStyle(() => {
		return {
			marginVertical: available.value * 8,
			paddingVertical: available.value * 4,
		};
	});

	function onEmojiAccepted(item: InstanceApi_CustomEmojiDTO) {
		dispatch({
			type: PostComposerReducerActionType.SET_TEXT,
			payload: {
				content: TextEditorService.autoCompleteReaction(
					state.text,
					item.shortCode,
					state.keyboardSelection,
				),
			},
		});
		dispatch({
			type: PostComposerReducerActionType.CLEAR_SEARCH_PROMPT,
		});
	}

	return (
		<Animated.View
			style={[
				styles.autoCompletionResultAnimatedContainer,
				{
					backgroundColor: theme.background.a30,
					width: HAS_NO_CONTENT ? 32 : 'auto',
				},
				animatedContainerStyle,
			]}
		></Animated.View>
	);
}

const styles = StyleSheet.create({
	emojiText: {
		marginLeft: 4,
		fontFamily: APP_FONTS.ROBOTO_500,
	},
	autoCompletionResultAnimatedContainer: {
		borderRadius: 8,
		paddingHorizontal: 4,
		marginHorizontal: 6,
	},
});

export default ComposerAutoCompletion;
