import { useState } from 'react';
import {
	TouchableOpacity,
	View,
	Text,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
} from 'react-native';
import { Button } from '@rneui/base';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import WithAutoHideTopNavBar from '../../../../components/containers/WithAutoHideTopNavBar';
import HideOnKeyboardVisibleContainer from '../../../../components/containers/HideOnKeyboardVisibleContainer';
import { router } from 'expo-router';
import ActivityPubService from '../../../../services/activitypub.service';
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';

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
			pathname: 'accounts/signin-mk',
			params: {
				signInUrl: signInStrategy?.loginUrl,
				subdomain,
				domain: signInStrategy?.software,
			},
		});
	}

	const popularServers = [
		{ value: 'misskey.io', label: 'misskey.io' },
		{ value: 'misskey.dev', label: 'misskey.dev' },
		{ value: 'misskey.id', label: ' 🇮🇩misskey.id' },
		{ value: 'hallsofamenti.io', label: 'hallsofamenti.io' },
	];

	return (
		<WithAutoHideTopNavBar title={`Select Instance`}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{
					display: 'flex',
					marginTop: 16,
					marginBottom: 54,
					paddingHorizontal: 12,
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
							<View>
								<Text style={styles.sectionHeaderText}>
									Step 1: Select your server
								</Text>
								<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
									{popularServers.map((server, i) => (
										<TouchableOpacity
											key={i}
											onPress={() => {
												setInputText(server.value);
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
								placeholder="misskey.io"
								defaultValue="misskey.io"
								onChangeText={setInputText}
								value={InputText}
								autoCapitalize={'none'}
							/>
							<Text style={{ fontSize: 16, color: 'gray' }}>
								{'/miauth/{session}'}
							</Text>
						</View>
					</View>
					<View style={{ marginBottom: 32 }}>
						<Button
							color={
								'linear-gradient(90deg, rgb(0, 179, 50), rgb(170, 203, 0))'
							}
							style={{ width: 100, marginBottom: 32 }}
							onPress={onPressNext}
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

export default MisskeyServerSelection;
