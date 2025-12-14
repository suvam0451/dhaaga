import type { ChatRoomObjectType } from '@dhaaga/bridge';
import { View } from 'react-native';
import useApiMe from '#/hooks/useApiMe';
import { Image } from 'expo-image';
import {
	NativeTextMedium,
	NativeTextNormal,
	NativeTextSemiBold,
} from '#/ui/NativeText';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useAppTheme } from '#/states/global/hooks';

type Props = {
	room: ChatRoomObjectType;
};

function ChatRoomListItemView({ room }: Props) {
	const { data } = useApiMe();
	const { theme } = useAppTheme();

	if (!data) return <View />;
	const partner = room.members.find((o) => o.id !== data.id);

	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					flex: 1,
					maxWidth: '100%',
				}}
			>
				<Image
					source={{ uri: partner.avatar }}
					style={{ width: 54, height: 54, borderRadius: 27, marginRight: 8 }}
				/>
				<View style={{ flex: 1 }}>
					<NativeTextSemiBold style={{ fontSize: 16 }}>
						{partner.displayName ?? partner.handle}
					</NativeTextSemiBold>
					<NativeTextNormal
						style={{ fontSize: 13 }}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
					>
						@{partner.handle}
					</NativeTextNormal>
					{room.lastMessage.sender.id === data.id ? (
						<View>
							<NativeTextNormal
								style={{ marginTop: 6, flex: 1 }}
								numberOfLines={1}
							>
								<NativeTextSemiBold
									style={{ marginTop: 6, color: theme.primary }}
								>
									You:
								</NativeTextSemiBold>{' '}
								{room.lastMessage.content.raw}
							</NativeTextNormal>
						</View>
					) : (
						<NativeTextNormal
							style={{ marginTop: 6, flex: 1 }}
							numberOfLines={1}
						>
							{room.lastMessage.content.raw}
						</NativeTextNormal>
					)}
				</View>
			</View>
			<View style={{ flexDirection: 'row' }}>
				<View style={{ width: 54 + 8 }} />
				{room.lastMessage.reactions.map((o, i) => (
					<View>
						<NativeTextNormal>{o.value}</NativeTextNormal>
					</View>
				))}
			</View>
		</View>
	);
}
export default ChatRoomListItemView;
