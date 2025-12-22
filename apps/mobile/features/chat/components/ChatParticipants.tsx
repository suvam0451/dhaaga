import { Image } from 'expo-image';
import type { UserObjectType } from '@dhaaga/bridge';
import { FlatList, View } from 'react-native';

type ParticipantsProps = {
	accounts: UserObjectType[];
};

function ChatParticipants({ accounts }: ParticipantsProps) {
	const AVATAR_SIZE = 48;
	return (
		<FlatList
			horizontal={true}
			data={accounts}
			renderItem={({ item }: { item: UserObjectType }) => (
				<View style={{ padding: 4 }}>
					<Image
						source={{ uri: item.avatarUrl }}
						style={{
							width: AVATAR_SIZE,
							height: AVATAR_SIZE,
							borderRadius: AVATAR_SIZE / 2,
						}}
					/>
				</View>
			)}
		/>
	);
}

export default ChatParticipants;
