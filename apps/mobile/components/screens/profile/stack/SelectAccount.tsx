import { FlatList, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import AccountListForSoftware from './landing/fragments/AccountListForSoftware';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../shared/topnavbar/AppTopNavbar';
import { Account, AccountService } from '@dhaaga/db';
import {
	useAppDb,
	useAppPublishers,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { APP_EVENT_ENUM } from '../../../../services/publishers/app.publisher';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../types/app.types';
import { AppButtonVariantA } from '../../../lib/Buttons';

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

	const { translateY } = useScrollMoreOnPageEnd({
		itemCount: 1,
		updateQueryCache: () => {},
	});

	function onPressAddAccount() {
		router.navigate(APP_ROUTING_ENUM.ADD_ACCOUNT);
	}

	return (
		<AppTopNavbar
			title={t(`topNav.secondary.manageAccounts`)}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<FlatList
				data={SOFTWARE_ARRAY}
				renderItem={({ item }) => (
					<AccountListForSoftware
						data={Data}
						software={item}
						onListChange={refresh}
					/>
				)}
				contentContainerStyle={{
					paddingHorizontal: 4,
					backgroundColor: theme.palette.bg,
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
			/>
		</AppTopNavbar>
	);
}

export default SelectAccountStack;
