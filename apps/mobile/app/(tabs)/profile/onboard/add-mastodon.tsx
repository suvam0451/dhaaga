import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { LOCALIZATION_NAMESPACE } from '../../../../types/app.types';
import { useTranslation } from 'react-i18next';
import useMastoApiLogin from '../../../../features/onboarding/interactors/useMastoApiLogin';
import { useAssets } from 'expo-asset';
import {
	OnboardingSignInBanner,
	OnboardingSignInButton,
} from '../../../../components/onboarding/OnboardingSignInBanner';
import { LinkingUtils } from '../../../../utils/linking.utils';
import { AppFormTextInput } from '../../../../components/lib/FormInput';
import { View } from 'react-native';

const BUTTON_COLOR = 'rgb(99, 100, 255)';

function PageContent() {
	const { isLoading, server, setServer, resolve } = useMastoApiLogin();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const [assets, error] = useAssets([
		require('../../../../assets/branding/mastodon/logo.png'),
	]);

	if (!assets || error) return <View />;
	return (
		<>
			<OnboardingSignInBanner
				titleText={t(`onboarding.enterYourServer`)}
				descText={'Join one here'}
				descExternalOnPress={LinkingUtils.openJoinMastodonHomepage}
				softwareLogoAsset={assets[0]}
			/>
			<AppFormTextInput
				placeholder={t(`onboarding.serverUrl`)}
				value={server}
				onChangeText={setServer}
				leftIcon={'server-outline'}
			/>
			<OnboardingSignInButton
				canSubmit={!!server}
				isLoading={isLoading}
				onSubmit={resolve}
				color={BUTTON_COLOR}
				colorScheme={'light'}
			/>
		</>
	);
}
function Page() {
	const { translateY } = useScrollMoreOnPageEnd();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<AppTopNavbar
			title={t(`topNav.secondary.selectServer`)}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			contentContainerStyle={{ marginTop: 32 }}
		>
			<PageContent />
		</AppTopNavbar>
	);
}
export default Page;
