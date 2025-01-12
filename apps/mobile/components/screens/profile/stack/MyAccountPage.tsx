import {
	Animated as RN_Animated,
	Pressable,
	RefreshControl,
	StyleSheet,
	View,
} from 'react-native';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import ProfileLandingAccountOverview from './landing/fragments/ProfileLandingAccountOverview';
import { APP_FONTS } from '../../../../styles/AppFonts';
import AppNoAccount from '../../../error-screen/AppNoAccount';
import { APP_LANDING_PAGE_TYPE } from '../../../shared/topnavbar/AppTabLandingNavbar';
import {
	useAppAcct,
	useAppApiClient,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { APP_ICON_ENUM, AppIcon } from '../../../lib/Icon';
import { appDimensions } from '../../../../styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import { AppText } from '../../../lib/Text';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import { router } from 'expo-router';
import DriverService, {
	AppModulesProps,
} from '../../../../services/driver.service';
import useApiGetMyAccount from '../../../../hooks/api/accounts/useApiGetMyAccount';
import { useState } from 'react';
import Animated from 'react-native-reanimated';
import MyProfileNavbar from '../../../shared/topnavbar/MyProfileNavbar';
import { TimeOfDayGreeting } from '../../../../app/(tabs)/index';

function AppModules({ label, desc, iconId, to }: AppModulesProps) {
	const { theme } = useAppTheme();

	return (
		<View style={styles.appModuleContainer}>
			<Pressable
				style={[
					styles.appModuleContent,
					{
						backgroundColor: theme.background.a40, // '#282828',
					},
				]}
				onPress={() => {
					router.navigate(to);
				}}
			>
				<View style={styles.tiltedIconContainer}>
					<AppIcon
						id={iconId}
						size={appDimensions.socialHub.feeds.tiltedIconSize}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						iconStyle={{ color: theme.secondary.a0 }}
					/>
				</View>
				<AppText.H6 emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}>
					{label}
				</AppText.H6>
				<AppText.Medium
					style={{
						width: 96,
						color: theme.complementary.a0,
					}}
					numberOfLines={1}
				>
					{desc}
				</AppText.Medium>
			</Pressable>
		</View>
	);
}

function MyAccountPage() {
	const { onScroll } = useScrollMoreOnPageEnd();
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();
	const { driver } = useAppApiClient();
	const { refetch, data } = useApiGetMyAccount();
	const [IsRefreshing, setIsRefreshing] = useState(false);

	function _refresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	if (!acct) return <AppNoAccount tab={APP_LANDING_PAGE_TYPE.PROFILE} />;

	const serverModules: AppModulesProps[] =
		DriverService.getAccountModules(driver);

	const appModules: AppModulesProps[] = [
		{
			label: 'Social Hub',
			desc: 'Manage profiles!',
			iconId: 'layers-outline',
			to: APP_ROUTING_ENUM.PROFILES,
		},
		{
			label: 'Collections',
			desc: 'Bookmark++',
			iconId: 'layers-outline',
			to: APP_ROUTING_ENUM.PROFILES,
		},
		{
			label: 'Drafts',
			desc: 'Lost letters',
			iconId: 'layers-outline',
			to: APP_ROUTING_ENUM.DRAFTS,
		},
	];

	const MENU_ITEMS = [
		{
			iconId: 'cog' as APP_ICON_ENUM,
			onPress: () => {
				router.navigate(APP_ROUTING_ENUM.SETTINGS_PAGE);
			},
		},
		{
			iconId: 'user-guide' as APP_ICON_ENUM,
			onPress: () => {
				router.navigate(APP_ROUTING_ENUM.GUIDE_MY_PROFILE);
			},
		},
	];

	return (
		<View style={{ backgroundColor: theme.palette.bg, height: '100%' }}>
			<RN_Animated.ScrollView
				onScroll={onScroll}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={_refresh} />
				}
			>
				<MyProfileNavbar menuItems={MENU_ITEMS} />
				<ProfileLandingAccountOverview user={data} />
				<View style={{ marginVertical: 4 }} />
				<TimeOfDayGreeting acct={acct} />
				<View style={{ marginVertical: 12 }} />
				<Animated.FlatList
					data={serverModules}
					numColumns={2}
					renderItem={({ item }) => (
						<AppModules
							desc={item.desc}
							label={item.label}
							iconId={item.iconId}
							to={item.to}
						/>
					)}
					style={{
						marginHorizontal: 8,
					}}
				/>
				<View style={{ marginVertical: 8 }} />
				<AppText.Normal
					style={styles.sectionHeader}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
				>
					App Features
				</AppText.Normal>
				<Animated.FlatList
					data={appModules}
					numColumns={2}
					renderItem={({ item }) => (
						<AppModules
							desc={item.desc}
							label={item.label}
							iconId={item.iconId}
							to={item.to}
						/>
					)}
					style={{
						marginHorizontal: 8,
					}}
				/>
			</RN_Animated.ScrollView>
		</View>
	);
}

export default MyAccountPage;

const styles = StyleSheet.create({
	headerText: {
		fontSize: 28,
		fontFamily: APP_FONTS.INTER_700_BOLD,
	},
	appModuleContainer: {
		maxWidth: '50%',
		flex: 1,
		paddingHorizontal: 6,
	},
	appModuleContent: {
		paddingVertical: 10,
		paddingHorizontal: 12, // marginHorizontal: 8,
		borderRadius: 8,
		marginBottom: 12,

		overflow: 'hidden',
		width: 'auto',
	},
	tiltedIconContainer: {
		transform: [{ rotateZ: '-15deg' }],
		width: 42,
		position: 'absolute',
		opacity: 0.48,
		right: 0,
		bottom: -6,
	},
	sectionHeader: {
		paddingHorizontal: 10,
		fontSize: 32,
		fontFamily: APP_FONTS.BEBAS_NEUE_400,
		marginVertical: 16,
	},
});
