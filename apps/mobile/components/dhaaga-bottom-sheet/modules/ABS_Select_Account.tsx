import {
	Text,
	View,
	TouchableOpacity,
	FlatList,
	StyleSheet,
} from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import {
	AccountDetails,
	AccountPfp,
} from '../../../screens/accounts/fragments/AccountListingFragment';
import SoftwareHeader from '../../../screens/accounts/fragments/SoftwareHeader';
import { router } from 'expo-router';
import {
	Account,
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
} from '@dhaaga/db';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useAppListAccounts } from '../../../hooks/db/useAppListAccounts';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';
import {
	useAppBottomSheet,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { AppBottomSheetMenu } from '../../lib/Menu';
import { AppButtonVariantA } from '../../lib/Buttons';

type FlashListItemProps = {
	acct: Account;
};

function FlashListItem({ acct }: FlashListItemProps) {
	const { selectAccount, restoreSession, db } = useGlobalState(
		useShallow((o) => ({
			selectAccount: o.selectAccount,
			restoreSession: o.loadApp,
			db: o.db!,
		})),
	);
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
		selectAccount(acct);
		restoreSession();
		refresh();
		hide();
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
					{acct.selected && (
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
								color: theme.primary.a0,
								fontSize: 16,
							}}
						>
							Active
						</Text>
					)}
				</View>
				<SoftwareHeader height={32} software={acct.driver} />
			</View>
		</TouchableOpacity>
	);
}

function ABS_Select_Account() {
	const { stateId, isAnimating, hide } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			stateId: o.bottomSheet.stateId,
			isAnimating: o.bottomSheet.isAnimating,
			hide: o.bottomSheet.hide,
		})),
	);
	const { data } = useAppListAccounts(stateId);

	if (isAnimating) return <View />;

	function onPressMoreAccountOptions() {
		hide();
		router.navigate(APP_ROUTING_ENUM.SETTINGS_TAB_ACCOUNTS);
	}

	return (
		<FlatList
			ListHeaderComponent={() => (
				<AppBottomSheetMenu.Header
					title={'Select Account'}
					menuItems={[
						{
							iconId: 'cog',
							onPress: onPressMoreAccountOptions,
						},
					]}
				/>
			)}
			ListFooterComponent={() => (
				<AppButtonVariantA
					label={'Add Account'}
					loading={false}
					onClick={() => {
						hide();
						router.navigate(APP_ROUTING_ENUM.ADD_ACCOUNT);
					}}
					style={{ marginTop: 32 }}
				/>
			)}
			data={data}
			renderItem={({ item }) => <FlashListItem acct={item} />}
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
