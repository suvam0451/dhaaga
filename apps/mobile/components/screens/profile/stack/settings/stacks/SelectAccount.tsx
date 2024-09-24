import { FlatList, View } from 'react-native';
import { Button } from '@rneui/base';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../../../styles/AppTheme';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import AccountInfoSyncDialog from '../../../../../dialogs/AccountInfoSync';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import ConfirmAccountDelete from '../../../../../dialogs/accounts/ConfirmAccountDelete';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import useScrollMoreOnPageEnd from '../../../../../../states/useScrollMoreOnPageEnd';
import AccountListForSoftware from '../../landing/fragments/AccountListForSoftware';
import { Accounts } from '../../../../../../database/entities/account';
import WithAccountDbContext from '../hooks/useAccountDb';
import { useAppTheme } from '../../../../../../hooks/app/useAppThemePack';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../../shared/topnavbar/AppTopNavbar';

function SelectAccountStackCore() {
	const { colorScheme } = useAppTheme();
	const [DialogVisible, setDialogVisible] = useState(false);
	const [DeleteDialogVisible, setDeleteDialogVisible] = useState(false);
	const DialogTarget = useRef<Accounts>(null);

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
						software={item}
						setDeleteDialogExpanded={setDeleteDialogVisible}
						dialogTarget={DialogTarget}
						setIsExpanded={setDialogVisible}
					/>
				)}
				contentContainerStyle={{
					paddingHorizontal: 4,
					paddingTop: 54,
					backgroundColor: colorScheme.palette.bg,
				}}
				ListFooterComponent={
					<View
						style={{ marginHorizontal: 16, marginBottom: 32, marginTop: 28 }}
					>
						<Button
							onPress={() => {
								router.navigate('/profile/onboard/select-software');
							}}
						>
							<Text
								style={{
									color: APP_FONT.MONTSERRAT_HEADER,
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
			/>
		</AppTopNavbar>
	);
}

function SelectAccountStack() {
	return (
		<WithAccountDbContext>
			<SelectAccountStackCore />;
		</WithAccountDbContext>
	);
}

export default SelectAccountStack;
