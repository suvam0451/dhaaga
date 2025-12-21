import { FlatList, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import AccountManagementListItem from '../home/components/AccountManagementListItem';
import { useAppTheme } from '#/states/global/hooks';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import { appDimensions } from '#/styles/dimensions';
import useDbSyncAccountList from '#/features/accounts/hooks/useDbSyncAccountList';

function ManageAccountsPage() {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { accounts, refresh, isLoading } = useDbSyncAccountList();

	const SOFTWARE_ARRAY = [
		KNOWN_SOFTWARE.AKKOMA,
		KNOWN_SOFTWARE.CHERRYPICK,
		KNOWN_SOFTWARE.FIREFISH,
		KNOWN_SOFTWARE.MASTODON,
		KNOWN_SOFTWARE.MISSKEY,
		KNOWN_SOFTWARE.PLEROMA,
		KNOWN_SOFTWARE.SHARKEY,
		KNOWN_SOFTWARE.BLUESKY,
	];

	function onPressAddAccount() {
		router.navigate(APP_ROUTING_ENUM.PROFILE_ADD_ACCOUNT);
	}

	return (
		<>
			<NavBar_Simple label={'Manage Accounts'} />
			<FlatList
				data={SOFTWARE_ARRAY}
				renderItem={({ item }) => (
					<AccountManagementListItem
						data={accounts}
						software={item}
						onListChange={refresh}
					/>
				)}
				contentContainerStyle={{
					paddingHorizontal: 4,
					backgroundColor: theme.background.a0,
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
				}}
				ListFooterComponent={
					<AppButtonVariantA
						label={t(`onboarding.addAccountButton`)}
						loading={false}
						onClick={onPressAddAccount}
						style={{ width: 196, marginTop: 32 }}
					/>
				}
				refreshControl={
					<RefreshControl refreshing={isLoading} onRefresh={refresh} />
				}
				style={{ backgroundColor: theme.background.a0 }}
			/>
		</>
	);
}

export default ManageAccountsPage;
