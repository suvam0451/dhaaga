import type { ChatRoomObjectType } from '@dhaaga/bridge';
import { Pressable, View, StyleSheet } from 'react-native';
import useApiMe from '#/hooks/useApiMe';
import { Image } from 'expo-image';
import { NativeTextNormal, NativeTextBold } from '#/ui/NativeText';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useAppActiveSession, useAppTheme } from '#/states/global/hooks';
import RoutingUtils from '#/utils/routing.utils';

type Props = {
	room: ChatRoomObjectType;
};

function ChatRoomListItemView({ room }: Props) {
	const { data } = useApiMe();
	const { theme } = useAppTheme();
	const { session } = useAppActiveSession();

	if (!data || session.state !== 'valid') return <View />;
	const partner = room.members.find((o) => o.id !== data.id);

	function onPress() {
		RoutingUtils.toChatroom(room.id);
	}

	return (
		<Pressable
			style={[
				styles.root,
				{
					backgroundColor: theme.background.a10,
				},
			]}
			onPress={onPress}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<Image source={{ uri: partner.avatar }} style={styles.avatar} />
				<View style={{ flex: 1 }}>
					<NativeTextBold style={{ fontSize: 16 }}>
						{partner.displayName ?? partner.handle}
					</NativeTextBold>
					<NativeTextNormal
						style={{ fontSize: 13 }}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
					>
						@{partner.handle}
					</NativeTextNormal>
					{room.lastMessage.senderId === data.id ? (
						<View>
							<NativeTextNormal
								style={styles.lastMessageText}
								numberOfLines={1}
							>
								<NativeTextBold style={{ marginTop: 6, color: theme.primary }}>
									You:
								</NativeTextBold>{' '}
								{room.lastMessage.content.raw}
							</NativeTextNormal>
						</View>
					) : (
						<NativeTextNormal style={styles.lastMessageText} numberOfLines={1}>
							{room.lastMessage.content.raw}
						</NativeTextNormal>
					)}
				</View>
			</View>
			<View style={{ flexDirection: 'row' }}>
				<View style={{ width: 54 + 8 }} />
				{room.lastMessage.reactions.map((o, i) => (
					<View key={i}>
						<NativeTextNormal>{o.value}</NativeTextNormal>
					</View>
				))}
			</View>
		</Pressable>
	);
}
export default ChatRoomListItemView;

const styles = StyleSheet.create({
	root: {
		marginHorizontal: 6,
		paddingHorizontal: 6,
		flex: 1,
		borderRadius: 12,
		paddingVertical: 6,
	},
	avatar: {
		width: 54,
		height: 54,
		borderRadius: 27,
		marginRight: 8,
	},
	lastMessageText: {
		marginTop: 4,
		flex: 1,
	},
});
