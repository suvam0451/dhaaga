import { memo } from 'react';
import { FlatList, View } from 'react-native';
import FlatListRenderer from '../fragments/FlatListRenderer';
import useApiGetUpdateNotifs from '../api/useApiGetUpdateNotifs';

const NotificationViewUpdates = memo(() => {
	const { items: SocialNotifs } = useApiGetUpdateNotifs();

	return (
		<FlatList
			data={SocialNotifs}
			renderItem={({ item }) => {
				return <FlatListRenderer item={item} />;
			}}
			ListHeaderComponent={<View />}
		/>
	);
});

export default NotificationViewUpdates;
