import { Text, View } from 'react-native';
import { memo, useState } from 'react';
import { Button, Dialog } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import { router } from 'expo-router';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../../states/useScrollMoreOnPageEnd';
import { APP_ROUTING_ENUM } from '../../../../../utils/route-list';

function IntroductionBase() {
	const [DialogVisible, setDialogVisible] = useState(false);

	function takeUserToAccountsPage() {
		router.navigate(APP_ROUTING_ENUM.SETTINGS_TAB_ACCOUNTS);
	}

	const { translateY } = useScrollMoreOnPageEnd();

	function onDbCheck() {}

	return (
		<AppTopNavbar
			title={'Welcome!'}
			type={APP_TOPBAR_TYPE_ENUM.LANDING_GENERIC}
			translateY={translateY}
		>
			{/*<StatusBar backgroundColor={APP_THEME.DARK_THEME_MENUBAR} />*/}
			<Dialog
				isVisible={DialogVisible}
				onBackdropPress={() => {
					setDialogVisible(false);
				}}
				overlayStyle={{ backgroundColor: '#1E1E1E', borderRadius: 8 }}
				backdropStyle={{
					opacity: 0.87,
					backgroundColor: APP_THEME.BACKGROUND,
				}}
			>
				<Dialog.Title titleStyle={{ color: APP_THEME.LINK }}>
					Social Networking Definition
				</Dialog.Title>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						color: APP_FONT.MONTSERRAT_BODY,
						marginBottom: 4,
					}}
				>
					A{' '}
					<Text
						style={{
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
							color: APP_THEME.LINK,
							marginBottom: 16,
						}}
					>
						social networking client
					</Text>{' '}
					focuses on creating and maintaining relationships.
				</Text>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						color: APP_FONT.MONTSERRAT_BODY,
						marginBottom: 24,
					}}
				>
					e.g.- Facebook, MySpace
				</Text>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						color: APP_FONT.MONTSERRAT_BODY,
						marginBottom: 4,
					}}
				>
					A{' '}
					<Text
						style={{
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
							color: APP_THEME.LINK,
						}}
					>
						social media client
					</Text>
					, in comparison, is centered around the sharing and consumption of
					content (photos, videos, and articles).
				</Text>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						color: APP_FONT.MONTSERRAT_BODY,
						marginBottom: 24,
					}}
				>
					e.g. - Instagram, Twitter, Youtube
				</Text>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						color: APP_FONT.MONTSERRAT_BODY,
						marginBottom: 24,
					}}
				>
					Both do similar thing. But, the emphasis differs.
				</Text>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						color: APP_THEME.LINK,
					}}
				>
					I built this app to make it easier for people (myself mostly, xD) to
					follow/interact with their favourite communities and make friends on
					the fediverse. ☺️
				</Text>
			</Dialog>
			<View style={{ height: '100%', paddingTop: 54, flexGrow: 1 }}>
				<View
					style={{
						padding: 10,
						display: 'flex',
						alignItems: 'center',
						height: '100%',
					}}
				>
					<View style={{ flexGrow: 1, maxWidth: 256, marginTop: 32 }}>
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
								color: APP_FONT.MONTSERRAT_BODY,
								marginTop: 16,
								textAlign: 'center',
								fontSize: 16,
							}}
						>
							Dhaaga is a{' '}
							<Text
								style={{
									color: APP_THEME.LINK,
									fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								}}
								onPress={() => {
									setDialogVisible(true);
								}}
							>
								fediverse social app
							</Text>
							, which works with your favourite SNS platform, adds a cool
							interface and packs tons of cool features to make your fedi
							experience better.
						</Text>
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
								color: APP_FONT.MONTSERRAT_BODY,
								marginTop: 16,
								textAlign: 'center',
								fontSize: 16,
							}}
						>
							Put the fun back in fediverse!
						</Text>
						<View style={{ marginTop: 32 }}>
							<Button
								buttonStyle={{
									marginBottom: 8,
								}}
								color={APP_THEME.INVALID_ITEM}
								titleStyle={{
									color: APP_THEME.INVALID_ITEM,
									fontFamily: APP_FONTS.INTER_700_BOLD,
								}}
								type={'clear'}
								onPress={() => {
									router.navigate('/new-to-fedi');
								}}
							>
								I am new to Fediverse
							</Button>
							<Button
								type={'clear'}
								color={APP_THEME.INVALID_ITEM}
								buttonStyle={{
									marginBottom: 24,
								}}
								titleStyle={{
									color: APP_THEME.INVALID_ITEM,
									fontFamily: APP_FONTS.INTER_700_BOLD,
								}}
								onPress={() => {
									router.navigate('/new-to-app');
								}}
							>
								I am new to the app
							</Button>
							<Button title={'Db check'} onPress={onDbCheck} />
							<Button
								type={'solid'}
								color={APP_THEME.INVALID_ITEM}
								style={{ marginBottom: 16 }}
								size={'md'}
								onPress={takeUserToAccountsPage}
								titleStyle={{
									fontFamily: APP_FONTS.INTER_700_BOLD,
									color: APP_FONT.MONTSERRAT_HEADER,
									fontSize: 15,
								}}
							>
								Login
							</Button>
							<Text
								style={{
									fontFamily: APP_FONTS.INTER_500_MEDIUM,
									color: APP_FONT.MONTSERRAT_BODY,
									marginTop: 16,
									textAlign: 'center',
								}}
							>
								Mastodon, Misskey, Sharkey, Firefish, Pleroma and Akkoma
							</Text>
						</View>
					</View>
				</View>
			</View>
		</AppTopNavbar>
	);
}

const Introduction = memo(IntroductionBase);

export default Introduction;
