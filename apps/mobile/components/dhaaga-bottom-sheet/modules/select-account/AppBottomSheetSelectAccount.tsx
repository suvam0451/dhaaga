import { memo } from 'react';
import { Account } from '../../../../entities/account.entity';
import { useObject, useQuery, useRealm } from '@realm/react';
import { AnimatedFlashList } from '@shopify/flash-list';
import { TouchableOpacity, View } from 'react-native';
import { UUID } from 'bson';
import AccountRepository from '../../../../repositories/account.repo';
import AccountService from '../../../../services/account.service';
import { EmojiService } from '../../../../services/emoji.service';
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
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

type FlashListItemProps = {
	id: UUID;
};

const FlashListItem = memo(({ id }: FlashListItemProps) => {
	const { regenerate } = useActivityPubRestClientContext();
	const { setVisible } = useAppBottomSheet();
	const account = useObject(Account, id);
	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();

	const avatar = AccountRepository.findSecret(db, account, 'avatar')?.value;
	const displayName = AccountRepository.findSecret(
		db,
		account,
		'display_name',
	)?.value;

	async function onSelect() {
		if (account.selected) {
			AccountService.deselectAccount(db, account._id);
		} else {
			AccountService.selectAccount(db, account._id);
			await EmojiService.refresh(db, globalDb, account.subdomain, true);
		}
		regenerate();
		setVisible(false);
	}

	if (!account) return <View />;

	return (
		<View
			style={{
				backgroundColor: '#202020',
				padding: 8,
				paddingVertical: 6,
				marginBottom: 8,
				borderRadius: 8,
				marginHorizontal: 8,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						flex: 1,
					}}
					onPress={onSelect}
				>
					<AccountPfp
						selected={account.selected}
						url={avatar}
						onClicked={onSelect}
					/>
					<AccountDetails
						onClicked={onSelect}
						selected={account.selected}
						displayName={displayName}
						username={account.username}
						subdomain={account.subdomain}
					/>
				</TouchableOpacity>

				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<TouchableOpacity
						style={{
							alignItems: 'center',
							paddingHorizontal: 12,
							paddingVertical: 12,
						}}
						onPress={onSelect}
					>
						{account.selected && (
							<Text
								style={{
									fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
									color: '#9dced7',
								}}
							>
								Active
							</Text>
						)}
					</TouchableOpacity>
					<SoftwareHeader software={account.domain} mb={4} mt={8} />
				</View>
			</View>
		</View>
	);
});
const AppBottomSheetSelectAccount = memo(() => {
	const { isAnimating, setVisible } = useAppBottomSheet();
	const accounts: Account[] = useQuery(Account);

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
				renderItem={({ item }) => <FlashListItem id={item._id} />}
			/>
		</View>
	);
});

export default AppBottomSheetSelectAccount;
