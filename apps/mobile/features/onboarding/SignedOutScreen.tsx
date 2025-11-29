import { View } from 'react-native';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { AppText } from '#/components/lib/Text';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import { useAssets } from 'expo-asset';
import { Image } from 'expo-image';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { Footer } from '#/components/screens/profile/stack/AppSettingsPage';
import WelcomeScreenFeatureShowcase from '#/features/onboarding/WelcomeScreenFeatureShowcase';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { router } from 'expo-router';

function Page() {
	const [assets, error] = useAssets([require('#/assets/dhaaga/icon.png')]);

	const { theme } = useAppTheme();

	if (error || !assets || assets.length < 1)
		return (
			<View style={{ height: '100%', backgroundColor: theme.palette.bg }} />
		);

	return (
		<View style={{ height: '100%', backgroundColor: theme.palette.bg }}>
			<AppText.SemiBold
				style={{ textAlign: 'center', marginTop: 24, fontSize: 32 }}
			>
				Welcome
			</AppText.SemiBold>
			<Image
				source={{ uri: assets[0].localUri! }}
				style={[
					{
						width: 84,
						height: 84,
						marginHorizontal: 'auto',
						borderRadius: 16,
						zIndex: 2,
						marginTop: 24,
					},
				]}
			/>
			<AppText.SemiBold
				style={{ textAlign: 'center', marginTop: 8 }}
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
			>
				v0.16.0
			</AppText.SemiBold>

			<View style={{ marginHorizontal: 24, marginVertical: 42 }}>
				<WelcomeScreenFeatureShowcase />
			</View>
			<View style={{ marginTop: 32, flex: 1 }}>
				<AppButtonVariantA
					label={'Get Started'}
					loading={false}
					onClick={() => {
						router.navigate(APP_ROUTING_ENUM.PROFILE_PAGE);
					}}
					textStyle={{ fontSize: 16 }}
				/>
			</View>
			<View style={{ marginBottom: 8 }}>
				<Footer hideVersion />
			</View>
		</View>
	);
}

export default Page;
