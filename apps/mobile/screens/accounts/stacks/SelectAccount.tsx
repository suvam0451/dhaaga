import { FlatList, View } from 'react-native';
import { Button } from '@rneui/base';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../styles/AppTheme';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import AccountInfoSyncDialog from '../../../components/dialogs/AccountInfoSync';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import ConfirmAccountDelete from '../../../components/dialogs/accounts/ConfirmAccountDelete';
import { UUID } from 'bson';
import { APP_FONTS } from '../../../styles/AppFonts';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../../components/containers/WithAutoHideTopNavBar';
import AccountListForSoftware from '../../../components/screens/profile/stack/landing/fragments/AccountListForSoftware';

function SelectAccountStack() {
	const [DialogVisible, setDialogVisible] = useState(false);
	const [DeleteDialogVisible, setDeleteDialogVisible] = useState(false);
	const DialogTarget = useRef<UUID>(null);

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
		<WithAutoHideTopNavBar title={'Select Account'} translateY={translateY}>
			<AccountInfoSyncDialog
				IsVisible={DialogVisible}
				setIsVisible={setDialogVisible}
				acctId={DialogTarget.current}
			/>
			<ConfirmAccountDelete
				IsVisible={DeleteDialogVisible}
				setIsVisible={setDeleteDialogVisible}
				acctId={DialogTarget.current}
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
				contentContainerStyle={{ paddingHorizontal: 4, paddingTop: 54 }}
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
		</WithAutoHideTopNavBar>
	);
}

export default SelectAccountStack;
