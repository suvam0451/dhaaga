import {
	Animated as RN_Animated,
	RefreshControl,
	StyleSheet,
	View,
} from 'react-native';
import useScrollMoreOnPageEnd from '#/states/useScrollMoreOnPageEnd';
import ProfileLandingAccountOverview from '#/components/screens/profile/stack/landing/fragments/ProfileLandingAccountOverview';
import {
	useAppAcct,
	useAppActiveSession,
	useAppApiClient,
	useAppTheme,
} from '#/hooks/utility/global-state-extractors';
import { APP_ICON_ENUM } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { SpecialText } from '#/components/lib/Text';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { router } from 'expo-router';
import DriverService, { AppModulesProps } from '#/services/driver.service';
import useApiMe from '#/hooks/useApiMe';
import { useState } from 'react';
import Animated from 'react-native-reanimated';
import MyProfileNavbar from '#/components/shared/topnavbar/MyProfileNavbar';
import { TimeOfDayGreeting } from '#/app/(tabs)/index';
import AccountHomeModuleItem from './components/AccountHomeModuleItem';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import AccountLoadError from '#/features/home/views/AccountLoadError';
import AccountMissingError from '#/features/home/views/AccountMissingError';

function AccountHome() {
	const { onScroll } = useScrollMoreOnPageEnd();
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();
	const { driver } = useAppApiClient();
	const { refetch, data } = useApiMe();
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { session } = useAppActiveSession();

	function _refresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	if (!session?.target) return <AccountMissingError />;
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
			to: APP_ROUTING_ENUM.SPECIAL_FEATURE_COLLECTION_LIST,
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
						<AccountHomeModuleItem
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
				<SpecialText
					style={styles.sectionHeader}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
				>
					{t(`profile.appFeatures.sectionLabel`)}
				</SpecialText>
				<Animated.FlatList
					data={appModules}
					numColumns={2}
					renderItem={({ item }) => (
						<AccountHomeModuleItem
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

export default AccountHome;

const styles = StyleSheet.create({
	sectionHeader: {
		paddingHorizontal: 10,
		fontSize: 32,
		lineHeight: 32,
		marginVertical: 16,
	},
});
