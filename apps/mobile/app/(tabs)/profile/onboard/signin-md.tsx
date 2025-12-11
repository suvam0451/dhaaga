import { View, Text, TouchableOpacity } from 'react-native';
import TitleOnlyNoScrollContainer from '#/components/containers/TitleOnlyNoScrollContainer';
import { useLocalSearchParams } from 'expo-router';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import PleromaPasteToken from '#/features/onboarding/components/PleromaPasteToken';
import { APP_EVENT_ENUM } from '#/services/publishers/app.publisher';
import {
	useAppDb,
	useAppPublishers,
	useAppTheme,
	useHub,
} from '#/states/global/hooks';
import { APP_FONTS } from '#/styles/AppFonts';
import { useActivityPubAuth } from '@dhaaga/react';
import AccountDbService from '#/services/db/account-db.service';
import appStyling from '#/styles/AppStyles';
import { AppAuthWebView } from '#/components/lib/WebView';
import RoutingUtils from '#/utils/routing.utils';
import { HideWhileKeyboardActive } from '#/ui/Containers';

function MastodonSignInStack() {
	const { theme } = useAppTheme();
	const { appSub } = useAppPublishers();
	const { db } = useAppDb();
	const { loadAccounts } = useHub();

	const params = useLocalSearchParams();
	const _signInUrl: string = params['signInUrl'] as string;
	const _subdomain: string = params['subdomain'] as string;
	const _domain: string = params['domain'] as string;
	const _clientId: string = params['clientId'] as string;
	const _clientSecret: string = params['clientSecret'] as string;

	const { RNWebviewStateChangeCallback, code, setCode, authenticate } =
		useActivityPubAuth(_subdomain, _clientId, _clientSecret);

	async function onPressConfirm() {
		if (!db || !code) return;

		const authResponse: {
			userData: any;
			accessToken: string;
		} | null = await authenticate();
		if (authResponse === null) return;

		const { userData, accessToken } = authResponse;
		const upsertResult = AccountDbService.upsertAccountCredentials(
			db,
			accessToken,
			_subdomain,
			_domain,
			userData,
		);
		if (upsertResult) {
			appSub.publish(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED);
			loadAccounts();
			RoutingUtils.toAccountManagement();
		}
	}

	return (
		<TitleOnlyNoScrollContainer headerTitle={`Mastodon Sign-In`}>
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
							<Text
								style={{
									marginVertical: 20,
									color: theme.secondary.a10,
									fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
									textAlign: 'center',
									fontSize: 16,
								}}
							>
								Login and Confirm your account
							</Text>
							{code && (
								<View>
									<Text
										style={{
											marginBottom: 12,
											color: theme.secondary.a30,
											fontFamily: APP_FONTS.INTER_500_MEDIUM,
											textAlign: 'center',
										}}
									>
										A valid token was detected. Proceed with adding the account
										shown above?
									</Text>
								</View>
							)}

							<TouchableOpacity
								disabled={!code}
								style={[
									appStyling.button,
									{
										backgroundColor: theme.primary.a0,
									},
								]}
								onPress={onPressConfirm}
							>
								<Text
									style={{
										color: 'black',
										fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
										fontSize: 16,
									}}
								>
									Proceed
								</Text>
							</TouchableOpacity>
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
		</TitleOnlyNoScrollContainer>
	);
}

export default MastodonSignInStack;
