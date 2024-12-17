import { memo } from 'react';
import { AnimatedFlashList } from '@shopify/flash-list';
import { TouchableOpacity, View, Text } from 'react-native';
import { useAppBottomSheet } from '../_api/useAppBottomSheet';
import { APP_FONTS } from '../../../../styles/AppFonts';
import {
	AccountDetails,
	AccountPfp,
} from '../../../../screens/accounts/fragments/AccountListingFragment';
import SoftwareHeader from '../../../../screens/accounts/fragments/SoftwareHeader';
import { router } from 'expo-router';
import { Account } from '../../../../database/_schema';
import { AccountMetadataService } from '../../../../database/entities/account-metadata';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useAppAccounts } from '../../../../hooks/db/useAppAccounts';
import { AppIcon } from '../../../lib/Icon';
import { APP_ROUTE_ENUM } from '../../../../utils/route-list';

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

	const { setVisible } = useAppBottomSheet();

	const avatar = AccountMetadataService.getKeyValueForAccountSync(
		db,
		acct,
		'avatar',
	);
	const displayName = AccountMetadataService.getKeyValueForAccountSync(
		db,
		acct,
		'display_name',
	);

	async function onSelect() {
		selectAccount(acct);
		restoreSession();
		setVisible(false);
	}

	if (!acct) return <View />;

	return (
		<TouchableOpacity
			style={{
				backgroundColor: '#202020',
				padding: 8,
				paddingVertical: 6,
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
				}}
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

				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
									fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
									color: '#9dced7',
								}}
							>
								Active
							</Text>
						)}
					</View>
					<SoftwareHeader software={acct.driver} mb={4} mt={8} />
				</View>
			</View>
		</TouchableOpacity>
	);
});

const AppBottomSheetSelectAccount = memo(() => {
	const { stateId, isAnimating, hide, theme } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			stateId: o.bottomSheet.stateId,
			isAnimating: o.bottomSheet.isAnimating,
			hide: o.bottomSheet.hide,
			theme: o.colorScheme,
		})),
	);
	const { accounts } = useAppAccounts(stateId);

	if (isAnimating) return <View />;

	function onPressMoreAccountOptions() {
		hide();
		router.navigate(APP_ROUTE_ENUM.PROFILE_ACCOUNTS);
	}

	return (
		<View style={{ height: '100%' }}>
			<AnimatedFlashList
				estimatedItemSize={72}
				ListHeaderComponent={() => (
					<View
						style={{
							marginVertical: 16,
							justifyContent: 'space-between',
							flexDirection: 'row',
							marginHorizontal: 16,
							alignItems: 'center',
							marginTop: 32,
						}}
					>
						<Text
							style={{
								fontFamily: APP_FONTS.INTER_700_BOLD,
								color: theme.textColor.high,
								fontSize: 20,
								flex: 1,
							}}
						>
							Select Account
						</Text>
						<TouchableOpacity
							style={{
								paddingHorizontal: 8,
							}}
							onPress={onPressMoreAccountOptions}
						>
							<AppIcon id={'cog'} emphasis={'medium'} />
						</TouchableOpacity>
					</View>
				)}
				data={accounts}
				renderItem={({ item }) => <FlashListItem acct={item} />}
			/>
		</View>
	);
});

export default AppBottomSheetSelectAccount;
