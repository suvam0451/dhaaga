import { FlatList, RefreshControl, View, Text } from 'react-native';
import { Button } from '@rneui/base';
import { APP_FONT } from '../../../../styles/AppTheme';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import AccountInfoSyncDialog from '../../../dialogs/AccountInfoSync';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import ConfirmAccountDelete from '../../../dialogs/accounts/ConfirmAccountDelete';
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

function SelectAccountStack() {
	const { db, theme } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
			theme: o.colorScheme,
		})),
	);
	const [DialogVisible, setDialogVisible] = useState(false);
	const [DeleteDialogVisible, setDeleteDialogVisible] = useState(false);
	const DialogTarget = useRef<Account>(null);
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
	}, []);

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
		router.navigate('/profile/onboard/select-software');
	}

	return (
		<AppTopNavbar
			title={'Select Account'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<AccountInfoSyncDialog
				IsVisible={DialogVisible}
				setIsVisible={setDialogVisible}
				acct={DialogTarget.current}
			/>
			<ConfirmAccountDelete
				IsVisible={DeleteDialogVisible}
				setIsVisible={setDeleteDialogVisible}
				acct={DialogTarget.current}
			/>

			<FlatList
				data={SOFTWARE_ARRAY}
				renderItem={({ item }) => (
					<AccountListForSoftware
						data={Data}
						software={item}
						setDeleteDialogExpanded={setDeleteDialogVisible}
						dialogTarget={DialogTarget}
						setIsExpanded={setDialogVisible}
					/>
				)}
				contentContainerStyle={{
					paddingHorizontal: 4,
					paddingTop: 54,
					backgroundColor: theme.palette.bg,
				}}
				ListFooterComponent={
					<View
						style={{ marginHorizontal: 16, marginBottom: 32, marginTop: 28 }}
					>
						<Button onPress={onPressAddAccount}>
							<Text
								style={{
									color: theme.textColor.high,
									fontFamily: APP_FONTS.INTER_700_BOLD,
									fontSize: 16,
								}}
							>
								Add Account
							</Text>
						</Button>
						<Text
							style={{
								color: APP_FONT.MONTSERRAT_BODY,
								fontFamily: APP_FONTS.INTER_700_BOLD,
								textAlign: 'center',
								marginTop: 8,
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
