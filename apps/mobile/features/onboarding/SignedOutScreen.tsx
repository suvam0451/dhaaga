import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import { useAssets } from 'expo-asset';
import { Image } from 'expo-image';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import WelcomeScreenFeatureShowcase from '#/features/onboarding/WelcomeScreenFeatureShowcase';
import { LinkingUtils } from '#/utils/linking.utils';
import RoutingUtils from '#/utils/routing.utils';
import { NativeTextMedium, NativeTextBold } from '#/ui/NativeText';
import { APP_VERSION } from '#/utils/default-settings';

function Page() {
	const [assets, error] = useAssets([require('#/assets/dhaaga/icon.png')]);

	const { theme } = useAppTheme();

	if (error || !assets || assets.length < 1)
		return (
			<View style={{ height: '100%', backgroundColor: theme.background.a0 }} />
		);

	return (
		<View style={{ height: '100%', backgroundColor: theme.background.a0 }}>
			<NativeTextBold style={styles.appLabel}>Dhaaga</NativeTextBold>
			<Image source={{ uri: assets[0].localUri! }} style={styles.appLogo} />
			<NativeTextMedium
				style={styles.versionText}
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A50}
			>
				{APP_VERSION}
			</NativeTextMedium>
			<View style={styles.showcaseArea}>
				<WelcomeScreenFeatureShowcase />
			</View>
			<View style={{ marginBottom: 32 }}>
				<AppButtonVariantA
					label={'Get Started'}
					loading={false}
					onClick={RoutingUtils.toFirstTimeOnboarding}
					textStyle={{ fontSize: 16 }}
				/>
				<AppButtonVariantA
					label={'Visit Website'}
					loading={false}
					variant={'secondary'}
					onClick={LinkingUtils.openProjectWebsite}
					textStyle={{ fontSize: 16 }}
				/>
			</View>
		</View>
	);
}

export default Page;

const styles = StyleSheet.create({
	appLabel: {
		textAlign: 'center',
		marginTop: 24,
		fontSize: 32,
	},
	appLogo: {
		width: 84,
		height: 84,
		marginHorizontal: 'auto',
		borderRadius: 16,
		zIndex: 2,
		marginTop: 24,
	},
	showcaseArea: {
		marginHorizontal: 28,
		flex: 1,
		marginVertical: 'auto',
		justifyContent: 'center',
	},
	versionText: {
		textAlign: 'center',
		marginTop: 8,
	},
});
