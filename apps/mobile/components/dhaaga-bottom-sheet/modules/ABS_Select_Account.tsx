import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import {
	Account,
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
} from '@dhaaga/db';
import { useAccountsDb } from '#/hooks/db/useAccountsDb';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import {
	useAppBottomSheet,
	useAppDb,
	useAppManager,
	useAppTheme,
} from '#/states/global/hooks';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import { AppIcon } from '#/components/lib/Icon';
import BottomSheetMenu from '#/components/dhaaga-bottom-sheet/components/BottomSheetMenu';
import RoutingUtils from '#/utils/routing.utils';
import {
	AccountDetails,
	AccountPfp,
} from '#/features/manage-accounts/AccountListingFragment';
import SoftwareHeader from '#/features/manage-accounts/SoftwareHeader';

type ListItemProps = {
	acct: Account;
};

function ListItem({ acct }: ListItemProps) {
	const { db } = useAppDb();
	const { loadAccount } = useAppManager();
	const { hide, refresh } = useAppBottomSheet();
	const { theme } = useAppTheme();

	const avatar = AccountMetadataService.getKeyValueForAccountSync(
		db,
		acct,
		ACCOUNT_METADATA_KEY.AVATAR_URL,
	);
	const displayName = AccountMetadataService.getKeyValueForAccountSync(
		db,
		acct,
		ACCOUNT_METADATA_KEY.DISPLAY_NAME,
	);

	async function onSelect() {
		loadAccount(acct).finally(() => {
			refresh();
			hide();
		});
	}

	if (!acct) return <View />;

	return (
		<TouchableOpacity
			style={[
				styles.listItemContainer,
				{
					backgroundColor: theme.background.a20,
				},
			]}
			onPress={onSelect}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					flex: 1,
				}}
			>
				<AccountPfp
					selected={acct.selected as unknown as boolean}
					url={avatar!}
					onClicked={onSelect}
				/>
				<AccountDetails
					onClicked={onSelect}
					selected={acct.selected as unknown as boolean}
					displayName={displayName}
					username={acct.username}
					subdomain={acct.server}
				/>
			</View>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					maxWidth: 196,
				}}
			>
				<View
					style={{
						alignItems: 'center',
						paddingRight: 12,
						paddingVertical: 12,
					}}
				>
					{acct.selected ? (
						<AppIcon id={'checkbox'} size={28} color={theme.primary} />
					) : (
						<View />
					)}
				</View>
				<SoftwareHeader height={28} software={acct.driver} />
			</View>
		</TouchableOpacity>
	);
}

function ABS_Select_Account() {
	const { stateId, hide } = useAppBottomSheet();
	const { data } = useAccountsDb(stateId);

	function onPressManageAccount() {
		hide();
		RoutingUtils.toAccountManagement();
	}

	function onPressAddAccount() {
		hide();
		router.navigate(APP_ROUTING_ENUM.PROFILE_ADD_ACCOUNT);
	}

	return (
		<FlatList
			ListHeaderComponent={() => (
				<BottomSheetMenu
					title={'Select Account'}
					menuItems={[
						{ iconId: 'person-add', onPress: onPressAddAccount },
						{
							iconId: 'cog',
							onPress: onPressManageAccount,
						},
					]}
					variant={'clear'}
				/>
			)}
			ListFooterComponent={() =>
				data.length > 0 ? (
					<View />
				) : (
					<AppButtonVariantA
						label={'Add Account'}
						loading={false}
						onClick={onPressAddAccount}
						style={{ marginTop: 32, marginBottom: 64 }}
					/>
				)
			}
			data={data}
			renderItem={({ item }) => <ListItem acct={item} />}
		/>
	);
}

export default ABS_Select_Account;

const styles = StyleSheet.create({
	listItemContainer: {
		padding: 8,
		paddingVertical: 10,
		marginBottom: 8,
		borderRadius: 8,
		marginHorizontal: 8,
		flexDirection: 'row',
	},
});
