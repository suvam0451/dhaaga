import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { ScrollView, TextInput, View, StyleSheet } from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';
import { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import HideOnKeyboardVisibleContainer from '../../../../components/containers/HideOnKeyboardVisibleContainer';
import { Button } from '@rneui/base';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useRealm } from '@realm/react';
import { router } from 'expo-router';
import AtprotoSessionService from '../../../../services/atproto/atproto-session.service';

function SigninBsky() {
	const db = useRealm();
	const { translateY } = useScrollMoreOnPageEnd();

	const [Username, setUsername] = useState(null);
	const [Password, setPassword] = useState(null);

	async function onSubmit() {
		if (!Username || !Password) {
			return;
		}

		const { success, reason } = await AtprotoSessionService.login(
			db,
			Username,
			Password,
		);

		if (success) {
			router.replace('/profile/settings/accounts');
		} else {
			console.log(reason);
		}
	}

	return (
		<AppTopNavbar
			title={'Bluesky Log in'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<ScrollView
				contentContainerStyle={{ paddingTop: 54, paddingHorizontal: 8 }}
			>
				<View style={{ height: 32 }} />
				<View style={styles.inputContainerRoot}>
					<View style={styles.inputContainer}>
						<AntDesign name="user" size={24} color={APP_FONT.MONTSERRAT_BODY} />
					</View>
					<TextInput
						style={{
							fontSize: 16,
							color: APP_FONT.MONTSERRAT_HEADER,
							textDecorationLine: 'none',
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							flex: 1,
						}}
						autoCapitalize={'none'}
						placeholderTextColor={APP_FONT.MONTSERRAT_BODY}
						placeholder="Username or email address"
						onChangeText={setUsername}
						value={Username}
					/>
				</View>
				<View style={styles.inputContainerRoot}>
					<View style={styles.inputContainer}>
						<AntDesign name="lock" size={24} color={APP_FONT.MONTSERRAT_BODY} />
					</View>
					<TextInput
						style={{
							fontSize: 16,
							color: APP_FONT.MONTSERRAT_HEADER,
							textDecorationLine: 'none',
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							flex: 1,
						}}
						autoCapitalize={'none'}
						placeholder="App Password"
						placeholderTextColor={APP_FONT.MONTSERRAT_BODY}
						onChangeText={setPassword}
						value={Password}
					/>
				</View>
				<HideOnKeyboardVisibleContainer style={{ marginTop: 24 }}>
					<View style={{ alignItems: 'center' }}>
						<Button
							disabled={false}
							color={'rgb(99, 100, 255)'}
							onPress={onSubmit}
							buttonStyle={{ width: 128 }}
						>
							Log In
						</Button>
					</View>
				</HideOnKeyboardVisibleContainer>
			</ScrollView>
		</AppTopNavbar>
	);
}

const styles = StyleSheet.create({
	inputContainerRoot: {
		flexDirection: 'row',
		borderWidth: 2,
		borderColor: 'rgba(136,136,136,0.4)',
		borderRadius: 8,
		marginBottom: 12,
	},
	inputContainer: { width: 24 + 8 * 2, padding: 8 },
});

export default SigninBsky;
