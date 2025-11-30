import {
	Animated as RN_Animated,
	RefreshControl,
	StyleSheet,
	View,
} from 'react-native';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import ProfileLandingAccountOverview from '../../../components/screens/profile/stack/landing/fragments/ProfileLandingAccountOverview';
import {
	useAppAcct,
	useAppActiveSession,
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
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import AccountLoadError from '#/features/my-account/AccountLoadError';

function MyAccountPresenter() {
	const { onScroll } = useScrollMoreOnPageEnd();
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();
	const { driver } = useAppApiClient();
	const { refetch, data } = useApiGetMyAccount();
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { session } = useAppActiveSession();

	function _refresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	if (session.target && session.state !== 'valid') return <AccountLoadError />;

	const serverModules: AppModulesProps[] = DriverService.getAccountModules(
		t,
		driver,
	);

	const appModules: AppModulesProps[] = [
		{
			label: t(`profile.appFeatures.socialHub.label`),
			desc: t(`profile.appFeatures.socialHub.desc`),
			iconId: 'layers-outline',
			to: APP_ROUTING_ENUM.PROFILES,
		},
		{
			label: t(`profile.appFeatures.collections.label`),
			desc: t(`profile.appFeatures.collections.desc`),
			iconId: 'layers-outline',
			to: APP_ROUTING_ENUM.COLLECTIONS,
		},
		// {
		// 	label: t(`profile.appFeatures.drafts.label`),
		// 	desc: t(`profile.appFeatures.drafts.desc`),
		// 	iconId: 'layers-outline',
		// 	to: APP_ROUTING_ENUM.MY_DRAFTS,
		// },
	];

	const MENU_ITEMS = [
		// {
		// 	iconId: 'cog' as APP_ICON_ENUM,
		// 	onPress: () => {
		// 		router.navigate(APP_ROUTING_ENUM.SETTINGS_PAGE);
		// 	},
		// },
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
				<AppText.Special
					style={styles.sectionHeader}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
				>
					{t(`profile.appFeatures.sectionLabel`)}
				</AppText.Special>
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
	sectionHeader: {
		paddingHorizontal: 10,
		fontSize: 32,
		lineHeight: 32,
		marginVertical: 16,
	},
});
