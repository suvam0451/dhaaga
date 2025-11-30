import { View } from 'react-native';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { AppText } from '#/components/lib/Text';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import { useAssets } from 'expo-asset';
import { Image } from 'expo-image';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import WelcomeScreenFeatureShowcase from '#/features/onboarding/WelcomeScreenFeatureShowcase';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { router } from 'expo-router';
import { LinkingUtils } from '#/utils/linking.utils';

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
				Dhaaga
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
			<View
				style={{
					marginHorizontal: 28,
					flex: 1,
					marginVertical: 'auto',
					justifyContent: 'center',
				}}
			>
				<WelcomeScreenFeatureShowcase />
			</View>
			<View style={{ marginBottom: 32 }}>
				<AppButtonVariantA
					label={'Get Started'}
					loading={false}
					onClick={() => {
						router.navigate(APP_ROUTING_ENUM.PROFILE_TAB);
					}}
					textStyle={{ fontSize: 16 }}
				/>
				<AppButtonVariantA
					label={'Visit Website'}
					loading={false}
					variant={'secondary'}
					onClick={LinkingUtils.openProjectWebsite}
					textStyle={{ fontSize: 16 }}
				/>
				<AppText.Medium
					style={{ textAlign: 'center', marginTop: 8 }}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A50}
				>
					v0.17.0
				</AppText.Medium>
			</View>
		</View>
	);
}

export default Page;
