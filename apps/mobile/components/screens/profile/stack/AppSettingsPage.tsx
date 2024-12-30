import { ScrollView, StyleSheet, View, Text, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { APP_FONT } from '../../../../styles/AppTheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { APP_FONTS } from '../../../../styles/AppFonts';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../shared/topnavbar/AppTabLandingNavbar';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { CoffeeIconOnly } from '../../../static/sponsorship/Coffee';
import { LinkingUtils } from '../../../../utils/linking.utils';

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

function Footer() {
	const { theme } = useAppTheme();

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
			<Text
				style={[
					styles.metadataText,
					{ color: theme.secondary.a30, fontSize: 16 },
				]}
			>
				{'Built with 💛 by Debashish Patra'}
			</Text>
			{/*<Text*/}
			{/*	style={{*/}
			{/*		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,*/}
			{/*		color: theme.secondary.a10,*/}
			{/*		textAlign: 'center',*/}
			{/*		fontSize: 20,*/}
			{/*	}}*/}
			{/*>*/}
			{/*	v0.11.0*/}
			{/*</Text>*/}
		</View>
	);
}

type AppFeatureSmallGridItemProps = {
	Icon: JSX.Element;
	disabled?: boolean;
	alignment: 'left' | 'right';
	iconSize: number;
};

export function AppFeatureSmallGridItem({
	Icon,
	disabled,
	alignment,
	iconSize,
}: AppFeatureSmallGridItemProps) {
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: '#1e1e1e',
				padding: 8,
				borderRadius: 8,
				marginLeft: alignment === 'right' ? 4 : 0,
				marginRight: alignment === 'left' ? 4 : 0,
				alignItems: 'center',
				flexDirection: 'row',
				display: 'flex',
				justifyContent: 'center',
				opacity: disabled ? 0.5 : 1,
			}}
		>
			<View style={{ width: iconSize, height: iconSize }}>{Icon}</View>
		</View>
	);
}

type AppFeatureLargeGridItemProps = {
	label: string;
	link: string;
	Icon: JSX.Element;
	disabled?: boolean;
	alignment: 'left' | 'right';
};

export function AppFeatureLargeGridItem({
	label,
	link,
	Icon,
	disabled,
	alignment,
}: AppFeatureLargeGridItemProps) {
	return (
		<Link disabled={disabled} href={link}>
			<View
				style={{
					backgroundColor: '#1e1e1e',
					padding: 8,
					borderRadius: 8,
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					marginLeft: alignment === 'right' ? 8 : 0,
					marginRight: alignment === 'left' ? 8 : 0,
					height: 36 + 8 * 2,
				}}
			>
				<View style={{ width: 24 }}>{Icon}</View>
				<Text
					style={{
						fontFamily: 'Montserrat-Bold',
						marginLeft: 8,
						color: APP_FONT.MONTSERRAT_BODY,
					}}
				>
					{label}
				</Text>
			</View>
		</Link>
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
				<Text
					style={[
						styles.collapsibleSettingsLabel,
						{ color: theme.secondary.a10 },
					]}
				>
					{label}
				</Text>
				{desc && (
					<Text
						style={{
							color: theme.secondary.a30,
						}}
					>
						{desc}
					</Text>
				)}
			</View>

			<View style={{ flexGrow: 1 }} />
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

	return (
		<View style={{ width: '100%', flexGrow: 1, paddingHorizontal: 8 }}>
			<SettingCategoryListItem
				label={'Accounts'}
				to={APP_ROUTING_ENUM.PROFILE_ACCOUNTS}
				Icon={
					<MaterialIcons
						name="manage-accounts"
						size={26}
						color={SETTING_CATEGORY_ICON_COLOR}
					/>
				}
				desc={'Add and Manage Accounts'}
			/>
			<SettingCategoryListItem
				label={'General'}
				desc={'The usual boring™ settings are here'}
				to={'/profile/settings/user-preferences'}
				Icon={
					<Ionicons
						name="language"
						size={24}
						color={SETTING_CATEGORY_ICON_COLOR}
					/>
				}
			/>
			<SettingCategoryListItem
				label={'Goodie Hut'}
				desc={'Tweak unique features of Dhaaga'}
				to={'/profile/settings/user-preferences'}
				Icon={
					<Ionicons
						name="flash"
						size={24}
						color={SETTING_CATEGORY_ICON_COLOR}
					/>
				}
			/>
			<SettingCategoryListItem
				label={'Digital Wellbeing'}
				desc={'Disconnect to reconnect with yourself'}
				to={'/profile/settings/wellbeing'}
				Icon={
					<FontAwesome6
						name="hand-holding-heart"
						size={24}
						color={SETTING_CATEGORY_ICON_COLOR}
					/>
				}
			/>
			<SettingCategoryListItem
				label={'Advanced'}
				desc={'For power users'}
				to={'/profile/settings/privacy'}
				Icon={
					<Ionicons
						name="construct"
						size={24}
						color={SETTING_CATEGORY_ICON_COLOR}
					/>
				}
			/>
		</View>
	);
}

function AppSettingsPage() {
	return (
		<ScrollView style={{ minHeight: '100%', paddingBottom: 16 }}>
			<View style={{ minHeight: '100%' }}>
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
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		fontSize: 20,
	},
	settingCategoryItemTextarea: {
		marginLeft: 12,
	},
	appFeaturesGridRow: {
		marginHorizontal: 8,
		marginBottom: 8,
		display: 'flex',
		flexDirection: 'row',
	},
	metadataText: {
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		fontSize: 18,
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
