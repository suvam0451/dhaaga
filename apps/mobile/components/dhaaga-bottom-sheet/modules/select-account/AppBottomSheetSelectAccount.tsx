import { memo } from 'react';
import { AnimatedFlashList } from '@shopify/flash-list';
import { TouchableOpacity, View } from 'react-native';
import { useAppBottomSheet } from '../_api/useAppBottomSheet';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../../../styles/AppFonts';
import {
	AccountDetails,
	AccountPfp,
} from '../../../../screens/accounts/fragments/AccountListingFragment';
import SoftwareHeader from '../../../../screens/accounts/fragments/SoftwareHeader';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { router } from 'expo-router';
import { useAccountDbContext } from '../../../screens/profile/stack/settings/hooks/useAccountDb';
import { Account } from '../../../../database/_schema';
import { AccountMetadataService } from '../../../../database/entities/account-metadata';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type FlashListItemProps = {
	acct: Account;
};

const FlashListItem = memo(({ acct }: FlashListItemProps) => {
	const { selectAccount, restoreSession, db } = useGlobalState(
		useShallow((o) => ({
			selectAccount: o.selectAccount,
			restoreSession: o.restoreSession,
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
	const { isAnimating, setVisible } = useAppBottomSheet();
	const { accounts } = useAccountDbContext();

	if (isAnimating) return <View />;
	return (
		<View style={{ height: '100%' }}>
			<AnimatedFlashList
				estimatedItemSize={72}
				ListHeaderComponent={() => (
					<View style={{ marginVertical: 16 }}>
						<Text
							style={{
								textAlign: 'center',
								fontFamily: APP_FONTS.INTER_700_BOLD,
								color: APP_FONT.MONTSERRAT_BODY,
								fontSize: 16,
							}}
						>
							Select Account
						</Text>
					</View>
				)}
				ListFooterComponent={() => (
					<View
						style={{
							marginVertical: 16,
							borderRadius: 8,
							alignItems: 'center',
							marginBottom: 32,
						}}
					>
						<TouchableOpacity
							style={{
								flex: 1,
								alignItems: 'center',
								backgroundColor: APP_THEME.REPLY_THREAD_COLOR_SWATCH[0],
								padding: 6,
								paddingHorizontal: 12,
								borderRadius: 6,
							}}
							onPress={() => {
								setVisible(false);
								router.navigate('/profile/settings/accounts');
							}}
						>
							<Text
								style={{
									textAlign: 'center',
									fontFamily: APP_FONTS.INTER_700_BOLD,
									color: APP_FONT.MONTSERRAT_BODY,
									fontSize: 16,
								}}
							>
								Manage Accounts
							</Text>
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
