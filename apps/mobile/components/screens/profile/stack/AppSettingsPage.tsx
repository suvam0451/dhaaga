import {
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
} from 'react-native';
import { Divider } from '@rneui/themed';
import { Link, router } from 'expo-router';
import { APP_FONT } from '../../../../styles/AppTheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { APP_FONTS } from '../../../../styles/AppFonts';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../shared/topnavbar/AppTabLandingNavbar';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import Coffee from '../../../static/sponsorship/Coffee';

function Header() {
	return (
		<View
			style={{
				marginTop: 36,
				marginBottom: 24,
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
	return (
		<View style={{ marginTop: 24, marginBottom: 32 }}>
			<Text
				style={[
					styles.metadataText,
					{ color: theme.secondary.a30, fontSize: 15 },
				]}
			>
				{'Built with 💛 by Debashish Patra'}
			</Text>
			<View style={{ marginTop: 16 }}>
				<Coffee />
			</View>
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
};
function SettingCategoryListItem({
	Icon,
	to,
	label,
}: SettingCategoryListItemProps) {
	const { theme } = useAppTheme();
	return (
		<TouchableOpacity
			style={[styles.collapsibleSettingsSection]}
			onPress={() => {
				if (to) {
					router.navigate(to);
				}
			}}
		>
			<View style={{ width: 24, height: 24 }}>{Icon}</View>
			<Text
				style={[
					styles.collapsibleSettingsLabel,
					{ color: theme.secondary.a10 },
				]}
			>
				{label}
			</Text>

			<View style={{ flexGrow: 1 }} />
			{to && (
				<View>
					<Ionicons
						name="chevron-forward"
						size={24}
						color={theme.complementary.a10}
					/>
				</View>
			)}
		</TouchableOpacity>
	);
}

function SettingCategoryList() {
	const { theme } = useAppTheme();
	const color = theme.complementaryA.a10;
	return (
		<View style={{ width: '100%', flexGrow: 1, paddingHorizontal: 8 }}>
			<SettingCategoryListItem
				label={'Accounts'}
				to={APP_ROUTING_ENUM.PROFILE_ACCOUNTS}
				Icon={<MaterialIcons name="manage-accounts" size={26} color={color} />}
			/>
			<SettingCategoryListItem
				label={'App Language'}
				to={'/profile/settings/user-preferences'}
				Icon={<Ionicons name="language" size={24} color={color} />}
			/>
			<SettingCategoryListItem
				label={'Privacy'}
				to={'/profile/settings/privacy'}
				Icon={<FontAwesome6 name="user-secret" size={24} color={color} />}
			/>
			<SettingCategoryListItem
				label={'Digital Wellbeing'}
				to={'/profile/settings/wellbeing'}
				Icon={
					<FontAwesome6 name="hand-holding-heart" size={24} color={color} />
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
				label={'Help'}
				to={'/settings/help'}
				Icon={<Ionicons name="help-buoy" size={24} color={color} />}
			/>

			<SettingCategoryListItem
				label={'Info'}
				to={'/settings/info'}
				Icon={<Entypo name="info-with-circle" size={24} color={color} />}
			/>
		</View>
	);
}

function AppSettingsPage() {
	return (
		<ScrollView>
			<AppTabLandingNavbar
				type={APP_LANDING_PAGE_TYPE.APP_SETTINGS}
				menuItems={[
					{
						iconId: 'user-guide',
					},
				]}
			/>
			<Header />
			<SettingCategoryList />
			<Footer />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	collapsibleSettingsSection: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 4,
		marginHorizontal: 8,
		paddingVertical: 10,
	},
	collapsibleSettingsLabel: {
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		fontSize: 20,
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
	},
});

export default AppSettingsPage;
