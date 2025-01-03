import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Button } from '@rneui/base';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { router } from 'expo-router';
import AtprotoSessionService from '../../../../services/atproto/atproto-session.service';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import { AppText } from '../../../../components/lib/Text';
import {
	useAppPublishers,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { APP_EVENT_ENUM } from '../../../../services/publishers/app.publisher';
import { Loader } from '../../../../components/lib/Loader';

function SigninBsky() {
	const [IsLoading, setIsLoading] = useState(false);
	const { theme } = useAppTheme();
	const { db } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
		})),
	);
	const { translateY } = useScrollMoreOnPageEnd();
	const { appSub } = useAppPublishers();

	const [Username, setUsername] = useState(null);
	const [Password, setPassword] = useState(null);

	async function onSubmit() {
		setIsLoading(true);
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
				Alert.alert('Account Added. Refresh if any screen is outdated.');
				appSub.publish(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED);
				router.replace(APP_ROUTING_ENUM.SETTINGS_TAB_ACCOUNTS);
			} else {
				console.log(reason);
			}
		} catch (e) {
			console.log('[ERROR]: bsky login failed', e);
		} finally {
			setIsLoading(false);
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
				<AppText.H1
					style={{ textAlign: 'center', paddingVertical: 16, marginBottom: 32 }}
				>
					Enter Server Details
				</AppText.H1>
				<View style={styles.inputContainerRoot}>
					<View style={styles.inputContainer}>
						<AntDesign name="user" size={24} color={theme.secondary.a30} />
					</View>

					<TextInput
						style={{
							fontSize: 16,
							color: theme.secondary.a30,
							textDecorationLine: 'none',
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							flex: 1,
						}}
						autoCapitalize={'none'}
						placeholderTextColor={theme.secondary.a30}
						placeholder="Username or email address"
						onChangeText={setUsername}
						value={Username}
					/>
				</View>
				<View style={styles.inputContainerRoot}>
					<View style={styles.inputContainer}>
						<AntDesign name="lock" size={24} color={theme.secondary.a30} />
					</View>
					<TextInput
						style={{
							fontSize: 16,
							color: theme.secondary.a30,
							textDecorationLine: 'none',
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							flex: 1,
						}}
						autoCapitalize={'none'}
						placeholder="App Password"
						placeholderTextColor={theme.secondary.a30}
						onChangeText={setPassword}
						value={Password}
					/>
				</View>

				<View style={{ alignItems: 'center', marginTop: 16 }}>
					{IsLoading ? (
						<View style={{ paddingVertical: 16 }}>
							<Loader />
						</View>
					) : (
						<Button
							disabled={false}
							color={theme.primary.a0}
							onPress={onSubmit}
							buttonStyle={{ width: 128, borderRadius: 8 }}
						>
							<AppText.SemiBold style={{ fontSize: 16, color: 'black' }}>
								Log In
							</AppText.SemiBold>
						</Button>
					)}
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
