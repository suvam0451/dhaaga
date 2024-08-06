import { View } from 'react-native';
import { Button } from '@rneui/base';
import AccountListingFragment from '../fragments/AccountListingFragment';
import { useQuery } from '@realm/react';
import { Account } from '../../../entities/account.entity';
import { Text } from '@rneui/themed';
import TitleOnlyStackHeaderContainer from '../../../components/containers/TitleOnlyStackHeaderContainer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { APP_FONT } from '../../../styles/AppTheme';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import AccountInfoSyncDialog from '../../../components/dialogs/AccountInfoSync';
import SoftwareHeader from '../fragments/SoftwareHeader';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import ConfirmAccountDelete from '../../../components/dialogs/accounts/ConfirmAccountDelete';
import { APP_FONTS } from '../../../styles/AppFonts';

function NoAccountsToShow({ service }: { service: string }) {
	return (
		<View
			style={{
				borderWidth: 1,
				borderColor: '#888',
				padding: 8,
				borderRadius: 8,
				marginHorizontal: 8,
			}}
		>
			<Text
				style={{
					textAlign: 'center',
					fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
					color: APP_FONT.MONTSERRAT_BODY,
				}}
			>
				You have not added any {service} compatible account
			</Text>
		</View>
	);
}

function SelectAccountStack() {
	const route = useRoute<any>();
	const navigation = useNavigation<any>();

	const accounts: Account[] = useQuery(Account);

	const MastodonAccounts = accounts.filter((o) => o?.domain === 'mastodon');
	const MisskeyAccounts = accounts.filter((o) => o?.domain === 'misskey');
	const FirefishAccounts = accounts.filter((o) => o?.domain === 'firefish');
	const SharkeyAccounts = accounts.filter((o) => o?.domain === 'sharkey');
	const [DialogVisible, setDialogVisible] = useState(false);
	const [DeleteDialogVisible, setDeleteDialogVisible] = useState(false);
	const DialogTarget = useRef<Account>(null);

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

			<View style={{ flexGrow: 1, paddingHorizontal: 8 }}>
				<SoftwareHeader software={KNOWN_SOFTWARE.FIREFISH} mb={6} />
				{FirefishAccounts.length == 0 ? (
					<NoAccountsToShow service={'Firefish'} />
				) : (
					FirefishAccounts.map((o, i) => (
						<AccountListingFragment
							key={i}
							id={o._id}
							setIsExpanded={setDialogVisible}
							dialogTarget={DialogTarget}
							setDeleteDialogExpanded={setDeleteDialogVisible}
							acct={o}
						/>
					))
				)}

				<SoftwareHeader software={KNOWN_SOFTWARE.MASTODON} mb={6} mt={12} />
				{MastodonAccounts.length == 0 ? (
					<NoAccountsToShow service={'Mastodon'} />
				) : (
					MastodonAccounts.map((o, i) => (
						<AccountListingFragment
							key={i}
							id={o._id}
							setIsExpanded={setDialogVisible}
							dialogTarget={DialogTarget}
							setDeleteDialogExpanded={setDeleteDialogVisible}
							acct={o}
						/>
					))
				)}

				<SoftwareHeader software={KNOWN_SOFTWARE.MISSKEY} mb={4} mt={12} />
				{MisskeyAccounts.length == 0 ? (
					<NoAccountsToShow service={'Misskey'} />
				) : (
					MisskeyAccounts.map((o, i) => (
						<AccountListingFragment
							key={i}
							id={o._id}
							setIsExpanded={setDialogVisible}
							dialogTarget={DialogTarget}
							setDeleteDialogExpanded={setDeleteDialogVisible}
							acct={o}
						/>
					))
				)}

				<SoftwareHeader software={KNOWN_SOFTWARE.SHARKEY} mb={6} mt={12} />
				{SharkeyAccounts.length == 0 ? (
					<NoAccountsToShow service={'Sharkey'} />
				) : (
					SharkeyAccounts.map((o, i) => (
						<AccountListingFragment
							key={i}
							id={o._id}
							setIsExpanded={setDialogVisible}
							dialogTarget={DialogTarget}
							setDeleteDialogExpanded={setDeleteDialogVisible}
							acct={o}
						/>
					))
				)}
			</View>
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
