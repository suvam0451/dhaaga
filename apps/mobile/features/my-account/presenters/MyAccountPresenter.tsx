import {
	Animated as RN_Animated,
	RefreshControl,
	StyleSheet,
	View,
} from 'react-native';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import ProfileLandingAccountOverview from '../../../components/screens/profile/stack/landing/fragments/ProfileLandingAccountOverview';
import { APP_FONTS } from '../../../styles/AppFonts';
import AppNoAccount from '../../../components/error-screen/AppNoAccount';
import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import {
	useAppAcct,
	useAppApiClient,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { APP_ICON_ENUM } from '../../../components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { AppText } from '../../../components/lib/Text';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';
import { router } from 'expo-router';
import DriverService, {
	AppModulesProps,
} from '../../../services/driver.service';
import useApiGetMyAccount from '../../../hooks/api/accounts/useApiGetMyAccount';
import { useState } from 'react';
import Animated from 'react-native-reanimated';
import MyProfileNavbar from '../../../components/shared/topnavbar/MyProfileNavbar';
import { TimeOfDayGreeting } from '../../../app/(tabs)/index';
import ModuleItemView from '../views/ModuleItemView';

function MyAccountPresenter() {
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
			to: APP_ROUTING_ENUM.COLLECTIONS,
		},
		{
			label: 'Drafts',
			desc: 'Lost letters',
			iconId: 'layers-outline',
			to: APP_ROUTING_ENUM.MY_DRAFTS,
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

	function navigateTo(to: string) {
		router.navigate(to);
	}

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
						<ModuleItemView
							desc={item.desc}
							label={item.label}
							iconId={item.iconId}
							onPress={() => {
								navigateTo(item.to);
							}}
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
						<ModuleItemView
							desc={item.desc}
							label={item.label}
							iconId={item.iconId}
							onPress={() => {
								navigateTo(item.to);
							}}
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

export default MyAccountPresenter;

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
