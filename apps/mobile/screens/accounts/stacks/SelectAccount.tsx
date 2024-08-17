import { FlatList, View } from 'react-native';
import { Button } from '@rneui/base';
import { Account } from '../../../entities/account.entity';
import { Text } from '@rneui/themed';
import TitleOnlyStackHeaderContainer from '../../../components/containers/TitleOnlyStackHeaderContainer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { APP_FONT } from '../../../styles/AppTheme';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import AccountInfoSyncDialog from '../../../components/dialogs/AccountInfoSync';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import ConfirmAccountDelete from '../../../components/dialogs/accounts/ConfirmAccountDelete';
import AccountListForSoftware from '../../../components/screens/accounts/stack/landing/fragments/AccountListForSoftware';

function SelectAccountStack() {
	const route = useRoute<any>();
	const navigation = useNavigation<any>();

	const [DialogVisible, setDialogVisible] = useState(false);
	const [DeleteDialogVisible, setDeleteDialogVisible] = useState(false);
	const DialogTarget = useRef<Account>(null);

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
							fontFamily: 'Inter-Bold',
							fontSize: 16,
						}}
					>
						Add an Account
					</Text>
				</Button>
			</View>
		</TitleOnlyStackHeaderContainer>
	);
}

export default SelectAccountStack;
