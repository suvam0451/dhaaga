import { View, StyleSheet } from 'react-native';
import { Button } from '@rneui/base';
import AccountListingFragment from '../fragments/AccountListingFragment';
import { useQuery } from '@realm/react';
import { Account } from '../../../entities/account.entity';
import { Text } from '@rneui/themed';
import TitleOnlyStackHeaderContainer from '../../../components/containers/TitleOnlyStackHeaderContainer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useAssets } from 'expo-asset';
import { APP_FONT } from '../../../styles/AppTheme';
import { useAppAssetsContext } from '../../../hooks/app/useAssets';
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
			<Text style={{ textAlign: 'center' }}>
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
	const [assets, error] = useAssets([
		require('../../../assets/icons/misskeyicon.png'),
	]);
	const { branding } = useAppAssetsContext();

	if (error || !assets || !assets[0]?.downloaded) return <View></View>;
	return (
		<TitleOnlyStackHeaderContainer
			route={route}
			navigation={navigation}
			headerTitle={`Select Account`}
		>
			<View style={{ flex: 1, display: 'flex' }}>
				<View style={{ flexGrow: 1, paddingHorizontal: 8 }}>
					<View style={{ marginTop: 8, marginBottom: 12 }}>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'flex-start',
								marginBottom: 4,
							}}
						>
							{/*@ts-ignore-next-line*/}
							<Image
								source={{ uri: branding[2].localUri }}
								style={{ width: 28, height: 28, opacity: 0.87 }}
							/>
							<Text style={styles.accountCategoryText}>Mastodon</Text>
						</View>
					</View>
					{MastodonAccounts.length == 0 ? (
						<NoAccountsToShow service={'Mastodon'} />
					) : (
						MastodonAccounts.map((o, i) => (
							<AccountListingFragment key={i} id={o._id} />
						))
					)}
					<View
						style={{
							marginTop: 16,
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							marginBottom: 12,
						}}
					>
						<View>
							{/*@ts-ignore-next-line*/}
							<Image
								source={assets[0].localUri}
								style={{ width: 28, height: 36, opacity: 0.87 }}
							/>
						</View>
						<Text style={styles.accountCategoryText}>Misskey</Text>
					</View>
					{MisskeyAccounts.length == 0 ? (
						<NoAccountsToShow service={'Misskey'} />
					) : (
						MisskeyAccounts.map((o, i) => (
							<AccountListingFragment key={i} id={o._id} />
						))
					)}
				</View>
				<View style={{ marginHorizontal: 16, marginBottom: 32 }}>
					<Button
						onPress={() => {
							navigation.navigate('Select a Platform', { type: 'mastodon' });
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
			</View>
		</TitleOnlyStackHeaderContainer>
	);
}

const styles = StyleSheet.create({
	accountCategoryText: {
		fontSize: 20,
		marginLeft: 8,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		color: APP_FONT.MONTSERRAT_HEADER,
	},
});

export default SelectAccountStack;
