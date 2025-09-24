import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import AppTopNavbar from '../../../../components/shared/topnavbar/AppTopNavbar';
import { AddAccountLandingFragment } from '../../../../features/onboarding/presenters/AddAccountPresenter';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../types/app.types';
import { View, Alert } from 'react-native';
import { useMemo, useState } from 'react';
import { useAssets } from 'expo-asset';
import {
	OnboardingSignInBanner,
	OnboardingSignInButton,
} from '../../../../components/onboarding/OnboardingSignInBanner';
import { LinkingUtils } from '../../../../utils/linking.utils';
import { useAtProtoAuth, useDhaagaAuthFormControl } from '@dhaaga/react';
import { useShallow } from 'zustand/react/shallow';
import { AppFormTextInput } from '../../../../components/lib/FormInput';
import {
	useAppAcct,
	useAppDb,
	useAppManager,
} from '../../../../hooks/utility/global-state-extractors';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import useGlobalState from '../../../../states/_global';
import { AccountService } from '@dhaaga/db';
import AccountDbService from '../../../../services/db/account-db.service';

function AtProto() {
	const {
		username,
		setUsername,
		password,
		setPassword,
		loading,
		authenticate,
	} = useAtProtoAuth();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { db } = useAppDb();
	const { acct } = useAppAcct();
	const { loadApp } = useGlobalState(
		useShallow((o) => ({
			loadApp: o.loadApp,
		})),
	);

	async function onSubmit() {
		authenticate().then((res) => {
			if (res === null) return;
			const { profileData, sessionData } = res;
			AccountDbService.upsertAccountCredentials_AtProto(
				db,
				password,
				sessionData,
				profileData,
			);

			if (!acct) {
				AccountService.ensureAccountSelection(db);
				loadApp();
			}
			Alert.alert('Account Added. Welcome to Dhaaga.');
			router.replace(APP_ROUTING_ENUM.SETTINGS_TAB_ACCOUNTS);
		});
	}

	const BUTTON_COLOR = 'rgb(99, 100, 255)';
	return (
		<>
			<AppFormTextInput
				onChangeText={setUsername}
				value={username!}
				placeholder={'Username or email address'}
				leftIcon={'person-outline'}
			/>
			<AppFormTextInput
				placeholder={t(`onboarding.appPassword`)}
				value={password!}
				onChangeText={setPassword}
				leftIcon={'lock-closed-outline'}
			/>
			<OnboardingSignInButton
				canSubmit={!!username && !!password}
				isLoading={loading}
				onSubmit={onSubmit}
				colorScheme={'light'}
				color={BUTTON_COLOR}
			/>
		</>
	);
}

function ActivityPub() {
	const { isLoading, Instance, setInstance, resolve, cachedClientTokens } =
		useDhaagaAuthFormControl();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { appManager } = useAppManager();

	const BUTTON_COLOR = 'rgb(99, 100, 255)';

	function onProcessRequest() {
		if (!appManager) return;
		cachedClientTokens.current =
			appManager.storage.getAtprotoServerClientTokens(Instance);
		resolve().then((result) => {
			if (result.strategy !== 'activitypub') return;

			const { clientId, clientSecret, signInUrl, instance, software } =
				result.params;
			appManager.storage.setAtprotoServerClientTokens(
				instance,
				clientId,
				clientSecret,
			);

			router.push({
				pathname: APP_ROUTING_ENUM.MASTODON_SIGNIN,
				params: {
					signInUrl: signInUrl,
					subdomain: Instance,
					domain: software,
					clientId,
					clientSecret,
				},
			});
		});
	}
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
				onSubmit={onProcessRequest}
				color={BUTTON_COLOR}
				colorScheme={'light'}
			/>
		</>
	);
}

function MiAuth() {
	const { isLoading, Instance, setInstance, resolve } =
		useDhaagaAuthFormControl('miauth', 'misskey.io');
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const BUTTON_COLOR =
		'linear-gradient(90deg, rgb(0, 179, 50), rgb(170, 203, 0))';

	function onProcessRequest() {
		resolve().then((result) => {
			if (result.strategy !== 'miauth') return;

			const { signInUrl, instance, software } = result.params;

			router.push({
				pathname: APP_ROUTING_ENUM.MISSKEY_SIGNIN,
				params: {
					signInUrl: signInUrl,
					subdomain: instance,
					domain: software,
				},
			});
		});
	}

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
				onSubmit={onProcessRequest}
				color={BUTTON_COLOR}
				colorScheme={'light'}
			/>
		</>
	);
}

export function AppAuthenticationPager() {
	const [assets, error] = useAssets([
		require('../../../../assets/dhaaga/icon.png'),
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
				return <AtProto />;
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
		<View style={{ marginTop: 24 }}>
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
	// const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<AppTopNavbar title={'Add Account'} translateY={translateY}>
			<AppAuthenticationPager />
		</AppTopNavbar>
	);
}

export default Page;
