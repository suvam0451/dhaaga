import { useEffect } from 'react';
import {
	View,
	Text,
	FlatList,
	Image,
	Pressable,
	StyleSheet,
} from 'react-native';
import { useComposerContext } from '../api/useComposerContext';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import {
	InstanceApi_CustomEmojiDTO,
	KNOWN_SOFTWARE,
	UserInterface,
} from '@dhaaga/bridge';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import TextEditorService from '../../../../../services/text-editor.service';
import { PostComposerReducerActionType } from '../../../../../states/reducers/post-composer.reducer';
import {
	useAppApiClient,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';

const AVATAR_ICON_SIZE = 32;

function ComposerAutoCompletion() {
	const { theme } = useAppTheme();
	const { driver } = useAppApiClient();
	const { state, dispatch } = useComposerContext();

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

	function onAcctAccepted(item: UserInterface) {
		dispatch({
			type: PostComposerReducerActionType.SET_TEXT,
			payload: {
				content: TextEditorService.autoCompleteHandler(
					state.text,
					driver === KNOWN_SOFTWARE.BLUESKY ||
						item.getInstanceUrl() === undefined ||
						item.getInstanceUrl() === null
						? `@${item.getUsername()}`
						: `@${item.getUsername()}@${item.getInstanceUrl()}`,
					state.keyboardSelection,
				),
			},
		});
		dispatch({
			type: PostComposerReducerActionType.CLEAR_SEARCH_PROMPT,
		});
	}

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
		<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
			<Animated.View
				style={[
					styles.autoCompletionResultAnimatedContainer,
					{
						backgroundColor: theme.background.a30,
						width: HAS_NO_CONTENT ? 32 : 'auto',
					},
					animatedContainerStyle,
				]}
			>
				<FlatList
					style={{ display: HAS_NO_CONTENT ? 'none' : 'flex' }}
					keyboardShouldPersistTaps={'always'}
					horizontal={true}
					data={state.suggestions.accounts}
					renderItem={({ item }: { item: UserInterface }) => (
						<Pressable
							style={{
								flexDirection: 'row',
								padding: 6,
								marginRight: 8,
								alignItems: 'center',
							}}
							onPress={() => {
								onAcctAccepted(item);
							}}
							focusable={false}
						>
							<View
								style={{
									borderWidth: 1,
									borderColor: 'gray',
									borderRadius: 4,
								}}
							>
								{/*@ts-ignore-next-line*/}
								<Image
									source={{
										uri: item.getAvatarUrl(),
									}}
									style={{
										width: AVATAR_ICON_SIZE,
										height: AVATAR_ICON_SIZE,
										borderRadius: 4,
									}}
								/>
							</View>
							<View>
								<Text
									style={{
										color: theme.complementary.a10,
										fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
										marginLeft: 6,
										fontSize: 15,
									}}
								>
									{item.getUsername()}
								</Text>
								<Text
									style={{
										color: theme.secondary.a30,
										fontFamily: APP_FONTS.INTER_500_MEDIUM,
										marginLeft: 6,
										fontSize: 13,
									}}
								>
									{item.getInstanceUrl()}
								</Text>
							</View>
						</Pressable>
					)}
				/>
				<FlatList
					style={{ display: HAS_NO_CONTENT ? 'none' : 'flex' }}
					keyboardShouldPersistTaps={'always'}
					horizontal={true}
					data={state.suggestions.emojis}
					renderItem={({ item }: { item: InstanceApi_CustomEmojiDTO }) => (
						<Pressable
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginRight: 6,
								padding: 4,
								backgroundColor: '#242424',
								borderRadius: 8,
							}}
							focusable={false}
							onPress={() => {
								onEmojiAccepted(item);
							}}
						>
							<Image
								source={{ uri: item.url }}
								style={{ height: 24, width: 24, opacity: 0.8 }}
							/>
							<Text
								style={[styles.emojiText, { color: theme.complementary.a0 }]}
							>
								{item.shortCode}
							</Text>
						</Pressable>
					)}
				/>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	emojiText: {
		marginLeft: 4,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
	autoCompletionResultAnimatedContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 8,
		marginHorizontal: -6,
		margin: 'auto',
		paddingHorizontal: 4,
	},
});
export default ComposerAutoCompletion;
