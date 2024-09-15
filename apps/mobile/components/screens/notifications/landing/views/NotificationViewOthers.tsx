import { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import FlatListRenderer from '../fragments/FlatListRenderer';
import useApiGetUpdateNotifs from '../api/useApiGetUpdateNotifs';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';

const NotificationViewOthers = memo(() => {
	const { items: SocialNotifs } = useApiGetUpdateNotifs();

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
						Miscellaneous updates from other users.
					</Text>
				</View>
			}
		/>
	);
});

export default NotificationViewOthers;
