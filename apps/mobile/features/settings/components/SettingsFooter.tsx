import { useAppTheme } from '#/states/global/hooks';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { LinkingUtils } from '#/utils/linking.utils';
import { APP_VERSION } from '#/utils/default-settings';
import { NativeTextBold } from '#/ui/NativeText';
import { CoffeeIconOnly } from '#/features/settings/components/Coffee';
import { useAssets } from 'expo-asset';
import { Image } from 'expo-image';

function SettingsFooter() {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const ICON_COLOR = theme.complementary;
	const ICON_SIZE = 32;

	const [assets, error] = useAssets([require('#/assets/dhaaga/icon.png')]);

	if (error || !assets) return <View />;

	const LOGO_DIMENSION = 84;

	return (
		<View style={styles.root}>
			<Image
				source={{ uri: assets[0].uri }}
				style={{
					width: LOGO_DIMENSION,
					height: LOGO_DIMENSION,
					borderRadius: 16,
				}}
			/>
			<NativeTextBold
				style={{
					color: theme.secondary.a30,
					textAlign: 'center',
					fontSize: 14,
					marginTop: 8,
				}}
			>
				{APP_VERSION}
			</NativeTextBold>
			<View style={styles.linkRow}>
				<Ionicons
					name={'share-social'}
					size={ICON_SIZE}
					color={ICON_COLOR}
					style={{ padding: 10 }}
					onPress={LinkingUtils.shareAppLinkWithFriends}
				/>
				<Ionicons
					name="logo-discord"
					size={ICON_SIZE}
					color={ICON_COLOR}
					style={{ padding: 10 }}
					onPress={LinkingUtils.openDiscordLink}
				/>
				<Ionicons
					name="logo-github"
					size={ICON_SIZE}
					color={ICON_COLOR}
					style={{ padding: 10 }}
					onPress={LinkingUtils.openGithubLink}
				/>
				<Ionicons
					name="globe-outline"
					size={ICON_SIZE}
					color={ICON_COLOR}
					style={{ padding: 10 }}
					onPress={LinkingUtils.openProjectWebsite}
				/>
				<View
					style={{
						width: 1,
						height: '100%',
						backgroundColor: theme.secondary.a50,
						marginHorizontal: 6,
						borderRadius: 12,
					}}
				/>
				<CoffeeIconOnly
					containerStyle={{
						alignSelf: 'center',
						marginLeft: 8,
					}}
				/>
			</View>
			<NativeTextBold style={{ color: theme.secondary.a30 }}>
				{t(`setting.footer`)}
			</NativeTextBold>
		</View>
	);
}

export default SettingsFooter;

const styles = StyleSheet.create({
	root: {
		marginTop: 64,
		alignItems: 'center',
	},
	linkRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignSelf: 'center',
		marginBottom: 12,
		marginTop: 48,
	},
});
