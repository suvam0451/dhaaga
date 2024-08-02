import { memo, useEffect } from 'react';
import {
	KeyboardAvoidingView,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Pressable,
	Platform,
	ScrollView,
} from 'react-native';
import { APP_FONT, APP_THEME } from '../../styles/AppTheme';
import { useAppBottomSheet } from '../../hooks/app/useAppBottomSheet';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import { Image } from 'expo-image';
import { APP_FONTS } from '../../styles/AppFonts';
import VisibilityPicker from './modules/post-composer/fragments/VisibilityPicker';
import ComposerTextInput from './modules/post-composer/fragments/ComposerText';
import WithComposerContext from './modules/post-composer/api/useComposerContext';
import ComposerAutoCompletion from './modules/post-composer/fragments/ComposerAutoCompletion';
import { FONT_TYPES } from 'expo-asset/plugin/build/utils';
import AntDesign from '@expo/vector-icons/AntDesign';

const POST_COMPOSE_HEIGHT_MAX = 320;

const AppBottomSheetCore = memo(() => {
	const { me } = useActivityPubRestClientContext();
	const { visible, setVisible } = useAppBottomSheet();

	const height = useSharedValue(0);

	useEffect(() => {
		if (!visible) {
			height.value = withTiming(0, { duration: 100 });
		} else {
			height.value = withSpring(POST_COMPOSE_HEIGHT_MAX, {
				duration: 2000,
				dampingRatio: 0.55,
				stiffness: 500,
				overshootClamping: false,
			});
		}
	}, [visible]);

	const containerStyle = useAnimatedStyle(() => {
		return {
			height: height.value,
		};
	});

	function close() {
		setVisible(false);
	}

	async function handleExpoFilePicker() {}

	function onCustomEmojiClicked() {}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<View style={styles.rootContainer}>
				<Animated.View style={containerStyle}>
					<View
						style={[
							styles.bottomSheetContentContainer,
							{ display: visible ? 'flex' : 'none' },
						]}
					>
						<ComposerAutoCompletion />
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							{/*<AnimatedKeyboardAvoidingView>*/}
							<View style={{ width: 48, height: 48 }}>
								{/*@ts-ignore-next-line*/}
								<Image
									source={me?.getAvatarUrl()}
									style={{
										height: 48,
										width: 48,
										borderRadius: 8,
										opacity: 0.87,
									}}
								/>
							</View>
							<View
								style={{
									paddingHorizontal: 4,
									maxWidth: 256,
									marginLeft: 4,
									flex: 1,
								}}
							>
								<VisibilityPicker />
								<Text
									style={{
										color: APP_FONT.MONTSERRAT_BODY,
										fontSize: 11.5,
										fontFamily: APP_FONTS.INTER_500_MEDIUM,
										opacity: 0.8,
									}}
								>
									@{me?.getUsername()}
								</Text>
							</View>
							<View style={{ flexGrow: 1 }} />
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'flex-end',
									alignItems: 'center',
									flex: 1,
								}}
							>
								<View style={{ padding: 8, marginRight: 6 }}>
									<FontAwesome6
										name="binoculars"
										size={22}
										color={APP_FONT.MONTSERRAT_BODY}
									/>
								</View>

								<View
									style={{
										backgroundColor: APP_THEME.REPLY_THREAD_COLOR_SWATCH[0],
										flexDirection: 'row',
										alignItems: 'center',
										paddingHorizontal: 12,
										borderRadius: 8,
										paddingVertical: 6,
									}}
								>
									<Text
										style={{
											color: APP_FONT.MONTSERRAT_BODY,
											fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
										}}
									>
										Post
									</Text>
									<FontAwesome
										name="send"
										size={20}
										style={{ marginLeft: 8 }}
										color={APP_FONT.MONTSERRAT_BODY}
									/>
								</View>
							</View>
						</View>

						<ComposerTextInput />

						<View style={{ flexGrow: 1, flex: 1 }} />
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<TouchableOpacity
								onPress={handleExpoFilePicker}
								style={{ width: 32 }}
							>
								<FontAwesome
									name="image"
									size={24}
									color={APP_FONT.MONTSERRAT_BODY}
								/>
							</TouchableOpacity>
							<TouchableOpacity style={{ marginLeft: 12, width: 32 }}>
								<FontAwesome
									name="warning"
									size={24}
									color={APP_FONT.MONTSERRAT_BODY}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={onCustomEmojiClicked}
								style={{ marginLeft: 8, width: 32 }}
							>
								<FontAwesome6
									name="smile"
									size={24}
									color={APP_FONT.MONTSERRAT_BODY}
								/>
							</TouchableOpacity>
							<TouchableOpacity style={{ marginLeft: 4 }}>
								<View
									style={{
										padding: 8,
										paddingVertical: 4,
										borderRadius: 8,
										// borderWidth: 1,
										borderColor: APP_FONT.DISABLED,
									}}
								>
									<Text
										style={{
											color: APP_FONT.MONTSERRAT_BODY,
											fontFamily: APP_FONTS.INTER_700_BOLD,
											fontSize: 18,
										}}
									>
										ALT
									</Text>
								</View>
							</TouchableOpacity>

							<View style={{ flexGrow: 1 }} />
							<Pressable
								style={{
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
					</View>
				</Animated.View>
			</View>
		</KeyboardAvoidingView>
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
		paddingTop: 8,
		height: '100%',
	},
});

function AppBottomSheet() {
	return (
		<WithComposerContext>
			<AppBottomSheetCore />
		</WithComposerContext>
	);
}

export default AppBottomSheet;
