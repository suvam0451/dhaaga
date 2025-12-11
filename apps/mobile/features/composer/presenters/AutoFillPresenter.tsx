import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
} from 'react-native-reanimated';
import { useAppTheme } from '#/states/global/hooks';
import SuggestedUserListView from '../views/SuggestedUserListView';
import SuggestedEmojiListView from '../views/SuggestedEmojiListView';
import useComposer from '#/states/app/useComposer';

function AutoFillPresenter() {
	const { theme } = useAppTheme();
	const { state, onAcctAutofill, onEmojiAutofill } = useComposer();

	const available = useSharedValue(0);
	const animatedContainerStyle = useAnimatedStyle(() => {
		return {
			marginVertical: available.value * 8,
			paddingVertical: available.value * 4,
		};
	});

	const ResultView = useMemo(() => {
		switch (state.prompt.type) {
			case 'acct':
				return (
					<SuggestedUserListView
						suggestions={state.suggestions.accounts}
						onPick={onAcctAutofill}
					/>
				);
			case 'emoji':
				return (
					<SuggestedEmojiListView
						suggestions={state.suggestions.emojis}
						onPick={onEmojiAutofill}
					/>
				);
			default:
				return <View />;
		}
	}, [state.suggestions, state.prompt]);

	const HAS_NO_CONTENT =
		state.suggestions.accounts.length === 0 &&
		state.suggestions.emojis.length === 0 &&
		state.suggestions.hashtags.length === 0;

	return (
		<View style={{ marginHorizontal: 'auto' }}>
			<Animated.View
				style={[
					styles.root,
					{
						backgroundColor: theme.background.a30,
						width: HAS_NO_CONTENT ? 32 : 'auto',
					},
					animatedContainerStyle,
				]}
			>
				{ResultView}
			</Animated.View>
		</View>
	);
}

export default AutoFillPresenter;

const styles = StyleSheet.create({
	root: {
		borderRadius: 8,
		paddingHorizontal: 4,
		marginHorizontal: 6,
		marginBottom: 8,
	},
});
