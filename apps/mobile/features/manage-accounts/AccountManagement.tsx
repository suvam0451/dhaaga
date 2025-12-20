import { FlatList, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import AccountManagementListItem from '../home/components/AccountManagementListItem';
import { Account, AccountService } from '@dhaaga/db';
import { useAppDb, useAppPublishers, useAppTheme } from '#/states/global/hooks';
import { APP_EVENT_ENUM } from '#/states/event-bus/app.publisher';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import NavBar_Simple from '#/components/topnavbar/NavBar_Simple';
import { appDimensions } from '#/styles/dimensions';

function SelectAccountStack() {
	const { theme } = useAppTheme();
	const { appEventBus } = useAppPublishers();
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
		if (!appEventBus) return;
		refresh();
		appEventBus.subscribe(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED, refresh);
		return () => {
			appEventBus.unsubscribe(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED, refresh);
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
		<>
			<NavBar_Simple label={'Manage Accounts'} />
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
					backgroundColor: theme.background.a0,
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
				}}
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
				style={{ backgroundColor: theme.background.a0 }}
			/>
		</>
	);
}

export default SelectAccountStack;
