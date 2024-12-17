import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { ScrollView, TextInput, View, StyleSheet } from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';
import { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Button } from '@rneui/base';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { router } from 'expo-router';
import AtprotoSessionService from '../../../../services/atproto/atproto-session.service';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_ROUTE_ENUM } from '../../../../utils/route-list';

function SigninBsky() {
	const { db } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
		})),
	);
	const { translateY } = useScrollMoreOnPageEnd();

	const [Username, setUsername] = useState(null);
	const [Password, setPassword] = useState(null);

	async function onSubmit() {
		if (!Username || !Password) {
			return;
		}

		try {
			const { success, reason } = await AtprotoSessionService.login(
				db,
				Username,
				Password,
			);

			if (success) {
				router.replace(APP_ROUTE_ENUM.PROFILE_ACCOUNTS);
			} else {
				console.log(reason);
			}
		} catch (e) {
			console.log('[ERROR]: bsky login failed', e);
		}
	}

	return (
		<AppTopNavbar
			title={'Bluesky Sign In'}
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

				<View style={{ alignItems: 'center', marginTop: 16 }}>
					<Button
						disabled={false}
						color={'rgb(99, 100, 255)'}
						onPress={onSubmit}
						buttonStyle={{ width: 128, borderRadius: 8 }}
					>
						Log In
					</Button>
				</View>
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
