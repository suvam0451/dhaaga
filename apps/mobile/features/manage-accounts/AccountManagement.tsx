import { FlatList, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import AccountManagementListItem from '../home/components/AccountManagementListItem';
import { Account, AccountService } from '@dhaaga/db';
import { useAppDb, useAppPublishers, useAppTheme } from '#/states/global/hooks';
import { APP_EVENT_ENUM } from '#/services/publishers/app.publisher';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '#/components/shared/topnavbar/AppTabLandingNavbar';

function SelectAccountStack() {
	const { theme } = useAppTheme();
	const { appSub } = useAppPublishers();
	const { db } = useAppDb();
	const [Data, setData] = useState<Account[]>([]);
	const [Refreshing, setRefreshing] = useState(false);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	function refresh() {
		try {
			setData(AccountService.getAll(db));
		} catch (e) {
			console.log('[ERROR]: failed to load account list', e);
			setData([]);
		}
	}

	// populate an account list on a load and refresh
	function onRefresh() {
		setRefreshing(true);
		refresh();
		setRefreshing(false);
	}

	useEffect(() => {
		refresh();
		appSub.subscribe(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED, refresh);
		return () => {
			appSub.unsubscribe(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED, refresh);
		};
	}, [db]);

	const SOFTWARE_ARRAY = [
		KNOWN_SOFTWARE.AKKOMA,
		KNOWN_SOFTWARE.CHERRYPICK,
		KNOWN_SOFTWARE.FIREFISH,
		KNOWN_SOFTWARE.MASTODON,
		KNOWN_SOFTWARE.MISSKEY,
		KNOWN_SOFTWARE.PLEROMA,
		KNOWN_SOFTWARE.SHARKEY,
		KNOWN_SOFTWARE.BLUESKY,
	];

	function onPressAddAccount() {
		router.navigate(APP_ROUTING_ENUM.PROFILE_ADD_ACCOUNT);
	}

	return (
		<FlatList
			data={SOFTWARE_ARRAY}
			renderItem={({ item }) => (
				<AccountManagementListItem
					data={Data}
					software={item}
					onListChange={refresh}
				/>
			)}
			contentContainerStyle={{
				paddingHorizontal: 4,
				backgroundColor: theme.palette.bg,
			}}
			ListHeaderComponent={
				<AppTabLandingNavbar
					type={APP_LANDING_PAGE_TYPE.ALL_ACCOUNTS}
					menuItems={[
						{
							iconId: 'user-guide',
							onPress: () => {
								router.navigate(APP_ROUTING_ENUM.PROFILE_GUIDE_ACCOUNTS);
							},
						},
					]}
				/>
			}
			ListFooterComponent={
				<AppButtonVariantA
					label={t(`onboarding.addAccountButton`)}
					loading={false}
					onClick={onPressAddAccount}
					style={{ width: 196, marginTop: 32 }}
				/>
			}
			refreshControl={
				<RefreshControl refreshing={Refreshing} onRefresh={onRefresh} />
			}
		/>
	);
}

export default SelectAccountStack;
