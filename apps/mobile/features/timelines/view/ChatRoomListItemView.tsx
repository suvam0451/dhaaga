import type { ChatRoomObjectType } from '@dhaaga/bridge';
import { Pressable, View } from 'react-native';
import useApiMe from '#/hooks/useApiMe';
import { Image } from 'expo-image';
import { NativeTextNormal, NativeTextSemiBold } from '#/ui/NativeText';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useAppTheme } from '#/states/global/hooks';
import RoutingUtils from '#/utils/routing.utils';

type Props = {
	room: ChatRoomObjectType;
};

function ChatRoomListItemView({ room }: Props) {
	const { data } = useApiMe();
	const { theme } = useAppTheme();

	if (!data) return <View />;
	const partner = room.members.find((o) => o.id !== data.id);

	function onPress() {
		RoutingUtils.toChatroom(room.id);
	}

	return (
		<Pressable onPress={onPress}>
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
					{room.lastMessage.senderId === data.id ? (
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
		</Pressable>
	);
}
export default ChatRoomListItemView;
