import { Alert, Dimensions, View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import { Button, Card } from '@rneui/base';
import { verifyMisskeyToken } from '@dhaaga/bridge';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { APP_FONT } from '../../../../../../styles/AppTheme';
import { router, useLocalSearchParams } from 'expo-router';
import WithAutoHideTopNavBar from '../../../../../containers/WithAutoHideTopNavBar';
import HideOnKeyboardVisibleContainer from '../../../../../containers/HideOnKeyboardVisibleContainer';
import useScrollMoreOnPageEnd from '../../../../../../states/useScrollMoreOnPageEnd';
import { AccountService } from '../../../../../../database/entities/account';
import { RandomUtil } from '../../../../../../utils/random.utils';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import { APP_ROUTING_ENUM } from '../../../../../../utils/route-list';
import { ACCOUNT_METADATA_KEY } from '../../../../../../database/entities/account-metadata';
import { Image } from 'expo-image';
import {
	useAppDb,
	useAppPublishers,
	useAppTheme,
	useHub,
} from '../../../../../../hooks/utility/global-state-extractors';
import { APP_EVENT_ENUM } from '../../../../../../services/publishers/app.publisher';

export type AccountCreationPreviewProps = {
	avatar: string;
	displayName: string;
	username: string;
};

function AccountCreationPreview({
	avatar,
	displayName,
	username,
}: AccountCreationPreviewProps) {
	return (
		<Card
			wrapperStyle={{
				height: 48,
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
			}}
			containerStyle={{
				margin: 0,
				padding: 8,
				backgroundColor: '#E5FFDA',
				borderRadius: 4,
			}}
		>
			<View>
				{avatar && (
					<View style={{ height: 48, width: 48 }}>
						{/*@ts-ignore-next-line*/}
						<Image
							style={styles.image}
							source={avatar}
							contentFit="fill"
							transition={1000}
						/>
					</View>
				)}
			</View>
			<View style={{ marginLeft: 8, flexGrow: 1 }}>
				<Text style={{ fontWeight: '500' }}>{displayName}</Text>
				<Text style={{ color: 'gray', fontSize: 14 }}>{username}</Text>
			</View>
			<View
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					flexDirection: 'row',
					marginRight: 8,
					alignItems: 'center',
				}}
			>
				<Ionicons name="menu-outline" size={32} color="black" />
			</View>
		</Card>
	);
}

function MisskeySignInStack() {
	const [Session, setSession] = useState<string>('');
	const [PreviewCard, setPreviewCard] =
		useState<AccountCreationPreviewProps | null>(null);
	const [Token, setToken] = useState<string | null>(null);
	const [MisskeyId, setMisskeyId] = useState<string | null>(null);
	const { appSub } = useAppPublishers();
	const { db } = useAppDb();
	const { theme } = useAppTheme();
	const { loadAccounts } = useHub();

	const params = useLocalSearchParams();
	const _signInUrl: string = params['signInUrl'] as string;
	const _subdomain: string = params['subdomain'] as string;
	const _domain: string = params['domain'] as string;

	useEffect(() => {
		try {
			const regex = /^https:\/\/(.*?)\/miauth\/(.*?)\?.*?/;
			if (regex.test(_signInUrl)) {
				const session = regex.exec(_signInUrl)[2];
				setSession(session);
			}
		} catch (e) {
			setSession(RandomUtil.nanoId());
		}
	}, []);

	const [SessionConfirmed, setSessionConfirmed] = useState(false);

	// Misskey has no use for the callback token
	function callback(state) {
		const regex = /^https:\/\/suvam.io\/\?session=(.*?)/;
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
				{
					key: ACCOUNT_METADATA_KEY.DISPLAY_NAME,
					value: PreviewCard.displayName,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.AVATAR_URL,
					value: PreviewCard.avatar,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.USER_IDENTIFIER,
					value: MisskeyId,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.ACCESS_TOKEN,
					value: Token,
					type: 'string',
				},
			],
		);
		if (upsertResult.type === 'success') {
			Alert.alert('Account Added. Refresh if any screen is outdated.');
			appSub.publish(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED);
			loadAccounts();
			``;
			router.replace(APP_ROUTING_ENUM.SETTINGS_TAB_ACCOUNTS);
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
						<Text
							style={{
								marginBottom: 12,
								marginTop: 16,
								color: theme.textColor.high,
								fontFamily: APP_FONTS.INTER_700_BOLD,
							}}
						>
							Step 2: Confirm your account
						</Text>
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
									<Text
										style={{
											color: theme.textColor.medium,
											fontFamily: APP_FONTS.INTER_400_REGULAR,
										}}
									>
										Your token has been confirmed.
									</Text>
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
										<Text
											style={{
												textAlign: 'left',
												color: theme.textColor.medium,
												fontFamily: APP_FONTS.INTER_400_REGULAR,
											}}
										>
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
									color: theme.textColor.high,
									fontFamily: APP_FONTS.INTER_700_BOLD,
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		flex: 1,
		width: 48,
		backgroundColor: '#0553',
	},
});
