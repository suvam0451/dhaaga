import { AppBottomSheetMenu } from '../../lib/Menu';
import { AnimatedFlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import { Account } from '../../../database/_schema';
import { Pressable, View } from 'react-native';
import { AppAccountSelectionItem } from '../../common/app/Account';
import {
	useAppBottomSheet_Improved,
	useAppDb,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { AccountService } from '../../../database/entities/account';
import { ProfileService } from '../../../database/entities/profile';
import { AppText } from '../../lib/Text';
import { AppTextInput } from '../../lib/TextInput';

type AS_Add_Profile_Select_AccountProps = {
	accts: Account[];
	onSelectAccount: (acct: Account) => void;
};

function AS_Add_Profile_Select_Account({
	accts,
	onSelectAccount,
}: AS_Add_Profile_Select_AccountProps) {
	return (
		<AnimatedFlashList
			estimatedItemSize={72}
			ListHeaderComponent={() => (
				<AppBottomSheetMenu.Header
					title={'For which Account?'}
					menuItems={[]}
				/>
			)}
			data={accts}
			contentContainerStyle={{ paddingHorizontal: 10 }}
			renderItem={({ item }) => (
				<AppAccountSelectionItem
					style={{ padding: 4, flexDirection: 'row' }}
					acct={item}
					onPress={() => {
						onSelectAccount(item);
					}}
				/>
			)}
		/>
	);
}

type ABS_Add_Profile_Name_ProfileProps = {
	onSubmitName: (input: string) => void;
};

function ABS_Add_Profile_Name_Profile({
	onSubmitName,
}: ABS_Add_Profile_Name_ProfileProps) {
	const [Text, setText] = useState(null);
	const { theme } = useAppTheme();
	return (
		<View>
			<AppBottomSheetMenu.Header title={'Pick a Name'} menuItems={[]} />
			<View style={{ padding: 10, marginTop: 24 }}>
				<AppTextInput.SingleLine
					placeholder={'Enter name. You can change this later.'}
					value={Text}
					onChangeText={setText}
					style={{ fontSize: 16, textAlign: 'center' }}
				/>
			</View>

			<Pressable
				style={{ marginTop: 48 }}
				onPress={() => {
					onSubmitName(Text);
				}}
			>
				<View
					style={{
						backgroundColor: theme.primary.a0,
						padding: 8,
						borderRadius: 8,
						maxWidth: 128,
						alignSelf: 'center',
					}}
				>
					<AppText.SemiBold style={{ color: 'black', textAlign: 'center' }}>
						Add Profile
					</AppText.SemiBold>
				</View>
			</Pressable>
		</View>
	);
}

function ABS_Add_Profile() {
	const { db } = useAppDb();
	const { stateId, hide } = useAppBottomSheet_Improved();
	const [Data, setData] = useState<Account[]>([]);
	const [SelectedAcct, setSelectedAcct] = useState(null);

	function init() {
		const accts = AccountService.getAll(db);
		for (const acct of accts) {
			acct.profiles = ProfileService.getForAccount(db, acct);
		}
		setData(accts);
		setSelectedAcct(null);
	}

	useEffect(() => {
		init();
	}, [stateId]);

	function onSelectAccount(acct: Account) {
		setSelectedAcct(acct);
	}

	function onSubmitName(name: string) {
		if (!name) return;

		ProfileService.addProfile(db, SelectedAcct, name);
		hide();
	}

	if (SelectedAcct)
		return <ABS_Add_Profile_Name_Profile onSubmitName={onSubmitName} />;

	return (
		<View style={{ height: '100%' }}>
			<AS_Add_Profile_Select_Account
				accts={Data}
				onSelectAccount={onSelectAccount}
			/>
		</View>
	);
}

export default ABS_Add_Profile;
