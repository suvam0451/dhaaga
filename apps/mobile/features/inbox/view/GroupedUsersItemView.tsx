import { NotificationUserGroupType } from '@dhaaga/bridge';
import { FlatList, Pressable, View } from 'react-native';
import { ICON_SIZE, styles } from '../components/_common';
import { Image } from 'expo-image';
import { AppIcon } from '../../../components/lib/Icon';

type Props = {
	items: NotificationUserGroupType[];
	Header?: JSX.Element;
};
const _ICON_SIZE = ICON_SIZE + 8;

function GroupedUsersItemView({ items, Header }: Props) {
	return (
		<FlatList
			data={items}
			horizontal={true}
			renderItem={({ item }) => (
				<Pressable
					style={[
						styles.senderAvatarContainer,
						{
							width: _ICON_SIZE + 2,
							height: _ICON_SIZE + 2,
							position: 'relative',
							borderWidth: 1,
							borderColor: 'grey',
							borderRadius: _ICON_SIZE / 2,
							overflow: 'visible',
							marginRight: 6,
						},
						{ marginHorizontal: 2 },
					]}
					onPress={() => {}}
				>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{
							uri: item.item.avatarUrl,
						}}
						style={{
							width: _ICON_SIZE,
							height: _ICON_SIZE,
							borderRadius: _ICON_SIZE / 2,
						}}
					/>
					<View
						style={[
							styles.groupIndicatorIcon,
							{
								backgroundColor: '#34aed2',
								padding: 2,
								position: 'absolute',
								right: -6,
								bottom: -6,
								overflow: 'visible',
							},
						]}
					>
						<AppIcon id="add" size={16} color="white" />
					</View>
				</Pressable>
			)}
			style={{ flex: 1 }}
			ListHeaderComponent={Header}
			contentContainerStyle={{ paddingBottom: 10 }}
		/>
	);
}

export default GroupedUsersItemView;
