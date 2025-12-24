import { useMemo } from 'react';
import {
	FlatList,
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import {
	useActiveUserSession,
	useAppActiveSession,
	useAppApiClient,
	useAppTheme,
} from '#/states/global/hooks';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { router } from 'expo-router';
import DriverService, { AppModulesProps } from '#/services/driver.service';
import useApiMe from '#/hooks/useApiMe';
import { useState } from 'react';
import NavBar_Home from '#/features/navbar/views/NavBar_Home';
import AccountHomeModuleItem from './components/AccountHomeModuleItem';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import AccountLoadError from '#/features/home/views/AccountLoadError';
import AccountMissingError from '#/features/home/views/AccountMissingError';
import MyAccountOverview from '#/features/home/components/MyAccountOverview';
import { NativeTextBold, NativeTextSpecial } from '#/ui/NativeText';
import TimeOfDayGreeting from '#/features/hub/components/TimeOfDayGreeting';

/**
 * Animations broken. Will be added in the future.
 * @constructor
 */
function CurrentPlanIndicator() {
	const { theme } = useAppTheme();
	return (
		<Pressable
			style={{
				borderWidth: 1.5,
				borderRadius: 8,
				backgroundColor: theme.background.a50,
				paddingVertical: 6,
				paddingHorizontal: 16,
			}}
			onPress={() => {
				router.navigate(APP_ROUTING_ENUM.SETTINGS_PLANS);
			}}
		>
			<NativeTextBold style={{}}>FREE</NativeTextBold>
		</Pressable>
	);
}

function Home() {
	const { theme } = useAppTheme();
	const { acct } = useActiveUserSession();
	const { driver } = useAppApiClient();
	const { refetch, data } = useApiMe();
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const serverModules: AppModulesProps[] = DriverService.getAccountModules(
		t,
		driver,
	);

	function _refresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

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
		{
			label: t(`profile.appFeatures.drafts.label`),
			desc: t(`profile.appFeatures.drafts.desc`),
			iconId: 'layers-outline',
			to: APP_ROUTING_ENUM.MY_DRAFTS,
		},
		{
			label: t(`profile.appFeatures.skins.label`),
			desc: t(`profile.appFeatures.skins.desc`),
			iconId: 'layers-outline',
			to: APP_ROUTING_ENUM.APP_SKINS,
		},
	];

	function navigateTo(to: string) {
		router.navigate(to);
	}

	return (
		<ScrollView
			refreshControl={
				<RefreshControl refreshing={IsRefreshing} onRefresh={_refresh} />
			}
		>
			<MyAccountOverview user={data} />
			<View style={{ marginVertical: 4 }} />
			<TimeOfDayGreeting acct={acct} />
			<View style={{ marginVertical: 12 }} />
			<FlatList
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
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginRight: 16,
				}}
			>
				<NativeTextSpecial
					style={[styles.sectionHeader, { color: theme.primary }]}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
				>
					{t(`profile.appFeatures.sectionLabel`)}
				</NativeTextSpecial>
			</View>
			<FlatList
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
		</ScrollView>
	);
}

function MyHome() {
	const { session } = useAppActiveSession();
	const { theme } = useAppTheme();

	const Component = useMemo(() => {
		if (!session?.target) return <AccountMissingError />;
		if (session.target && session.state !== 'valid')
			return <AccountLoadError />;
		return <Home />;
	}, [session]);

	return (
		<View style={{ flex: 1, backgroundColor: theme.background.a0 }}>
			<NavBar_Home />
			{Component}
		</View>
	);
}

export default MyHome;

const styles = StyleSheet.create({
	sectionHeader: {
		paddingHorizontal: 10,
		fontSize: 32,
		lineHeight: 32,
		marginVertical: 16,
		flex: 1,
	},
});
