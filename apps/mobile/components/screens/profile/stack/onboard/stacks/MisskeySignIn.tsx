import { Alert, Dimensions, View } from 'react-native';
import { Text } from '@rneui/themed';
import { useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import { MainText } from '../../../../../../styles/Typography';
import { Button } from '@rneui/base';
import * as Crypto from 'expo-crypto';
import { verifyMisskeyToken } from '@dhaaga/shared-abstraction-activitypub';
import AccountCreationPreview, {
	AccountCreationPreviewProps,
} from '../../../../../app/AccountDisplay';
import { FontAwesome } from '@expo/vector-icons';
import { APP_FONT } from '../../../../../../styles/AppTheme';
import { router, useLocalSearchParams } from 'expo-router';
import WithAutoHideTopNavBar from '../../../../../containers/WithAutoHideTopNavBar';
import HideOnKeyboardVisibleContainer from '../../../../../containers/HideOnKeyboardVisibleContainer';
import useScrollMoreOnPageEnd from '../../../../../../states/useScrollMoreOnPageEnd';
import { AccountService } from '../../../../../../database/entities/account';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function MisskeySignInStack() {
	const [Session, setSession] = useState<string>('');
	const [PreviewCard, setPreviewCard] =
		useState<AccountCreationPreviewProps | null>(null);
	const [Token, setToken] = useState<string | null>(null);
	const [MisskeyId, setMisskeyId] = useState<string | null>(null);

	const params = useLocalSearchParams();
	const _signInUrl: string = params['signInUrl'] as string;
	const _subdomain: string = params['subdomain'] as string;
	const _domain: string = params['domain'] as string;

	const { db } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
		})),
	);

	useEffect(() => {
		try {
			const regex = /^https:\/\/(.*?)\/miauth\/(.*?)\?.*?/;
			if (regex.test(_signInUrl)) {
				const session = regex.exec(_signInUrl)[2];
				setSession(session);
			}
		} catch (e) {
			setSession(Crypto.randomUUID() as unknown as string);
		}
	}, []);

	const [SessionConfirmed, setSessionConfirmed] = useState(false);

	function callback(state) {
		const regex = /^https:\/\/example.com\/\?session=(.*?)/;
		if (regex.test(state.url)) {
			setSessionConfirmed(true);
			autoVerifyFromSession();
		}
	}

	async function autoVerifyFromSession() {
		const res = await verifyMisskeyToken(`https://${_subdomain}`, Session);
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
		const upsertResult = AccountService.upsert(
			db,
			{
				identifier: MisskeyId,
				server: _subdomain,
				driver: _domain,
				username: PreviewCard.username,
				avatarUrl: PreviewCard.avatar,
				displayName: PreviewCard.displayName,
			},
			[
				{ key: 'display_name', value: PreviewCard.displayName, type: 'string' },
				{
					key: 'avatar',
					value: PreviewCard.avatar,
					type: 'string',
				},
				{ key: 'user_id', value: MisskeyId, type: 'string' },
				{ key: 'access_token', value: Token, type: 'string' },
			],
		);
		if (upsertResult.type === 'success') {
			Alert.alert('Account Added');
			router.replace('/profile/settings/accounts');
		} else {
			console.log(upsertResult);
		}
	}

	const { translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	return (
		<WithAutoHideTopNavBar translateY={translateY} title={`Misskey Sign-In`}>
			<View style={{ height: '100%', marginTop: 52 }}>
				{!SessionConfirmed && (
					<WebView
						style={{
							flex: 1,
							minWidth: Dimensions.get('window').width - 20,
						}}
						source={{ uri: _signInUrl }}
						onNavigationStateChange={callback}
					/>
				)}

				<HideOnKeyboardVisibleContainer>
					<View style={{ height: 160, marginHorizontal: 12 }}>
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
				</HideOnKeyboardVisibleContainer>
			</View>
		</WithAutoHideTopNavBar>
	);
}

export default MisskeySignInStack;
