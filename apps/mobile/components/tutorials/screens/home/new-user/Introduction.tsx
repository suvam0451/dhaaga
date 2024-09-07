import { Animated, StatusBar, StyleSheet, View, Text } from 'react-native';
import TimelinesHeader from '../../../../shared/topnavbar/fragments/TopNavbarTimelineStack';
import { memo, useState } from 'react';
import { Button, Dialog } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import { router } from 'expo-router';
import FabMenuCore from '../../../../shared/fab/Core';
import { FAB_MENU_MODULES } from '../../../../../types/app.types';
import { APP_FONTS } from '../../../../../styles/AppFonts';

function IntroductionBase() {
	const [DialogVisible, setDialogVisible] = useState(false);

	function takeUserToAccountsPage() {
		router.navigate('accounts');
	}

	return (
		<View style={{ height: '100%', flex: 1, backgroundColor: '#121212' }}>
			<StatusBar backgroundColor={APP_THEME.DARK_THEME_MENUBAR} />
			<Animated.View style={styles.header}>
				<TimelinesHeader title={'Introduction'} />
			</Animated.View>
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
								fontSize: 20,
								fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								textAlign: 'center',
							}}
						>
							Welcome!
						</Text>
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								color: APP_FONT.MONTSERRAT_HEADER,
								marginTop: 16,
								textAlign: 'center',
							}}
						>
							Dhaaga is a{' '}
							<Text
								style={{
									color: APP_THEME.LINK,
									fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								}}
								// onPress={() => {
								// 	setDialogVisible(true);
								// }}
							>
								Social Networking client
							</Text>
							, offering a modern UI, Innovative features, and comes packed with
							privacy and digital well-being tools.
						</Text>
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								color: APP_FONT.MONTSERRAT_HEADER,
								marginTop: 16,
								textAlign: 'center',
							}}
						>
							Currently available for Mastodon and being developed for Misskey
							eventually.
						</Text>
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								color: APP_FONT.MONTSERRAT_HEADER,
								marginTop: 16,
								textAlign: 'center',
							}}
						>
							To use this app, you will need a Mastodon account.
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
								I am new to Mastodon
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
								I am new to this app
							</Button>
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
								Just take me to Login
							</Button>
						</View>
					</View>
					<View style={{ flexShrink: 1 }}>
						<Text
							style={{
								color: APP_FONT.MONTSERRAT_BODY,
								fontSize: 12,
								fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								opacity: 0.87,
							}}
						>
							{'Built with' + ' 💛 by Debashish Patra'}
						</Text>
					</View>
				</View>
			</View>
			<FabMenuCore menuItems={[FAB_MENU_MODULES.NAVIGATOR]} />
		</View>
	);
}

const Introduction = memo(IntroductionBase);

export default Introduction;

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
});
