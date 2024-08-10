import { Dimensions, View, ScrollView } from 'react-native';
import { Text } from '@rneui/themed';
import { useState } from 'react';
import WebView from 'react-native-webview';
import { MainText } from '../../../../styles/Typography';
import { Button } from '@rneui/base';
import { useRealm } from '@realm/react';
import TitleOnlyNoScrollContainer from '../../../../components/containers/TitleOnlyNoScrollContainer';
import HideOnKeyboardVisibleContainer from '../../../../components/containers/HideOnKeyboardVisibleContainer';
import { router, useLocalSearchParams } from 'expo-router';
import AccountService from '../../../../services/account.service';
import { UnknownRestClient } from '@dhaaga/shared-abstraction-activitypub';

function MastodonSignInStack() {
	const [Code, setCode] = useState<string | null>(null);
	const db = useRealm();

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
				token,
			);

		try {
			AccountService.upsert(db, {
				subdomain: _subdomain,
				domain: _domain,
				username: verified.username,
				avatarUrl: verified.avatar,
				// TODO: this needs to be replaced with camelCase
				displayName: verified['display_name'],
				credentials: [
					{
						key: 'display_name',
						value: verified['display_name'],
					},
					{
						key: 'avatar',
						value: verified['avatar'],
					},
					{
						key: 'url',
						value: verified.url,
					},
					{
						key: 'access_token',
						value: token,
					},
				],
			});
			router.replace('/accounts/landing');
		} catch (e) {
			console.log(e);
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
				<HideOnKeyboardVisibleContainer style={{ marginHorizontal: 12 }}>
					<View style={{ height: 240 }}>
						<MainText style={{ marginBottom: 12, marginTop: 16 }}>
							Step 3: Confirm your account
						</MainText>
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
			</View>
		</TitleOnlyNoScrollContainer>
	);
}

export default MastodonSignInStack;
