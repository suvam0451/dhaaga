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
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import { AppText } from '../../../../components/lib/Text';
import {
	useAppAcct,
	useAppDb,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { Loader } from '../../../../components/lib/Loader';
import { Image } from 'expo-image';
import { useAssets } from 'expo-asset';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinkingUtils } from '../../../../utils/linking.utils';
import useAtprotoLogin from '../../../../features/onboarding/interactors/useAtprotoLogin';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../types/app.types';
import { AccountService } from '../../../../database/entities/account';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

// WebBrowser.maybeCompleteAuthSession();

function AddBluesky() {
	const [IsLoading, setIsLoading] = useState(false);
	const { theme } = useAppTheme();
	const { db } = useAppDb();
	const { translateY } = useScrollMoreOnPageEnd();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { acct } = useAppAcct();
	const { loadApp } = useGlobalState(
		useShallow((o) => ({
			loadApp: o.loadApp,
		})),
	);

	const [Username, setUsername] = useState(null);
	const [Password, setPassword] = useState(null);
	const [assets, error] = useAssets([
		require('../../../../assets/branding/bluesky/logo.png'),
		require('../../../../assets/icon.png'),
	]);

	const { isLoading } = useAtprotoLogin();

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
				if (!acct) {
					AccountService.ensureAccountSelection(db);
					loadApp();
				}
				Alert.alert('Account Added. Welcome to Dhaaga.');
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

	if (error || !assets)
		return (
			<AppTopNavbar
				title={t(`topNav.secondary.blueskySignIn`)}
				translateY={translateY}
				type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			>
				<View style={{ flex: 1 }} />
			</AppTopNavbar>
		);

	return (
		<AppTopNavbar
			title={t(`topNav.secondary.blueskySignIn`)}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<ScrollView
				contentContainerStyle={{ paddingTop: 54, paddingHorizontal: 8 }}
			>
				<View style={{ height: 32 }} />

				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						marginHorizontal: 'auto',
					}}
				>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{ uri: assets[0].localUri }}
						style={{
							width: 84,
							height: 84,
							marginHorizontal: 'auto',
							borderRadius: 16,
							backgroundColor: '#1f2836',
						}}
						contentFit={'cover'}
					/>
					<Ionicons
						name={'close-outline'}
						color={theme.secondary.a50}
						size={32}
						style={{ marginHorizontal: 16 }}
					/>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{ uri: assets[1].localUri }}
						style={{
							width: 84,
							height: 84,
							marginHorizontal: 'auto',
							borderRadius: 16,
						}}
					/>
				</View>
				<View style={{ marginBottom: 32 }}>
					<AppText.Medium
						style={{
							textAlign: 'center',
							paddingTop: 16,
							paddingBottom: 8,
							fontSize: 20,
						}}
					>
						{t(`onboarding.needBlueskyAccount`)}
					</AppText.Medium>
					<AppText.Medium
						style={{
							color: theme.complementary.a0,
							fontSize: 18,
							textAlign: 'center',
						}}
						onPress={LinkingUtils.openBluesky}
					>
						{t(`onboarding.createOneHere`)}
					</AppText.Medium>
				</View>

				<View style={styles.inputContainerRoot}>
					<View style={styles.inputContainer}>
						<AntDesign name="user" size={24} color={theme.secondary.a30} />
					</View>

					<TextInput
						style={{
							fontSize: 16,
							color: theme.secondary.a10,
							textDecorationLine: 'none',
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							flex: 1,
						}}
						autoCapitalize={'none'}
						placeholderTextColor={theme.secondary.a30}
						placeholder="handle.bsky.social or Email"
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
							color: theme.secondary.a10,
							textDecorationLine: 'none',
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							flex: 1,
						}}
						autoCapitalize={'none'}
						placeholder={t(`onboarding.appPassword`)}
						placeholderTextColor={theme.secondary.a30}
						onChangeText={setPassword}
						value={Password}
					/>
				</View>

				<View style={{ alignItems: 'center', marginTop: 16 }}>
					{IsLoading || isLoading ? (
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
								{t(`onboarding.loginButton`)}
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

export default AddBluesky;
