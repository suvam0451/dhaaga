import { FlatList, View } from 'react-native';
import { Button } from '@rneui/base';
import { Text } from '@rneui/themed';
import TitleOnlyStackHeaderContainer from '../../../components/containers/TitleOnlyStackHeaderContainer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { APP_FONT } from '../../../styles/AppTheme';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import AccountInfoSyncDialog from '../../../components/dialogs/AccountInfoSync';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import ConfirmAccountDelete from '../../../components/dialogs/accounts/ConfirmAccountDelete';
import AccountListForSoftware from '../../../components/screens/accounts/stack/landing/fragments/AccountListForSoftware';
import { UUID } from 'bson';
import { APP_FONTS } from '../../../styles/AppFonts';

function SelectAccountStack() {
	const route = useRoute<any>();
	const navigation = useNavigation<any>();

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
	];
	return (
		<TitleOnlyStackHeaderContainer
			route={route}
			navigation={navigation}
			headerTitle={`Select Account`}
		>
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
				contentContainerStyle={{ paddingHorizontal: 4 }}
			/>

			<View style={{ marginHorizontal: 16, marginBottom: 32, marginTop: 28 }}>
				<Button
					onPress={() => {
						router.navigate('/accounts/select-software');
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
		</TitleOnlyStackHeaderContainer>
	);
}

export default SelectAccountStack;
