import { View } from 'react-native';
import { useMiauthLogin } from '@dhaaga/react';
import { useLocalSearchParams } from 'expo-router';
import AccountConfirmationPopup from '#/features/onboarding/AccountConfirmationPopup';
import AccountDbService from '#/services/db/account-db.service';
import {
	useAppDb,
	useAppPublishers,
	useAppTheme,
	useHub,
} from '#/states/global/hooks';
import { APP_EVENT_ENUM } from '#/states/event-bus/app.publisher';
import { AppAuthWebView } from '#/ui/WebView';
import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import RoutingUtils from '#/utils/routing.utils';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';

function MisskeySignInStack() {
	const params = useLocalSearchParams();
	const _signInUrl: string = params['signInUrl'] as string;
	const _subdomain: string = params['subdomain'] as string;
	const _domain: string = params['domain'] as string;
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const { theme } = useAppTheme();
	const { db } = useAppDb();
	const { loadAccounts } = useHub();
	const { appEventBus } = useAppPublishers();

	const {
		RNWebviewStateChangeCallback,
		authenticate,
		completed,
		userData,
		code,
	} = useMiauthLogin(_subdomain, _signInUrl);

	async function confirm() {
		const userData = await authenticate();
		if (!db || !userData) return;
		const upsertResult = AccountDbService.upsertAccountCredentials_miAuth(
			db,
			code!,
			_subdomain,
			_domain,
			userData,
		);
		if (upsertResult) {
			appEventBus.publish(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED);
			loadAccounts();
			RoutingUtils.toAccountManagement();
		}
	}

	return (
		<View style={{ backgroundColor: theme.background.a0, flex: 1 }}>
			<NavBar_Simple label={t(`topNav.secondary.misskeySignIn`)} />
			<AppAuthWebView
				uri={_signInUrl}
				isBlurred={completed}
				onNavigationStateChange={RNWebviewStateChangeCallback}
			/>
			{completed && (
				<AccountConfirmationPopup
					onConfirm={confirm}
					isLoading={false}
					userData={userData ? { ...userData!, software: _domain } : null}
					buttonColor={
						'linear-gradient(90deg, rgb(0, 179, 50), rgb(170,' + ' 203, 0))'
					}
				/>
			)}
		</View>
	);
}

export default MisskeySignInStack;
