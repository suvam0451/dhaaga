import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { Alert, View } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import AtprotoSessionService from '../../../../services/atproto/atproto-session.service';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import {
	useAppAcct,
	useAppDb,
} from '../../../../hooks/utility/global-state-extractors';
import { useAssets } from 'expo-asset';
import { LinkingUtils } from '../../../../utils/linking.utils';
import useAtprotoLogin from '../../../../features/onboarding/interactors/useAtprotoLogin';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../types/app.types';
import { AccountService } from '@dhaaga/db';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppFormTextInput } from '../../../../components/lib/FormInput';
import {
	OnboardingSignInBanner,
	OnboardingSignInButton,
} from '../../../../components/onboarding/OnboardingSignInBanner';

function AddBluesky() {
	const [IsLoading, setIsLoading] = useState(false);
	const { db } = useAppDb();
	const { translateY } = useScrollMoreOnPageEnd();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { acct } = useAppAcct();
	const { loadApp } = useGlobalState(
		useShallow((o) => ({
			loadApp: o.loadApp,
		})),
	);

	const [Username, setUsername] = useState(null);
	const [Password, setPassword] = useState(null);
	const [assets, error] = useAssets([
		require('../../../../assets/branding/bluesky/logo.png'),
	]);

	const { isLoading } = useAtprotoLogin();

	async function onSubmit() {
		setIsLoading(true);
		if (!Username || !Password) {
			return;
		}

		try {
			const { success, reason } = await AtprotoSessionService.login(
				db,
				Username,
				Password,
			);

			if (success) {
				if (!acct) {
					AccountService.ensureAccountSelection(db);
					loadApp();
				}
				Alert.alert('Account Added. Welcome to Dhaaga.');
				router.replace(APP_ROUTING_ENUM.SETTINGS_TAB_ACCOUNTS);
			} else {
				console.log(reason);
			}
		} catch (e) {
			console.log('[ERROR]: bsky login failed', e);
		} finally {
			setIsLoading(false);
		}
	}

	if (error || !assets)
		return (
			<AppTopNavbar
				title={t(`topNav.secondary.blueskySignIn`)}
				translateY={translateY}
				type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			>
				<View style={{ flex: 1 }} />
			</AppTopNavbar>
		);

	return (
		<AppTopNavbar
			title={t(`topNav.secondary.blueskySignIn`)}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			contentContainerStyle={{ marginTop: 32 }}
		>
			<OnboardingSignInBanner
				titleText={t(`onboarding.needBlueskyAccount`)}
				descText={t(`onboarding.createOneHere`)}
				descExternalOnPress={LinkingUtils.openBluesky}
				softwareLogoAsset={assets[0]}
			/>

			<AppFormTextInput
				onChangeText={setUsername}
				value={Username}
				placeholder={'Username or email address'}
				leftIcon={'person-outline'}
			/>
			<AppFormTextInput
				placeholder={t(`onboarding.appPassword`)}
				value={Password}
				onChangeText={setPassword}
				leftIcon={'lock-closed-outline'}
			/>
			<OnboardingSignInButton
				canSubmit={Username && Password}
				isLoading={IsLoading}
				onSubmit={onSubmit}
			/>
		</AppTopNavbar>
	);
}

export default AddBluesky;
