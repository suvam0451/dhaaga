import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Ionicons } from '@expo/vector-icons';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../shared/topnavbar/AppTabLandingNavbar';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { CoffeeIconOnly } from '../../../../features/settings/components/Coffee';
import { LinkingUtils } from '../../../../utils/linking.utils';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../types/app.types';
import { AppText } from '../../../lib/Text';

function Header() {
	return (
		<View
			style={{
				marginTop: 20,
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'flex-start',
				paddingHorizontal: 10,
			}}
		/>
	);
}

export function Footer({ hideVersion }: { hideVersion?: boolean }) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const ICON_COLOR = theme.complementary.a0;
	const ICON_SIZE = 32;

	return (
		<View style={{ marginTop: 32 }}>
			<View style={styles.iconRowContainer}>
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
			<AppText.SemiBold
				style={[
					styles.metadataText,
					{ color: theme.secondary.a40, fontSize: 15 },
				]}
			>
				{t(`setting.footer`)}
			</AppText.SemiBold>
			{!hideVersion && (
				<AppText.SemiBold
					style={{
						color: theme.primary.a0,
						textAlign: 'center',
						fontSize: 16,
					}}
				>
					v0.17.2
				</AppText.SemiBold>
			)}
		</View>
	);
}

type SettingCategoryListItemProps = {
	label: string;
	Icon: any;
	to?: string;
	desc?: string;
};

function SettingCategoryListItem({
	Icon,
	to,
	label,
	desc,
}: SettingCategoryListItemProps) {
	const { theme } = useAppTheme();
	const ARROW_COLOR = theme.secondary.a30;

	return (
		<Pressable
			style={[styles.collapsibleSettingsSection]}
			onPress={() => {
				if (to) {
					router.navigate(to);
				}
			}}
		>
			<View style={{ width: 24, height: 24, marginRight: 6 }}>{Icon}</View>
			<View style={styles.settingCategoryItemTextarea}>
				<AppText.SemiBold
					style={[
						styles.collapsibleSettingsLabel,
						{ color: theme.secondary.a0 },
					]}
				>
					{label}
				</AppText.SemiBold>
				{desc && (
					<AppText.Normal
						style={{
							color: theme.secondary.a20,
							fontSize: 14,
						}}
					>
						{desc}
					</AppText.Normal>
				)}
			</View>

			{to && (
				<View>
					<Ionicons name="chevron-forward" size={24} color={ARROW_COLOR} />
				</View>
			)}
		</Pressable>
	);
}

function SettingCategoryList() {
	const { theme } = useAppTheme();
	const SETTING_CATEGORY_ICON_COLOR = theme.primary.a10;
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SETTINGS]);

	const items = [
		// {
		// 	label: t(`accounts.mainMenu_Label`),
		// 	desc: t(`accounts.mainMenu_Desc`),
		// 	Icon: (
		// 		<MaterialIcons
		// 			name="manage-accounts"
		// 			size={26}
		// 			color={SETTING_CATEGORY_ICON_COLOR}
		// 		/>
		// 	),
		// 	to: APP_ROUTING_ENUM.SETTINGS_TAB_ACCOUNTS,
		// },
		{
			label: t(`general.mainMenu_Label`),
			desc: t(`general.mainMenu_Desc`),
			Icon: (
				<Ionicons
					name="language"
					size={24}
					color={SETTING_CATEGORY_ICON_COLOR}
				/>
			),
			to: APP_ROUTING_ENUM.SETTINGS_TAB_GENERAL,
		},
		{
			label: t(`dhaaga.mainMenu_Label`),
			desc: t(`dhaaga.mainMenu_Desc`),
			Icon: (
				<Ionicons name="flash" size={24} color={SETTING_CATEGORY_ICON_COLOR} />
			),
			to: APP_ROUTING_ENUM.SETTINGS_TAB_GOODIE_HUT,
		},
		{
			label: t(`wellbeing.mainMenu_Label`),
			desc: t(`wellbeing.mainMenu_Desc`),
			Icon: (
				<FontAwesome6
					name="hand-holding-heart"
					size={24}
					color={SETTING_CATEGORY_ICON_COLOR}
				/>
			),
			to: APP_ROUTING_ENUM.SETTINGS_TAB_DIGITAL_WELLBEING,
		},
		{
			label: t(`advanced.mainMenu_Label`),
			desc: t(`advanced.mainMenu_Desc`),
			Icon: (
				<Ionicons
					name="construct"
					size={24}
					color={SETTING_CATEGORY_ICON_COLOR}
				/>
			),
			to: APP_ROUTING_ENUM.SETTINGS_TAB_ADVANCED,
		},
	];

	return (
		<View style={{ width: '100%', flexGrow: 1, paddingHorizontal: 8 }}>
			{items.map((o, i) => (
				<SettingCategoryListItem
					key={i}
					label={o.label}
					to={o.to}
					Icon={o.Icon}
					desc={o.desc}
				/>
			))}
		</View>
	);
}

function AppSettingsPage() {
	const { theme } = useAppTheme();
	return (
		<ScrollView
			style={{
				paddingBottom: 16,
				backgroundColor: theme.palette.bg,
			}}
		>
			<AppTabLandingNavbar
				type={APP_LANDING_PAGE_TYPE.APP_SETTINGS}
				menuItems={[
					{
						iconId: 'user-guide',
						onPress: () => {
							router.navigate(APP_ROUTING_ENUM.GUIDE_SETTINGS_TAB);
						},
					},
				]}
			/>
			<Header />
			<SettingCategoryList />
			<View style={{ marginTop: 64 }}>
				<Footer />
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	settingSectionWithIcon: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 4,
		marginHorizontal: 8,
		paddingVertical: 4,
		justifyContent: 'center',
	},
	collapsibleSettingsSection: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 4,
		marginHorizontal: 8,
		paddingVertical: 10,
	},
	collapsibleSettingsLabel: {
		fontSize: 18,
	},
	settingCategoryItemTextarea: {
		marginLeft: 12,
		flex: 1,
	},
	metadataText: {
		fontSize: 15,
		textAlign: 'center',
		marginBottom: 8,
	},
	iconRowContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignSelf: 'center',
		marginBottom: 12,
	},
});

export default AppSettingsPage;
