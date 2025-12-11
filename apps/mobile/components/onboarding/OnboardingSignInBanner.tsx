import { View, StyleSheet } from 'react-native';
import { Asset, useAssets } from 'expo-asset';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '#/states/global/hooks';
import { AppText } from '../lib/Text';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { AppButtonVariantA } from '../lib/Buttons';
import { HideWhileKeyboardActive } from '#/ui/Containers';

type OnboardingCtaBannerProps = {
	titleText: string;
	descText: string;
	descExternalOnPress: () => void;
	softwareLogoAsset: Asset;
	platformSelected: boolean;
	onPlatformSelectionReset: () => void;
};

const ANIM_DISTANCE = 72;
const ANIM_FINAL_SIZE = 0.95;
function OnboardingSignInBanner({
	titleText,
	descText,
	descExternalOnPress,
	softwareLogoAsset,
	platformSelected = true,
	onPlatformSelectionReset,
}: OnboardingCtaBannerProps) {
	const [assets, error] = useAssets([require('#/assets/dhaaga/icon.png')]);
	const { theme } = useAppTheme();
	const split = useSharedValue(0); // 0 = singles, 1 = split

	function onPlatformReset() {
		if (onPlatformSelectionReset) onPlatformSelectionReset();
	}

	useEffect(() => {
		split.value = platformSelected ? 1 : 0; // toggle
	}, [platformSelected]);

	const shiftLeft: any = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: withSpring(split.value * ANIM_DISTANCE) }, // move left
				{ scale: withSpring(split.value === 1 ? ANIM_FINAL_SIZE : 1) },
			],
			opacity: withSpring(1),
		} as any;
	});

	const shiftRight: any = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: withSpring(-split.value * ANIM_DISTANCE) }, // move right
				{ scale: withSpring(split.value === 1 ? ANIM_FINAL_SIZE : 1) },
			],
			opacity: withSpring(split.value === 1 ? 1 : 0), // fade in second logo
		} as any;
	});

	if (error || !assets || assets.length < 1) return <View />;

	const ALL_LOGO_HEIGHT = 84;
	const HOST_LOGO_WIDTH =
		(assets[0].width! / assets[0].height!) * ALL_LOGO_HEIGHT;
	const TARGET_LOGO_WIDTH =
		(softwareLogoAsset?.width! / softwareLogoAsset?.height!) * ALL_LOGO_HEIGHT;

	return (
		<View style={{ marginBottom: 32 }}>
			<HideWhileKeyboardActive>
				<View style={styles.logoArrayContainer}>
					<Ionicons
						name={'close-outline'}
						color={theme.secondary.a50}
						size={32}
						style={{ marginHorizontal: 16, position: 'absolute' }}
					/>
					<Animated.View
						style={[{ position: 'absolute' }, shiftRight]}
						onTouchStart={onPlatformReset}
					>
						<Animated.Image
							source={{ uri: softwareLogoAsset.localUri! }}
							style={[
								{
									width: TARGET_LOGO_WIDTH,
									height: ALL_LOGO_HEIGHT,
									marginHorizontal: 'auto',
									borderRadius: 16,
									zIndex: 2,
								},
							]}
						/>
					</Animated.View>
					<Animated.Image
						source={{ uri: assets[0].localUri! }}
						style={[
							{
								width: HOST_LOGO_WIDTH,
								height: ALL_LOGO_HEIGHT,
								marginHorizontal: 'auto',
								borderRadius: 16,
								backgroundColor: '#1f2836',
								zIndex: 2,
							},
							shiftLeft,
						]}
						// contentFit={'cover'}
					/>
				</View>
			</HideWhileKeyboardActive>
			{platformSelected && (
				<View>
					<AppText.Medium
						style={{
							textAlign: 'center',
							paddingTop: 16,
							paddingBottom: 8,
							fontSize: 20,
						}}
					>
						{titleText}
					</AppText.Medium>
					<AppText.Medium
						style={{
							color: theme.complementary.a0,
							fontSize: 18,
							textAlign: 'center',
						}}
						onPress={descExternalOnPress}
					>
						{descText}
					</AppText.Medium>
				</View>
			)}
		</View>
	);
}

type SignInButtonProps = {
	isLoading: boolean;
	canSubmit: boolean;
	onSubmit: () => void;
	color?: string;
	colorScheme?: 'dark' | 'light';
};

function OnboardingSignInButton({
	isLoading,
	canSubmit,
	onSubmit,
	color,
	colorScheme = 'light',
}: SignInButtonProps) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const BG_COLOR =
		colorScheme === 'dark'
			? 'black'
			: canSubmit
				? 'white'
				: theme.secondary.a20;
	return (
		<AppButtonVariantA
			label={t(`onboarding.loginButton`)}
			loading={isLoading}
			onClick={onSubmit}
			style={{ backgroundColor: color, marginTop: 16 }}
			textStyle={{
				color: BG_COLOR,
			}}
			disabled={isLoading || !canSubmit}
		/>
	);
}

const styles = StyleSheet.create({
	logoArrayContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 'auto',
	},
});

export { OnboardingSignInBanner, OnboardingSignInButton };
