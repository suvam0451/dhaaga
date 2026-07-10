import { View, Pressable, StyleSheet, Text } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { NativeTextMedium } from '#/ui/NativeText';
import { useAppTheme } from '#/states/global/hooks';
import { AppDivider } from '#/components/lib/Divider';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { MenuView } from '@expo/ui/community/menu';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';

function Divider() {
	const { theme } = useAppTheme();
	return (
		<AppDivider.Hard
			style={{
				flex: 1,
				backgroundColor: theme.background.a50,
				marginTop: 16,
			}}
		/>
	);
}

const TAP_ACTIONS_USER_AVATAR = [
	{
		id: 'preview_account',
		title: "Preview User's Account",
	},
	{
		id: 'preview_avatar',
		title: "Preview User's Avatar",
	},
	{
		id: 'goto_account',
		title: "Go to User's Account",
	},
];

const TAP_ACTIONS_HASHTAG = [
	{
		id: 'show_menu',
		title: 'Show All Options',
	},
	{
		id: 'toggle_follow',
		title: 'Toggle Follow (If Applicable)',
	},
	{
		id: 'browse',
		title: 'Browse Posts',
	},
	{
		id: 'toggle_hub_pin',
		title: 'Toggle Pin for Home Tab',
	},
];

function TapActionSettings() {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SETTINGS]);

	return (
		<>
			<View
				style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}
			>
				<AppIcon id={'gesture-tap'} size={28} color={theme.primary} />
				<NativeTextMedium
					style={{ fontSize: 18, color: theme.primary, marginLeft: 6 }}
				>
					Tap Actions
				</NativeTextMedium>
			</View>
			<Divider />

			{/*	User Avatar */}
			<View style={styles.settingItemContainer}>
				<NativeTextMedium
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					style={{ fontSize: 18 }}
				>
					User Avatar
				</NativeTextMedium>
				<MenuView
					style={{
						flex: 1,
						alignItems: 'flex-end',
					}}
					actions={TAP_ACTIONS_USER_AVATAR}
				>
					<Pressable
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'flex-end',
						}}
					>
						<NativeTextMedium
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
							style={{ textAlign: 'right' }}
							color={theme.complementary}
						>
							Go to User's Account
						</NativeTextMedium>
						<AppIcon
							id={'chevron-right'}
							color={theme.complementary}
							size={28}
						/>
					</Pressable>
				</MenuView>
			</View>

			{/*	Hashtag */}
			<View style={styles.settingItemContainer}>
				<NativeTextMedium
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					style={{ fontSize: 18 }}
				>
					Hashtag
				</NativeTextMedium>
				<MenuView
					style={{
						flex: 1,
						alignItems: 'flex-end',
					}}
					actions={TAP_ACTIONS_HASHTAG}
				>
					<Pressable
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'flex-end',
						}}
					>
						<NativeTextMedium
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
							style={{ textAlign: 'right' }}
							color={theme.complementary}
						>
							Toggle Follow
						</NativeTextMedium>
						<AppIcon
							id={'chevron-right'}
							color={theme.complementary}
							size={28}
						/>
					</Pressable>
				</MenuView>
			</View>
		</>
	);
}

export default TapActionSettings;

const styles = StyleSheet.create({
	text: {
		marginTop: '50%',
		fontSize: 18,
		textAlign: 'center',
	},
	settingItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		minHeight: 28,
		marginVertical: 10,
	},
});
