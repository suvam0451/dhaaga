import { memo } from 'react';
import { Props } from './_common';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { FontAwesome } from '@expo/vector-icons';
import { Text } from '@rneui/themed';
import { ActivitypubHelper } from '@dhaaga/shared-abstraction-activitypub';

const FavouriteNotificationFragment = memo(function Foo({ item }: Props) {
	const { subdomain } = useActivityPubRestClientContext();
	const numUsers = item.items.length;
	const accts = item.items.map((o) => o.account);
	if (numUsers === 1)
		return (
			<View>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ width: 42, height: 42, position: 'relative' }}>
						{/*@ts-ignore-next-line*/}
						<Image
							source={{
								uri: accts[0].getAvatarUrl(),
								blurhash: accts[0].getAvatarBlurHash(),
							}}
							style={{ width: 42, height: 42, borderRadius: 8 }}
						/>
						<View
							style={{
								position: 'absolute',
								zIndex: 99,
								backgroundColor: 'rgba(146,168,29,0.87)',
								bottom: -8,
								right: -8,
								padding: 3,
								borderRadius: 8,
							}}
						>
							<FontAwesome
								name="star"
								size={20}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						</View>
					</View>
					<View style={{ marginLeft: 12 }}>
						<Text
							style={{
								fontFamily: 'Montserrat-Bold',
								color: APP_FONT.MONTSERRAT_HEADER,
							}}
						>
							{accts[0].getDisplayName()}
						</Text>
						<Text
							style={{
								fontFamily: 'Inter-Bold',
								color: APP_FONT.MONTSERRAT_BODY,
							}}
						>
							{ActivitypubHelper.getHandle(
								accts[0]?.getAccountUrl(),
								subdomain,
							)}
						</Text>
					</View>
				</View>
				;
			</View>
		);
	return <View></View>;
});

export default FavouriteNotificationFragment;
