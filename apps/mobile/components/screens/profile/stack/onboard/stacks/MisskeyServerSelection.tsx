import { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	ScrollView,
} from 'react-native';
import { Button } from '@rneui/base';
import { APP_FONT } from '../../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import HideOnKeyboardVisibleContainer from '../../../../../containers/HideOnKeyboardVisibleContainer';
import { router } from 'expo-router';
import ActivityPubService from '../../../../../../services/activitypub.service';
import { useGlobalMmkvContext } from '../../../../../../states/useGlobalMMkvCache';
import useScrollMoreOnPageEnd from '../../../../../../states/useScrollMoreOnPageEnd';
import Feather from '@expo/vector-icons/Feather';
import PopularServers from '../fragments/PopularServers';
import {
	POPULAR_FIREFISH_SERVERS,
	POPULAR_MISSKEY_SERVERS,
	POPULAR_SHARKEY_SERVERS,
} from '../data/server-meta';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../../shared/topnavbar/AppTopNavbar';

function MisskeyServerSelection() {
	const [InputText, setInputText] = useState('misskey.io');
	const { globalDb } = useGlobalMmkvContext();

	async function onPressNext() {
		const signInStrategy = await ActivityPubService.signInUrl(
			InputText,
			globalDb,
		);
		const subdomain = InputText;
		router.push({
			pathname: 'profile/onboard/signin-mk',
			params: {
				signInUrl: signInStrategy?.loginUrl,
				subdomain,
				domain: signInStrategy?.software,
			},
		});
	}

	const { translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	return (
		<AppTopNavbar
			title={`Select Instance`}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<ScrollView
				contentContainerStyle={{
					marginTop: 54,
				}}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={{
						display: 'flex',
						marginTop: 16,
						marginBottom: 54,
						paddingHorizontal: 12,
					}}
				>
					<View>
						<Text
							style={{
								textAlign: 'center',
								color: APP_FONT.MONTSERRAT_BODY,
								marginBottom: 24,
								fontSize: 24,
								fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							}}
						>
							Enter your server
						</Text>
						<View style={styles.inputContainerRoot}>
							<View style={styles.inputContainer}>
								<Feather
									name="server"
									size={24}
									color={APP_FONT.MONTSERRAT_BODY}
								/>
							</View>
							<TextInput
								style={{
									fontSize: 16,
									color: APP_FONT.MONTSERRAT_HEADER,
									textDecorationLine: 'none',
									fontFamily: APP_FONTS.INTER_500_MEDIUM,
									flex: 1,
									marginLeft: 4,
								}}
								autoCapitalize={'none'}
								placeholderTextColor={APP_FONT.MONTSERRAT_BODY}
								placeholder="Your server url"
								onChangeText={setInputText}
								value={InputText}
							/>
						</View>

						<View style={{ alignItems: 'center', marginTop: 16 }}>
							<Button
								disabled={false}
								color={
									'linear-gradient(90deg, rgb(0, 179, 50), rgb(170, 203, 0))'
								}
								onPress={onPressNext}
								buttonStyle={{ width: 128, borderRadius: 8 }}
							>
								Log In
							</Button>
						</View>
					</View>

					<View style={{ height: 32 }} />
					<HideOnKeyboardVisibleContainer>
						<PopularServers
							label={'Popular Misskey Servers'}
							items={POPULAR_MISSKEY_SERVERS}
							onSelect={setInputText}
						/>
						<PopularServers
							label={'Popular Sharkey Servers'}
							items={POPULAR_SHARKEY_SERVERS}
							onSelect={setInputText}
						/>
						<PopularServers
							label={'Popular Firefish Servers'}
							items={POPULAR_FIREFISH_SERVERS}
							onSelect={setInputText}
						/>
					</HideOnKeyboardVisibleContainer>
				</KeyboardAvoidingView>
				<View style={{ height: 16 }} />
			</ScrollView>
		</AppTopNavbar>
	);
}

const styles = StyleSheet.create({
	sectionHeaderText: {
		marginTop: 32,
		marginBottom: 12,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		textAlign: 'center',
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
	inputContainerRoot: {
		flexDirection: 'row',
		borderWidth: 2,
		borderColor: 'rgba(136,136,136,0.4)',
		borderRadius: 8,
		marginBottom: 12,
	},
	inputContainer: { width: 24 + 8 * 2, padding: 8 },
});

export default MisskeyServerSelection;
