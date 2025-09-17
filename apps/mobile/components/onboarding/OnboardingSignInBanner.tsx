import {
	View,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import HideOnKeyboardVisibleContainer from '../containers/HideOnKeyboardVisibleContainer';
import { Asset, useAssets } from 'expo-asset';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { AppText } from '../lib/Text';
import { Image } from 'expo-image';
import { LOCALIZATION_NAMESPACE } from '../../types/app.types';
import { useTranslation } from 'react-i18next';

type OnboardingCtaBannerProps = {
	titleText: string;
	descText: string;
	descExternalOnPress: () => void;
	softwareLogoAsset: Asset;
};

function OnboardingSignInBanner({
	titleText,
	descText,
	descExternalOnPress,
	softwareLogoAsset,
}: OnboardingCtaBannerProps) {
	const [assets, error] = useAssets([require('../../assets/icon.png')]);
	const { theme } = useAppTheme();

	if (error || !assets) return <View />;

	return (
		<View style={{ marginBottom: 32 }}>
			<HideOnKeyboardVisibleContainer>
				<View style={styles.logoArrayContainer}>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{ uri: softwareLogoAsset.localUri }}
						style={{
							width: 84,
							height: 84,
							marginHorizontal: 'auto',
							borderRadius: 16,
							backgroundColor: '#1f2836',
						}}
						contentFit={'cover'}
					/>
					<Ionicons
						name={'close-outline'}
						color={theme.secondary.a50}
						size={32}
						style={{ marginHorizontal: 16 }}
					/>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{ uri: assets[0].localUri }}
						style={{
							width: 84,
							height: 84,
							marginHorizontal: 'auto',
							borderRadius: 16,
						}}
					/>
				</View>
			</HideOnKeyboardVisibleContainer>
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
		<View style={{ alignItems: 'center', marginTop: 16 }}>
			<TouchableOpacity
				style={[
					styles.button,
					{ backgroundColor: color || theme.primary.a0 },
					isLoading && styles.buttonDisabled,
				]}
				onPress={onSubmit}
				disabled={isLoading || !canSubmit}
			>
				{isLoading ? (
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<ActivityIndicator size="small" color={BG_COLOR} />
						<AppText.SemiBold
							style={[
								styles.buttonText,
								{ fontSize: 16, color: BG_COLOR, marginLeft: 8 },
							]}
						>
							{t(`onboarding.loginButton`)}
						</AppText.SemiBold>
					</View>
				) : (
					<AppText.SemiBold style={{ fontSize: 16, color: BG_COLOR }}>
						{t(`onboarding.loginButton`)}
					</AppText.SemiBold>
				)}
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#6200ee',
		paddingVertical: 10,
		paddingHorizontal: 24,
		borderRadius: 8,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		width: 128,
	},
	buttonDisabled: {
		opacity: 0.87,
	},
	buttonText: {
		// color: '#fff',
		// fontSize: 16,
	},
	logoArrayContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 'auto',
	},
	inputContainerRoot: {
		flexDirection: 'row',
		borderWidth: 2,
		borderColor: 'rgba(136,136,136,0.4)',
		borderRadius: 8,
		marginBottom: 12,
	},
});

export { OnboardingSignInBanner, OnboardingSignInButton };
