import { Alert } from 'react-native';
import { useMiauthLogin } from '@dhaaga/react';
import { router, useLocalSearchParams } from 'expo-router';
import TitleOnlyNoScrollContainer from '../../../../components/containers/TitleOnlyNoScrollContainer';
import AccountConfirmationPopup from '../../../../features/onboarding/AccountConfirmationPopup';
import AccountDbService from '../../../../services/db/account-db.service';
import {
	useAppDb,
	useAppPublishers,
	useHub,
} from '../../../../hooks/utility/global-state-extractors';
import { APP_EVENT_ENUM } from '../../../../services/publishers/app.publisher';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import { AppAuthWebView } from '../../../../components/lib/WebView';

function MisskeySignInStack() {
	const params = useLocalSearchParams();
	const _signInUrl: string = params['signInUrl'] as string;
	const _subdomain: string = params['subdomain'] as string;
	const _domain: string = params['domain'] as string;

	const { db } = useAppDb();
	const { loadAccounts } = useHub();
	const { appSub } = useAppPublishers();

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
			Alert.alert('Account Added. Refresh if any screen feels outdated.');
			appSub.publish(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED);
			loadAccounts();
			router.replace(APP_ROUTING_ENUM.PROFILE_TAB);
		} else {
		}
	}

	return (
		<TitleOnlyNoScrollContainer headerTitle={`Misskey Sign-In`}>
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
		</TitleOnlyNoScrollContainer>
	);
}

export default MisskeySignInStack;
