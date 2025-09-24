import { Alert, View } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import AtprotoSessionService from '../../../../services/atproto/atproto-session.service';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import {
	useAppAcct,
	useAppDb,
} from '../../../../hooks/utility/global-state-extractors';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../types/app.types';
import { AccountService } from '@dhaaga/db';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppFormTextInput } from '../../../../components/lib/FormInput';
import { OnboardingSignInButton } from '../../../../components/onboarding/OnboardingSignInBanner';

export function PageContent() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const [Username, setUsername] = useState<string | null>(null);
	const [Password, setPassword] = useState<string | null>(null);
	const [IsLoading, setIsLoading] = useState(false);
	const { db } = useAppDb();
	const { acct } = useAppAcct();
	const { loadApp } = useGlobalState(
		useShallow((o) => ({
			loadApp: o.loadApp,
		})),
	);

	async function onSubmit() {
		setIsLoading(true);
		if (!Username || !Password) return;

		try {
			const result = await AtprotoSessionService.login(db, Username, Password);
			if (!result) return;
			const { success, reason } = result;

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

	const BUTTON_COLOR = 'rgb(99, 100, 255)';
	return (
		<>
			<AppFormTextInput
				onChangeText={setUsername}
				value={Username!}
				placeholder={'Username or email address'}
				leftIcon={'person-outline'}
			/>
			<AppFormTextInput
				placeholder={t(`onboarding.appPassword`)}
				value={Password!}
				onChangeText={setPassword}
				leftIcon={'lock-closed-outline'}
			/>
			<OnboardingSignInButton
				canSubmit={!!Username && !!Password}
				isLoading={IsLoading}
				onSubmit={onSubmit}
				colorScheme={'light'}
				color={BUTTON_COLOR}
			/>
		</>
	);
}

function AddBluesky() {
	return <View />;
}

export default AddBluesky;
