import { memo } from 'react';
import useApiGetSocialNotifs from '../api/useApiGetSocialNotifs';
import { FlatList, View, Text } from 'react-native';
import FlatListRenderer from '../fragments/FlatListRenderer';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';

const NotificationViewSocial = memo(() => {
	const { items: SocialNotifs } = useApiGetSocialNotifs();

	return (
		<FlatList
			data={SocialNotifs}
			renderItem={({ item }) => {
				return <FlatListRenderer item={item} />;
			}}
			ListHeaderComponent={
				<View style={{ marginHorizontal: 8, marginVertical: 16 }}>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontSize: 14,
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							textAlign: 'center',
						}}
					>
						These users have liked, shared or mentioned you in a post.{' '}
					</Text>
				</View>
			}
		/>
	);
});

export default NotificationViewSocial;
