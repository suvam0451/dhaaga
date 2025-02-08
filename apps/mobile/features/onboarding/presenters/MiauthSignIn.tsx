import { Dimensions, View, Text, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { Button, Card } from '@rneui/base';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { APP_FONT } from '../../../styles/AppTheme';
import WithAutoHideTopNavBar from '../../../components/containers/WithAutoHideTopNavBar';
import HideOnKeyboardVisibleContainer from '../../../components/containers/HideOnKeyboardVisibleContainer';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { APP_FONTS } from '../../../styles/AppFonts';
import { Image } from 'expo-image';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import useMiauthLogin from '../interactors/useMiauthLogin';
import { appDimensions } from '../../../styles/dimensions';

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
	const { theme } = useAppTheme();
	const { callback, confirm, sessionConfirmed, loginUri, previewCard } =
		useMiauthLogin();
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<WithAutoHideTopNavBar translateY={translateY} title={`Misskey Sign-In`}>
			<View
				style={{
					flex: 1,
					marginTop: appDimensions.topNavbar.scrollViewTopPadding,
				}}
			>
				{!sessionConfirmed && (
					<WebView
						style={{
							flex: 1,
							minWidth: Dimensions.get('window').width - 20,
						}}
						source={{ uri: loginUri }}
						onNavigationStateChange={callback}
					/>
				)}

				<HideOnKeyboardVisibleContainer>
					<View
						style={{ height: sessionConfirmed ? 160 : 0, marginHorizontal: 12 }}
					>
						{previewCard && <AccountCreationPreview {...previewCard} />}
						{sessionConfirmed ? (
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
							disabled={!sessionConfirmed}
							color={
								'linear-gradient(90deg, rgb(0, 179, 50), rgb(170,' + ' 203, 0))'
							}
							onPress={confirm}
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
