import { memo } from 'react';
import { AnimatedFlashList } from '@shopify/flash-list';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import {
	AccountDetails,
	AccountPfp,
} from '../../../../screens/accounts/fragments/AccountListingFragment';
import SoftwareHeader from '../../../../screens/accounts/fragments/SoftwareHeader';
import { router } from 'expo-router';
import { Account } from '../../../../database/_schema';
import {
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
} from '../../../../database/entities/account-metadata';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useAppListAccounts } from '../../../../hooks/db/useAppListAccounts';
import { AppIcon } from '../../../lib/Icon';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import {
	useAppBottomSheet_Improved,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';

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
	const { hide, refresh } = useAppBottomSheet_Improved();
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
									fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
									color: theme.primary.a0,
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
	const { stateId, isAnimating, hide, theme } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			stateId: o.bottomSheet.stateId,
			isAnimating: o.bottomSheet.isAnimating,
			hide: o.bottomSheet.hide,
			theme: o.colorScheme,
		})),
	);
	const { data } = useAppListAccounts(stateId);

	if (isAnimating) return <View />;

	function onPressMoreAccountOptions() {
		hide();
		router.navigate(APP_ROUTING_ENUM.PROFILE_ACCOUNTS);
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
							<AppIcon id={'cog'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
						</TouchableOpacity>
					</View>
				)}
				data={data}
				renderItem={({ item }) => <FlashListItem acct={item} />}
			/>
		</View>
	);
});

export default AppBottomSheetSelectAccount;
