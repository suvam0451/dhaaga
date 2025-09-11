import { memo } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import {
	AccountDetails,
	AccountPfp,
} from '../../../../screens/accounts/fragments/AccountListingFragment';
import SoftwareHeader from '../../../../screens/accounts/fragments/SoftwareHeader';
import { router } from 'expo-router';
import {
	Account,
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
} from '@dhaaga/db';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useAppListAccounts } from '../../../../hooks/db/useAppListAccounts';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import {
	useAppBottomSheet,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { AppBottomSheetMenu } from '../../../lib/Menu';

type FlashListItemProps = {
	acct: Account;
};

const FlashListItem = memo(({ acct }: FlashListItemProps) => {
	const { selectAccount, restoreSession, db } = useGlobalState(
		useShallow((o) => ({
			selectAccount: o.selectAccount,
			restoreSession: o.loadApp,
			db: o.db,
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
		<Pressable
			style={{
				backgroundColor: theme.background.a20,
				padding: 8,
				paddingVertical: 10,
				marginBottom: 8,
				borderRadius: 8,
				marginHorizontal: 8,
			}}
			onPress={onSelect}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					width: '100%',
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginRight: 'auto',
						flexShrink: 1,
					}}
				>
					<AccountPfp
						selected={acct.selected as unknown as boolean}
						url={avatar}
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
						flexShrink: 1,
					}}
				>
					<View
						style={{
							alignItems: 'center',
							paddingHorizontal: 12,
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
					<SoftwareHeader software={acct.driver} />
				</View>
			</View>
		</Pressable>
	);
});

const AppBottomSheetSelectAccount = memo(() => {
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
		<View style={{ height: '100%' }}>
			<Animated.FlatList
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
				data={data}
				renderItem={({ item }) => <FlashListItem acct={item} />}
			/>
		</View>
	);
});

export default AppBottomSheetSelectAccount;
