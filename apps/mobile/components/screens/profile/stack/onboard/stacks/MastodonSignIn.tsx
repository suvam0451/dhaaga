import { Dimensions, View, ScrollView, Alert, Text } from 'react-native';
import { useState } from 'react';
import WebView from 'react-native-webview';
import { Button } from '@rneui/base';
import TitleOnlyNoScrollContainer from '../../../../../containers/TitleOnlyNoScrollContainer';
import HideOnKeyboardVisibleContainer from '../../../../../containers/HideOnKeyboardVisibleContainer';
import { router, useLocalSearchParams } from 'expo-router';
import { UnknownRestClient, KNOWN_SOFTWARE } from '@dhaaga/bridge';
import PleromaPasteToken from '../fragments/PleromaPasteToken';
import { AccountService } from '../../../../../../database/entities/account';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_ROUTING_ENUM } from '../../../../../../utils/route-list';
import { ACCOUNT_METADATA_KEY } from '../../../../../../database/entities/account-metadata';
import { APP_EVENT_ENUM } from '../../../../../../services/publishers/app.publisher';
import {
	useAppPublishers,
	useAppTheme,
} from '../../../../../../hooks/utility/global-state-extractors';
import { APP_FONTS } from '../../../../../../styles/AppFonts';

function MastodonSignInStack() {
	const { theme } = useAppTheme();
	const { appSub } = useAppPublishers();
	const { db } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
		})),
	);
	const [Code, setCode] = useState<string | null>(null);

	const params = useLocalSearchParams();
	const _signInUrl: string = params['signInUrl'] as string;
	const _subdomain: string = params['subdomain'] as string;
	const _domain: string = params['domain'] as string;
	const _clientId: string = params['clientId'] as string;
	const _clientSecret: string = params['clientSecret'] as string;

	function callback(state) {
		const regex = /^https:\/\/(.*?)\/oauth\/authorize\/native\?code=(.*?)$/;
		if (regex.test(state.url)) {
			const code = state.url.match(regex)[2];
			setCode(code);
		}
	}

	async function onPressConfirm() {
		const instance = _subdomain;
		const token =
			await new UnknownRestClient().instances.getMastodonAccessToken(
				instance,
				Code,
				_clientId,
				_clientSecret,
			);

		const { data: verified, error } =
			await new UnknownRestClient().instances.verifyCredentials(
				instance /**
				 * It seems Pleroma/Akkoma give
				 * us another token, while one
				 * exists already (above request will fail)
				 *
				 * ^ In such cases, the pasted code is
				 * itself the token
				 */,
				token || Code, // fucking yolo it, xDD
			);

		const upsertResult = AccountService.upsert(
			db,
			{
				identifier: verified.id,
				server: _subdomain,
				driver: _domain,
				username: verified.username,
				avatarUrl: verified.avatar, // TODO: this needs to be replaced with camelCase
				displayName: verified['display_name'],
			},
			[
				{
					key: ACCOUNT_METADATA_KEY.DISPLAY_NAME,
					value: verified['display_name'],
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.AVATAR_URL,
					value: verified['avatar'],
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.USER_IDENTIFIER,
					value: verified.id,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.ACCESS_TOKEN,
					value: token || Code,
					type: 'string',
				},
				{ key: 'url', value: verified.url, type: 'string' },
			],
		);
		if (upsertResult.type === 'success') {
			Alert.alert('Account Added. Refresh if any screen is outdated.');
			appSub.publish(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED);
			router.replace(APP_ROUTING_ENUM.SETTINGS_TAB_ACCOUNTS);
		}
	}

	return (
		<TitleOnlyNoScrollContainer headerTitle={`Mastodon Sign-In`}>
			<View style={{ height: '100%', display: 'flex' }}>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
					<WebView
						style={{ flex: 1, minWidth: Dimensions.get('window').width - 20 }}
						source={{ uri: _signInUrl }}
						onNavigationStateChange={callback}
					/>
				</ScrollView>
				{_domain === KNOWN_SOFTWARE.MASTODON ? (
					<HideOnKeyboardVisibleContainer
						style={{ marginHorizontal: 12, marginTop: 'auto', height: 'auto' }}
					>
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
							{Code && (
								<View>
									<Text
										style={{
											marginBottom: 12,
											color: theme.secondary.a30,
											fontFamily: APP_FONTS.INTER_500_MEDIUM,
										}}
									>
										A valid token was detected. Proceed with adding the account
										shown above?
									</Text>
								</View>
							)}

							<Button
								disabled={!Code}
								color={theme.primary.a0}
								onPress={onPressConfirm}
							>
								<Text
									style={{
										color: 'black',
										fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
										paddingVertical: 4,
										fontSize: 16,
									}}
								>
									Proceed
								</Text>
							</Button>
						</View>
					</HideOnKeyboardVisibleContainer>
				) : (
					<View style={{ marginHorizontal: 12 }}>
						<View style={{ marginBottom: 36, paddingBottom: 16 }}>
							<HideOnKeyboardVisibleContainer style={{ marginVertical: 16 }}>
								<Text>Step 3: Confirm your account</Text>
							</HideOnKeyboardVisibleContainer>
							<PleromaPasteToken domain={_domain} setCode={setCode} />
							{Code ? (
								<View>
									<Text style={{ marginBottom: 12 }}>
										A valid token was detected. Proceed with adding the account
										shown above?
									</Text>
								</View>
							) : (
								<View></View>
							)}

							<HideOnKeyboardVisibleContainer>
								<Button
									disabled={!Code}
									color={'rgb(99, 100, 255)'}
									onPress={onPressConfirm}
								>
									Proceed
								</Button>
							</HideOnKeyboardVisibleContainer>
						</View>
					</View>
				)}
			</View>
		</TitleOnlyNoScrollContainer>
	);
}

export default MastodonSignInStack;
