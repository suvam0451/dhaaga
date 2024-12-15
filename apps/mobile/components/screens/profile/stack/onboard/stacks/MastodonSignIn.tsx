import { Dimensions, View, ScrollView, Alert } from 'react-native';
import { Text } from '@rneui/themed';
import { useState } from 'react';
import WebView from 'react-native-webview';
import { Button } from '@rneui/base';
import TitleOnlyNoScrollContainer from '../../../../../containers/TitleOnlyNoScrollContainer';
import HideOnKeyboardVisibleContainer from '../../../../../containers/HideOnKeyboardVisibleContainer';
import { router, useLocalSearchParams } from 'expo-router';
import {
	UnknownRestClient,
	KNOWN_SOFTWARE,
} from '@dhaaga/shared-abstraction-activitypub';
import PleromaPasteToken from '../fragments/PleromaPasteToken';
import { AccountService } from '../../../../../../database/entities/account';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function MastodonSignInStack() {
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
				instance,
				/**
				 * It seems Pleroma/Akkoma give
				 * us another token, while one
				 * exists already (above request will fail)
				 *
				 * ^ In such cases, the pasted code is
				 * itself the token
				 */
				token || Code, // fucking yolo it, xDD
			);

		const upsertResult = AccountService.upsert(
			db,
			{
				identifier: verified.id,
				server: _subdomain,
				driver: _domain,
				username: verified.username,
				avatarUrl: verified.avatar,
				// TODO: this needs to be replaced with camelCase
				displayName: verified['display_name'],
			},
			[
				{
					key: 'display_name',
					value: verified['display_name'],
					type: 'string',
				},
				{ key: 'avatar', value: verified['avatar'], type: 'string' },
				{ key: 'user_id', value: verified.id, type: 'string' },
				{ key: 'access_token', value: token || Code, type: 'string' },
				{ key: 'url', value: verified.url, type: 'string' },
			],
		);
		if (upsertResult.type === 'success') {
			Alert.alert('Account Added');
			router.replace('/profile/settings/accounts');
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
					<HideOnKeyboardVisibleContainer style={{ marginHorizontal: 12 }}>
						<View style={{ height: 240 }}>
							<Text style={{ marginBottom: 12, marginTop: 16 }}>
								Step 3: Confirm your account
							</Text>
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

							<Button
								disabled={!Code}
								color={'rgb(99, 100, 255)'}
								onPress={onPressConfirm}
							>
								Proceed
							</Button>
						</View>
					</HideOnKeyboardVisibleContainer>
				) : (
					<View style={{ marginHorizontal: 12 }}>
						<View style={{ marginBottom: 54, paddingBottom: 16 }}>
							<HideOnKeyboardVisibleContainer
								style={{ marginBottom: 12, marginTop: 16 }}
							>
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

							<HideOnKeyboardVisibleContainer style={{ marginTop: 24 }}>
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
