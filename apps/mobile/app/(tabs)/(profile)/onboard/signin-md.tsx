import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import PleromaPasteToken from '#/features/onboarding/components/PleromaPasteToken';
import {
	useAppDb,
	useAppPublishers,
	useAppTheme,
	useHub,
} from '#/states/global/hooks';
import { useActivityPubAuth } from '@dhaaga/react';
import AccountDbService from '#/services/db/account-db.service';
import appStyling from '#/styles/AppStyles';
import { AppAuthWebView } from '#/ui/WebView';
import RoutingUtils from '#/utils/routing.utils';
import { HideWhileKeyboardActive } from '#/ui/Containers';
import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import { APP_EVENT_ENUM } from '#/states/event-bus/app.publisher';
import { NativeTextBold } from '#/ui/NativeText';
import { useEffect } from 'react';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';

function MastodonSignInStack() {
	const { theme } = useAppTheme();
	const { appEventBus } = useAppPublishers();
	const { db } = useAppDb();
	const { loadAccounts } = useHub();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const params = useLocalSearchParams();
	const _signInUrl: string = params['signInUrl'] as string;
	const _subdomain: string = params['subdomain'] as string;
	const _domain: string = params['domain'] as string;
	const _clientId: string = params['clientId'] as string;
	const _clientSecret: string = params['clientSecret'] as string;
	const _requestId: string = params['requestId'] as string;

	const { RNWebviewStateChangeCallback, code, setCode, authenticate, reset } =
		useActivityPubAuth(_subdomain, _clientId, _clientSecret);

	useEffect(() => {
		reset();
	}, [_requestId]);

	async function onPressConfirm() {
		if (!db || !code) return;

		const authResponse: {
			userData: any;
			accessToken: string;
		} | null = await authenticate();
		if (authResponse === null) return;

		const { userData, accessToken } = authResponse;
		console.log(userData, accessToken);
		const upsertResult = AccountDbService.upsertAccountCredentials(
			db,
			accessToken,
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

	async function onPressReset() {
		reset();
	}

	return (
		<View style={{ backgroundColor: theme.background.a0, flex: 1 }}>
			<NavBar_Simple label={t(`topNav.secondary.mastodonSignIn`)} />
			<AppAuthWebView
				uri={_signInUrl}
				isBlurred={!!code}
				onNavigationStateChange={RNWebviewStateChangeCallback}
			/>
			{_domain === KNOWN_SOFTWARE.MASTODON ? (
				<HideWhileKeyboardActive
					style={{ marginHorizontal: 12, marginTop: 'auto', height: 'auto' }}
				>
					{code && (
						<View style={{ height: 240 }}>
							<NativeTextBold
								style={{
									marginVertical: 20,
									color: theme.secondary.a10,
									textAlign: 'center',
									fontSize: 16,
								}}
							>
								Login and Confirm your account
							</NativeTextBold>
							{code && (
								<View>
									<NativeTextBold
										style={{
											marginBottom: 12,
											color: theme.secondary.a30,
											textAlign: 'center',
										}}
									>
										A valid token was detected. Proceed with adding the account
										shown above?
									</NativeTextBold>
								</View>
							)}

							<View style={{ flexDirection: 'row' }}>
								<TouchableOpacity
									disabled={!code}
									style={[
										appStyling.button,
										{
											backgroundColor: theme.primary,
										},
									]}
									onPress={onPressConfirm}
								>
									<NativeTextBold
										style={{
											color: 'black',
											fontSize: 16,
										}}
									>
										Proceed
									</NativeTextBold>
								</TouchableOpacity>
								<TouchableOpacity
									disabled={!code}
									style={[
										appStyling.button,
										{
											backgroundColor: theme.background.a40,
										},
									]}
									onPress={onPressReset}
								>
									<NativeTextBold
										style={{
											color: theme.secondary.a20,
											fontSize: 16,
										}}
									>
										Reset
									</NativeTextBold>
								</TouchableOpacity>
							</View>
						</View>
					)}
				</HideWhileKeyboardActive>
			) : (
				<View style={{ marginHorizontal: 12 }}>
					<View style={{ marginBottom: 36, paddingBottom: 16 }}>
						<HideWhileKeyboardActive style={{ marginVertical: 16 }}>
							<Text>Step 3: Confirm your account</Text>
						</HideWhileKeyboardActive>
						<PleromaPasteToken domain={_domain} setCode={setCode} />
						{code ? (
							<View>
								<Text style={{ marginBottom: 12 }}>
									A valid token was detected. Proceed with adding the account
									shown above?
								</Text>
							</View>
						) : (
							<View></View>
						)}

						<HideWhileKeyboardActive>
							<TouchableOpacity
								disabled={!code}
								style={[
									appStyling.button,
									{
										backgroundColor: 'rgb(99, 100, 255)',
									},
								]}
								onPress={onPressConfirm}
							>
								Proceed
							</TouchableOpacity>
						</HideWhileKeyboardActive>
					</View>
				</View>
			)}
		</View>
	);
}

export default MastodonSignInStack;
