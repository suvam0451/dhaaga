import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, Text } from '@rneui/themed';
import Animated from 'react-native-reanimated';
import { Link, router } from 'expo-router';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { APP_FONT } from '../../../../styles/AppTheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import VersionCode from '../../../static/sponsorship/VersionCode';
import { APP_FONTS } from '../../../../styles/AppFonts';
import Octicons from '@expo/vector-icons/Octicons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Fragment } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../shared/topnavbar/AppTopNavbar';

function SettingPageFooter() {
	return (
		<Fragment>
			<VersionCode />
		</Fragment>
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
	to: string;
};
function SettingCategoryListItem({
	Icon,
	to,
	label,
}: SettingCategoryListItemProps) {
	return (
		<TouchableOpacity
			style={styles.collapsibleSettingsSection}
			onPress={() => {
				router.navigate(to);
			}}
		>
			<View style={{ width: 24, height: 24 }}>{Icon}</View>

			<Text style={styles.collapsibleSettingsLabel}>{label}</Text>
		</TouchableOpacity>
	);
}

function SettingCategoryList() {
	return (
		<View style={{ width: '100%', flexGrow: 1, paddingHorizontal: 8 }}>
			<SettingCategoryListItem
				label={'Accounts'}
				to={'/profile/settings/accounts'}
				Icon={
					<MaterialIcons
						name="manage-accounts"
						size={26}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				}
			/>
			<SettingCategoryListItem
				label={'Preferences'}
				to={'/profile/settings/user-preferences'}
				Icon={
					<Octicons
						name="checklist"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				}
			/>
			<SettingCategoryListItem
				label={'Privacy'}
				to={'/profile/settings/privacy'}
				Icon={
					<FontAwesome6
						name="user-secret"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				}
			/>
			<SettingCategoryListItem
				label={'Digital Wellbeing'}
				to={'/profile/settings/wellbeing'}
				Icon={
					<FontAwesome6
						name="hand-holding-heart"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				}
			/>
			<Divider
				style={{
					backgroundColor: 'rgba(18,18,18,0.87)',
					width: '100%',
					marginVertical: 12,
				}}
			/>
			<SettingCategoryListItem
				label={'Support'}
				to={'/settings/support'}
				Icon={
					<AntDesign name="hearto" size={24} color={APP_FONT.MONTSERRAT_BODY} />
				}
			/>
			<SettingCategoryListItem
				label={'Help'}
				to={'/settings/help'}
				Icon={
					<Ionicons
						name="help-buoy"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				}
			/>

			<SettingCategoryListItem
				label={'Info'}
				to={'/settings/info'}
				Icon={
					<Entypo
						name="info-with-circle"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				}
			/>
		</View>
	);
}

function SettingsLandingPage() {
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={'App Settings'}
			translateY={translateY}
		>
			<Animated.ScrollView
				contentContainerStyle={{
					paddingTop: 54,
					height: '100%',
					paddingBottom: 16,
				}}
			>
				<SettingCategoryList />
				<SettingPageFooter />
			</Animated.ScrollView>
		</AppTopNavbar>
	);
}

const styles = StyleSheet.create({
	collapsibleSettingsSection: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 12,
		marginHorizontal: 8,
	},
	collapsibleSettingsLabel: {
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		fontSize: 20,
		marginLeft: 12,
		color: APP_FONT.MONTSERRAT_BODY,
	},
	appFeaturesGridRow: {
		marginHorizontal: 8,
		marginBottom: 8,
		display: 'flex',
		flexDirection: 'row',
	},
});

export default SettingsLandingPage;
