import { memo, useEffect } from 'react';
import {
	View,
	Text,
	FlatList,
	Image,
	Pressable,
	StyleSheet,
} from 'react-native';
import { useComposerContext } from '../api/useComposerContext';
import usePostComposeAutoCompletion from '../api/usePostComposeAutoCompletion';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { InstanceApi_CustomEmojiDTO, UserInterface } from '@dhaaga/bridge';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import TextEditorService from '../../../../../services/text-editor.service';
import { PostComposerReducerActionType } from '../../../../../states/reducers/post-composer.reducer';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';

const AVATAR_ICON_SIZE = 32;

const ComposerAutoCompletion = memo(() => {
	const { theme } = useAppTheme();
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
					`@${item.getUsername()}@${item.getInstanceUrl()}`,
					state.keyboardSelection,
				),
			},
		});
		dispatch({
			type: PostComposerReducerActionType.SET_SEARCH_PROMPT,
			payload: {
				type: 'none',
				q: '',
			},
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
			type: PostComposerReducerActionType.SET_SEARCH_PROMPT,
			payload: {
				type: 'none',
				q: '',
			},
		});
	}

	return (
		<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
			<Animated.View
				style={[
					{
						flexDirection: 'row',
						alignItems: 'center',
						backgroundColor: '#161616',
						borderRadius: 8,
						marginHorizontal: -6,
						width: HAS_NO_CONTENT ? 32 : 'auto',
						margin: 'auto',
						paddingHorizontal: 4,
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
});

const styles = StyleSheet.create({
	emojiText: {
		color: APP_FONT.MONTSERRAT_BODY,
		marginLeft: 4,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
});
export default ComposerAutoCompletion;
