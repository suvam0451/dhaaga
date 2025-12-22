import { NotificationUserGroupType } from '@dhaaga/bridge';
import { FlatList, View } from 'react-native';
import Avatar from '#/ui/Avatar';
import useSheetNavigation from '#/states/navigation/useSheetNavigation';

type Props = {
	items: NotificationUserGroupType[];
	Header?: any;
};

function GroupedUsersItemView({ items, Header }: Props) {
	const { openUserProfileSheet } = useSheetNavigation();

	function onAvatarPress(id: string) {
		openUserProfileSheet(id);
	}

	return (
		<FlatList
			data={items}
			horizontal={true}
			renderItem={({ item }) => (
				<Avatar
					uri={item.item.avatarUrl}
					onPressed={() => {
						onAvatarPress(item.item.id);
					}}
				/>
			)}
			ListHeaderComponent={Header}
			ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
		/>
	);
}

export default GroupedUsersItemView;
