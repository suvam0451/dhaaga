import { memo } from 'react';
import useApiGetSocialNotifs from '../api/useApiGetSocialNotifs';
import useApiGetUpdateNotifs from '../api/useApiGetUpdateNotifs';
import { View, Text, FlatList } from 'react-native';
import FlatListRenderer from '../fragments/FlatListRenderer';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';

const NotificationViewChat = memo(() => {
	const { items: SocialNotifs } = useApiGetSocialNotifs();
	return (
		<FlatList
			data={[]}
			renderItem={({ item }) => {
				return <View />;
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
						Note: Chat has been properly implemented in Dhaaga.
					</Text>
				</View>
			}
		/>
	);
});

export default NotificationViewChat;
