import { Dimensions, View, Keyboard } from 'react-native';
import { Text } from '@rneui/themed';
import { useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import { MainText } from '../../../../styles/Typography';
import { Button } from '@rneui/base';
import * as Crypto from 'expo-crypto';

import { verifyToken } from '@dhaaga/shared-provider-misskey/src';
import AccountCreationPreview, {
	AccountCreationPreviewProps,
} from '../../../../components/app/AccountDisplay';
import TitleOnlyStackHeaderContainer from '../../../../components/containers/TitleOnlyStackHeaderContainer';
import { FontAwesome } from '@expo/vector-icons';
import { APP_FONT } from '../../../../styles/AppTheme';
import AccountRepository from '../../../../repositories/account.repo';
import { useRealm } from '@realm/react';

function MisskeySignInStack({ route, navigation }) {
	const [Session, setSession] = useState<string>('');
	const [PreviewCard, setPreviewCard] =
		useState<AccountCreationPreviewProps | null>(null);
	const [Token, setToken] = useState<string | null>(null);
	const [MisskeyId, setMisskeyId] = useState<string | null>(null);
	const db = useRealm();

	useEffect(() => {
		try {
			const regex = /^https:\/\/(.*?)\/miauth\/(.*?)\?.*?/;
			if (regex.test(route?.params?.signInUrl)) {
				const session = regex.exec(route?.params?.signInUrl)[2];
				setSession(session);
			}
		} catch (e) {
			setSession(Crypto.randomUUID() as unknown as string);
		}
	}, []);

	const [SessionConfirmed, setSessionConfirmed] = useState(false);
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				setKeyboardVisible(true); // or some other action
			},
		);
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setKeyboardVisible(false); // or some other action
			},
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	const signInUrl = route?.params?.signInUrl || 'https://mastodon.social';
	const subdomain = route?.params?.subdomain;

	function callback(state) {
		const regex = /^https:\/\/example.com\/\?session=(.*?)/;
		if (regex.test(state.url)) {
			setSessionConfirmed(true);
			autoVerifyFromSession();
		}
	}

	async function autoVerifyFromSession() {
		const res = await verifyToken(subdomain, Session);
		if (res.ok) {
			setPreviewCard({
				displayName: res?.user?.name,
				username: res?.user?.username,
				avatar: res?.user?.avatarUrl,
			});
			setToken(res.token);
			setMisskeyId(res.user.id);
		}
	}

	async function onPressConfirm() {
		console.log('confirm pressed...');
		console.log(PreviewCard, subdomain);
		try {
			db.write(() => {
				const acct = AccountRepository.upsert(db, {
					subdomain: subdomain,
					domain: 'misskey',
					username: PreviewCard.username,
					avatarUrl: PreviewCard.avatar,
				});
				console.log(
					'reached here...',
					PreviewCard.displayName,
					PreviewCard.avatar,
					MisskeyId,
					Token,
				);

				AccountRepository.setSecret(
					db,
					acct,
					'display_name',
					PreviewCard.displayName || '',
				);
				AccountRepository.setSecret(db, acct, 'avatar', PreviewCard.avatar);
				AccountRepository.setSecret(db, acct, 'misskey_id', MisskeyId);
				AccountRepository.setSecret(db, acct, 'access_token', Token);

				console.log('done', acct);
			});

			navigation.navigate('Select an Account');
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<TitleOnlyStackHeaderContainer
			route={route}
			navigation={navigation}
			headerTitle={`Misskey Sign-In`}
		>
			<View style={{ height: '100%' }}>
				{!SessionConfirmed && (
					<WebView
						style={{
							flex: 1,
							minWidth: Dimensions.get('window').width - 20,
						}}
						source={{ uri: signInUrl }}
						onNavigationStateChange={callback}
					/>
				)}
				{!isKeyboardVisible && (
					<View style={{ height: 160 }}>
						<MainText style={{ marginBottom: 12, marginTop: 16 }}>
							Step 2: Confirm your account
						</MainText>
						{PreviewCard && <AccountCreationPreview {...PreviewCard} />}
						{SessionConfirmed ? (
							<View
								style={{
									width: '100%',
									marginTop: 16,
									marginBottom: 32,
								}}
							>
								<View
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										marginBottom: 8,
									}}
								>
									<View style={{ flexShrink: 1, minWidth: 24 }}>
										<FontAwesome
											name="check-square"
											size={24}
											color={
												'linear-gradient(90deg, rgb(0, 179, 50), rgb(170,' +
												' 203, 0))'
											}
										/>
									</View>
									<Text>Your token has been confirmed.</Text>
								</View>
								<View
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'flex-start',
										marginBottom: 8,
									}}
								>
									<View style={{ flexShrink: 1, maxWidth: 24 }}>
										<FontAwesome
											name="check-square"
											size={24}
											color={APP_FONT.MONTSERRAT_HEADER}
										/>
									</View>
									<View>
										<Text style={{ textAlign: 'left' }}>
											Confirm that you want to use this account.
										</Text>
									</View>
								</View>
							</View>
						) : (
							<View></View>
						)}
						<Button
							disabled={!SessionConfirmed}
							color={
								'linear-gradient(90deg, rgb(0, 179, 50), rgb(170,' + ' 203, 0))'
							}
							onPress={onPressConfirm}
							size={'lg'}
						>
							<Text
								style={{
									fontSize: 16,
									fontFamily: 'Montserrat-Bold',
								}}
							>
								Confirm
							</Text>
						</Button>
					</View>
				)}
			</View>
		</TitleOnlyStackHeaderContainer>
	);
}

export default MisskeySignInStack;
