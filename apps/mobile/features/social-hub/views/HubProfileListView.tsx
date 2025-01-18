import { useMemo, useState } from 'react';
import {
	useAppTheme,
	useHub,
} from '../../../hooks/utility/global-state-extractors';
import { FlatList, View } from 'react-native';
import { AppText } from '../../../components/lib/Text';
import { Account } from '../../../database/_schema';
import { Image } from 'expo-image';

function HubProfileListView() {
	const { accounts, navigation } = useHub();
	const { theme } = useAppTheme();

	const [Acct, setAcct] = useState<Account>(null);
	const tabLabels = useMemo(() => {
		if (navigation.accountIndex === -1 || navigation.profileIndex === -1)
			return [{ label: 'New +', id: '__add__' }];
		if (navigation.accountIndex === accounts.length)
			return [{ label: 'New +', id: '__add__' }];

		setAcct(accounts[navigation.accountIndex]);
		return [
			...accounts[navigation.accountIndex].profiles.map((o) => ({
				label: o.name,
				id: o.id.toString(),
			})),
			{ label: 'Add +', id: '__add__' },
		];
	}, [accounts, navigation]);

	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					marginHorizontal: 10,
					marginVertical: 8,
				}}
			>
				<FlatList
					horizontal={true}
					data={tabLabels}
					renderItem={({ item, index }) => (
						<View
							style={{
								padding: 8,
								marginHorizontal: 6,
								backgroundColor:
									navigation.profileIndex === index
										? theme.primary.a0
										: theme.background.a30,
								borderRadius: 8,
								paddingHorizontal: 12,
							}}
						>
							<AppText.Medium
								style={{
									fontSize: 16,
									color:
										navigation.profileIndex === index
											? 'black'
											: theme.secondary.a20,
								}}
							>
								{item.label}
							</AppText.Medium>
						</View>
					)}
					ListHeaderComponent={
						<View style={{ marginRight: 6 }}>
							{/*@ts-ignore-next-line*/}
							<Image
								source={{ uri: Acct?.avatarUrl }}
								style={{ height: 36, width: 36, borderRadius: 18 }}
							/>
						</View>
					}
				/>
			</View>
		</View>
	);
}

export default HubProfileListView;
