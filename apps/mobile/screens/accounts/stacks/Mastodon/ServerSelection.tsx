import {
	View,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
} from 'react-native';
import { Text } from '@rneui/themed';
import { useState } from 'react';
import { Button } from '@rneui/base';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import ActivityPubService from '../../../../services/activitypub.service';
import { router } from 'expo-router';
import HideOnKeyboardVisibleContainer from '../../../../components/containers/HideOnKeyboardVisibleContainer';
import WithAutoHideTopNavBar from '../../../../components/containers/WithAutoHideTopNavBar';
import { APP_FONTS } from '../../../../styles/AppFonts';

function AccountsScreen() {
	const [Subdomain, setSubdomain] = useState('mastodon.social');

	async function onPressNext() {
		const signInStrategy = await ActivityPubService.signInUrl(Subdomain);
		router.push({
			pathname: 'accounts/signin-md',
			params: {
				signInUrl: signInStrategy?.loginUrl,
				subdomain: Subdomain,
				domain: signInStrategy?.software,
			},
		});
	}

	const popularServers = [
		{ value: 'mastodon.social', label: 'mastodon.social' },
		{ value: 'fosstodon.org', label: 'fosstodon.org' },
		{ value: 'pawoo.net', label: '🇯🇵 pawoo.net' },
		{ value: 'mastodon.art', label: 'mastodon.art' },
		{ value: 'mstdn.social', label: 'mstdn.social' },
		{ value: 'mastodon.world', label: 'mastodon.world' },
		{ value: 'pixelfed.social', label: 'pixelfed.social' },
		{ value: 'mstdn.jp', label: '🇯🇵 mstdn.jp' },
		{ value: 'mastodon.cloud', label: 'mastodon.cloud' },
		{ value: 'mastodon.online', label: 'mastodon.online' },
	];

	return (
		<WithAutoHideTopNavBar title={`Select Instance`}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{
					display: 'flex',
					paddingHorizontal: 12,
					marginBottom: 54,
				}}
			>
				<View
					style={{
						display: 'flex',
						flexGrow: 1,
						height: '100%',
					}}
				>
					<View style={{ flexGrow: 1 }}>
						<HideOnKeyboardVisibleContainer>
							<Text style={styles.sectionHeaderText}>
								Step 1: Select your server
							</Text>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
								{popularServers.map((server, i) => (
									<TouchableOpacity
										key={i}
										onPress={() => {
											setSubdomain(server.value);
										}}
									>
										<View
											style={{
												padding: 8,
												margin: 4,
												backgroundColor: APP_THEME.CARD_BACKGROUND_DARKEST,
												borderRadius: 4,
											}}
										>
											<Text
												style={{
													color: APP_FONT.MONTSERRAT_BODY,
													fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
												}}
											>
												{server.label}
											</Text>
										</View>
									</TouchableOpacity>
								))}
							</View>
						</HideOnKeyboardVisibleContainer>
						<Text style={styles.sectionHeaderText}>Or, enter it manually</Text>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Text style={{ fontSize: 16, color: 'gray' }}>https://</Text>
							<TextInput
								style={{
									fontSize: 16,
									color: APP_THEME.LINK,
									textDecorationLine: 'underline',
								}}
								placeholder="mastodon.social"
								defaultValue="mastodon.social"
								onChangeText={setSubdomain}
								value={Subdomain}
							/>
							<Text style={{ fontSize: 16, color: 'gray' }}>
								/oauth/authorize
							</Text>
						</View>
					</View>
					<View style={{ marginBottom: 32 }}>
						<Button
							style={{ width: 100, marginBottom: 32 }}
							onPress={onPressNext}
							color={'rgb(99, 100, 255)'}
						>
							Next
						</Button>
					</View>
				</View>
			</KeyboardAvoidingView>
		</WithAutoHideTopNavBar>
	);
}

const styles = StyleSheet.create({
	sectionHeaderText: {
		marginTop: 32,
		marginBottom: 12,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 20,
		fontFamily: APP_FONTS.MONTSERRAT_800_EXTRABOLD,
	},
});

export default AccountsScreen;
