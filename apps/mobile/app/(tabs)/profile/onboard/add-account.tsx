import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import AppTopNavbar from '../../../../components/shared/topnavbar/AppTopNavbar';
import { AddAccountLandingFragment } from '../../../../features/onboarding/presenters/AddAccountPresenter';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../types/app.types';
import { View } from 'react-native';
import { useMemo, useState } from 'react';
import { PageContent as BlueskyAuthPageContent } from './add-bluesky';
import { useAssets } from 'expo-asset';
import {
	OnboardingSignInBanner,
	OnboardingSignInButton,
} from '../../../../components/onboarding/OnboardingSignInBanner';
import { LinkingUtils } from '../../../../utils/linking.utils';
import useActivityPubAuth from '../../../../features/onboarding/interactors/useActivityPubAuth';
import { AppFormTextInput } from '../../../../components/lib/FormInput';

function ActivityPub() {
	const { isLoading, Instance, setInstance, resolve } = useActivityPubAuth();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const BUTTON_COLOR = 'rgb(99, 100, 255)';

	return (
		<>
			<AppFormTextInput
				placeholder={t(`onboarding.serverUrl`)}
				value={Instance}
				onChangeText={setInstance}
				leftIcon={'server-outline'}
			/>
			<OnboardingSignInButton
				canSubmit={!!Instance}
				isLoading={isLoading}
				onSubmit={resolve}
				color={BUTTON_COLOR}
				colorScheme={'light'}
			/>
		</>
	);
}

function MiAuth() {
	const { isLoading, Instance, setInstance, resolve } = useActivityPubAuth(
		'miauth',
		'misskey.io',
	);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const BUTTON_COLOR =
		'linear-gradient(90deg, rgb(0, 179, 50), rgb(170, 203, 0))';

	return (
		<>
			<AppFormTextInput
				placeholder={t(`onboarding.serverUrl`)}
				value={Instance}
				onChangeText={setInstance}
				leftIcon={'server-outline'}
			/>
			<OnboardingSignInButton
				canSubmit={!!Instance}
				isLoading={isLoading}
				onSubmit={resolve}
				color={BUTTON_COLOR}
				colorScheme={'light'}
			/>
		</>
	);
}

function MyPager() {
	const [assets, error] = useAssets([
		require('../../../../assets/icon.png'),
		require('../../../../assets/branding/bluesky/logo.png'),
		require('../../../../assets/branding/mastodon/logo.png'),
		require('../../../../assets/branding/misskey/logo.png'),
		require('../../../../assets/branding/lemmy/logo.png'),
	]);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const [IsPlatformSelected, setIsPlatformSelected] = useState(false);
	const [ContentIndex, setContentIndex] = useState(0);

	function goToPage2(pageId: number) {
		setContentIndex(pageId);
		setIsPlatformSelected(true);
	}

	function platformSelectionReset() {
		setIsPlatformSelected(false);
		setContentIndex(0);
	}

	const Content = useMemo(() => {
		switch (ContentIndex) {
			case 0:
				return <View />;
			case 1:
				return <BlueskyAuthPageContent />;
			case 2:
				return <ActivityPub />;
			case 3:
				return <MiAuth />;
			case 4:
				return <MiAuth />;
		}
	}, [ContentIndex]);

	if (error || !assets) return <View />;

	return (
		<View>
			<OnboardingSignInBanner
				titleText={t(`onboarding.enterYourServer`)}
				descText={'Find one here'}
				descExternalOnPress={LinkingUtils.openJoinMastodonHomepage}
				softwareLogoAsset={assets[ContentIndex]}
				platformSelected={IsPlatformSelected}
				onPlatformSelectionReset={platformSelectionReset}
			/>
			{Content}
			{!IsPlatformSelected && (
				<AddAccountLandingFragment onSelectSetPagerId={goToPage2} />
			)}
		</View>
	);
}
function Page() {
	const { translateY } = useScrollMoreOnPageEnd();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<AppTopNavbar
			title={'Add Account'}
			translateY={translateY}
			contentContainerStyle={{ marginTop: 32 }}
		>
			<MyPager />
		</AppTopNavbar>
	);
}

export default Page;
