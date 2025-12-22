import {
	ScrollView,
	StyleSheet,
	View,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { useAppTheme } from '#/states/global/hooks';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { NativeTextBold } from '#/ui/NativeText';
import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import { appDimensions } from '#/styles/dimensions';
import { AppDividerSoft } from '#/ui/Divider';
import SettingsFooter from '#/features/settings/components/SettingsFooter';

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
		<TouchableOpacity
			style={[styles.collapsibleSettingsSection]}
			onPress={() => {
				if (to) {
					router.navigate(to);
				}
			}}
			delayPressIn={200}
		>
			<View style={{ width: 24, height: 24, marginRight: 6 }}>{Icon}</View>
			<View style={styles.settingCategoryItemTextarea}>
				<NativeTextBold
					style={[
						styles.collapsibleSettingsLabel,
						{ color: theme.secondary.a0 },
					]}
				>
					{label}
				</NativeTextBold>
				{desc && (
					<NativeTextBold
						style={{
							color: theme.secondary.a30,
							fontSize: 14,
							marginTop: 2,
						}}
					>
						{desc}
					</NativeTextBold>
				)}
			</View>

			{to && (
				<View>
					<Ionicons name="chevron-forward" size={24} color={ARROW_COLOR} />
				</View>
			)}
		</TouchableOpacity>
	);
}

function SettingCategoryList() {
	const { theme } = useAppTheme();
	const SETTING_CATEGORY_ICON_COLOR = theme.primary;
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
		<FlatList
			data={items}
			renderItem={({ item }) => (
				<SettingCategoryListItem
					label={item.label}
					to={item.to}
					Icon={item.Icon}
					desc={item.desc}
				/>
			)}
			contentContainerStyle={{ paddingHorizontal: 10 }}
			ItemSeparatorComponent={() => (
				<AppDividerSoft style={{ marginVertical: 10 }} />
			)}
		/>
	);
}

function AppSettings() {
	const { theme } = useAppTheme();
	return (
		<>
			<NavBar_Simple label={'App Settings'} />
			<ScrollView
				style={{
					paddingBottom: 16,
					backgroundColor: theme.background.a0,
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 8,
				}}
			>
				<SettingCategoryList />
				<SettingsFooter />
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	collapsibleSettingsSection: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 4,
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

export default AppSettings;
