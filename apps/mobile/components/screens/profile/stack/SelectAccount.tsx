import { FlatList, RefreshControl, View, Text } from 'react-native';
import { Button } from '@rneui/base';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { APP_FONTS } from '../../../../styles/AppFonts';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import AccountListForSoftware from './landing/fragments/AccountListForSoftware';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../shared/topnavbar/AppTopNavbar';
import { Account } from '../../../../database/_schema';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AccountService } from '../../../../database/entities/account';
import {
	useAppPublishers,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { APP_EVENT_ENUM } from '../../../../services/publishers/app.publisher';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';

function SelectAccountStack() {
	const { theme } = useAppTheme();
	const { appSub } = useAppPublishers();
	const { db } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
		})),
	);
	const [Data, setData] = useState<Account[]>([]);
	const [Refreshing, setRefreshing] = useState(false);

	function refresh() {
		try {
			setData(AccountService.getAll(db));
		} catch (e) {
			console.log('[ERROR]: failed to load account list', e);
			setData([]);
		}
	}

	// populate account list on load & refresh
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
		router.navigate(APP_ROUTING_ENUM.SELECT_DRIVER);
	}

	return (
		<AppTopNavbar
			title={'Select Account'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<FlatList
				data={SOFTWARE_ARRAY}
				renderItem={({ item }) => (
					<AccountListForSoftware data={Data} software={item} />
				)}
				contentContainerStyle={{
					paddingHorizontal: 4,
					paddingTop: 54,
					backgroundColor: theme.palette.bg,
				}}
				ListFooterComponent={
					<View
						style={{ marginHorizontal: 16, marginBottom: 32, marginTop: 48 }}
					>
						<Button onPress={onPressAddAccount}>
							<Text
								style={{
									color: theme.textColor.high,
									fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
									fontSize: 16,
								}}
							>
								Add Account
							</Text>
						</Button>
						<Text
							style={{
								color: theme.secondary.a30,
								fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
								textAlign: 'center',
								marginTop: 16,
								paddingHorizontal: 16,
							}}
						>
							Mastodon, Pleroma, Akkoma, Misskey, Firefish, Sharkey
						</Text>
					</View>
				}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={onRefresh} />
				}
			/>
		</AppTopNavbar>
	);
}

export default SelectAccountStack;
