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
import { APP_SETTING_KEY } from '#/services/settings.service';
import useAppSettings from '#/hooks/app/useAppSettings';
import { LocaleOptions } from '#/i18n/data';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

function LanguageOptions() {
	const { getValue } = useAppSettings();
	const { i18n } = useTranslation();
	const [Lang, setLang] = useState(null);

	useEffect(() => {
		setLang(getValue(APP_SETTING_KEY.APP_LANGUAGE));
	}, [i18n.language]);

	const currentLocale = LocaleOptions.find((o) => o.code === Lang);
	return (
		<AppButtonVariantA
			label={currentLocale?.nativeLabel}
			loading={false}
			variant={'secondary'}
			onClick={RoutingUtils.toSelectAppLanguage}
			textStyle={{ fontSize: 16 }}
			iconId={'language'}
		/>
	);
}
function Page() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
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
					label={t(`prompts.getStarted`)}
					loading={false}
					onClick={RoutingUtils.toFirstTimeOnboarding}
					textStyle={{ fontSize: 16 }}
				/>
				<AppButtonVariantA
					label={t(`prompts.visitWebsite`)}
					loading={false}
					variant={'secondary'}
					onClick={LinkingUtils.openProjectWebsite}
					textStyle={{ fontSize: 16 }}
				/>
				<LanguageOptions />
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
