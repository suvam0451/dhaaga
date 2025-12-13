import { useEffect, useState } from 'react';
import { Account, AccountService, ProfileService } from '@dhaaga/db';
import { Animated, Pressable, View } from 'react-native';
import { AppAccountSelectionItem } from '../../common/app/Account';
import {
	useAppBottomSheet,
	useAppDb,
	useAppPublishers,
	useAppTheme,
} from '#/states/global/hooks';
import { AppText } from '../../lib/Text';
import { AppTextInput } from '../../lib/TextInput';
import { APP_EVENT_ENUM } from '#/states/event-bus/app.publisher';
import BottomSheetMenu from '#/components/dhaaga-bottom-sheet/components/BottomSheetMenu';

type AS_Add_Profile_Select_AccountProps = {
	accts: Account[];
	onSelectAccount: (acct: Account) => void;
};

function AS_Add_Profile_Select_Account({
	accts,
	onSelectAccount,
}: AS_Add_Profile_Select_AccountProps) {
	return (
		<Animated.FlatList
			ListHeaderComponent={() => (
				<BottomSheetMenu variant={'clear'} title={'For which Account?'} />
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
		<>
			<BottomSheetMenu variant={'clear'} title={'Pick a Name'} />
			<View style={{ padding: 10, marginTop: 24 }}>
				<AppTextInput.SingleLine
					placeholder={'Enter name. You can change this later.'}
					value={Text}
					onChangeText={setText}
					style={{
						fontSize: 18,
						textAlign: 'center',
						height: 128,
					}}
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
						backgroundColor: theme.primary,
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
		</>
	);
}

function ABS_Add_Profile() {
	const { db } = useAppDb();
	const { stateId, hide } = useAppBottomSheet();
	const { appEventBus } = useAppPublishers();
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
		appEventBus.publish(APP_EVENT_ENUM.PROFILE_LIST_CHANGED);
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
