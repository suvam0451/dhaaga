import { Dimensions, View, ScrollView, Alert } from 'react-native';
import WebView from 'react-native-webview';
import { useMiauthLogin } from '@dhaaga/react';
import { router, useLocalSearchParams } from 'expo-router';
import TitleOnlyNoScrollContainer from '../../../components/containers/TitleOnlyNoScrollContainer';
import AccountConfirmationPopup from '../AccountConfirmationPopup';
import AccountDbService from '../../../services/db/account-db.service';
import {
	useAppDb,
	useAppPublishers,
	useHub,
} from '../../../hooks/utility/global-state-extractors';
import { APP_EVENT_ENUM } from '../../../services/publishers/app.publisher';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';

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
		if (upsertResult.isOk()) {
			Alert.alert('Account Added. Refresh if any screen feels outdated.');
			appSub.publish(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED);
			loadAccounts();
			router.replace(APP_ROUTING_ENUM.SETTINGS_TAB_ACCOUNTS);
		} else {
			console.log(upsertResult.error);
		}
	}

	return (
		<TitleOnlyNoScrollContainer headerTitle={`Misskey Sign-In`}>
			<View
				style={{
					height: '100%',
					display: 'flex',
				}}
			>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
					<WebView
						style={{
							flex: 1,
							minWidth: Dimensions.get('window').width - 20,
							opacity: completed ? 0.1 : 1,
						}}
						source={{ uri: _signInUrl }}
						onNavigationStateChange={RNWebviewStateChangeCallback}
					/>
				</ScrollView>

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
		</TitleOnlyNoScrollContainer>
	);
}

export default MisskeySignInStack;
