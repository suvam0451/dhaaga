import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { DatetimeUtil } from '#/utils/datetime.utils';
import type { MessageObjectType } from '@dhaaga/bridge';
import { useActiveUserSession, useAppTheme } from '#/states/global/hooks';
import { NativeTextNormal } from '#/ui/NativeText';
import { useChatroomState } from '@dhaaga/react';

const MINI_AVATAR_SIZE = 28;

type SenderProps = {
	senderId: string;
};

function _Sender({ senderId }: SenderProps) {
	const State = useChatroomState();

	if (!State.roomData?.members) return <View style={styles.avatarContainer} />;

	const avatarUrl = State.roomData.members.find(
		(member) => member.id === senderId,
	)?.avatar;
	return (
		<View style={styles.avatarContainer}>
			<Image
				source={{
					uri: avatarUrl,
				}}
				style={{
					width: MINI_AVATAR_SIZE,
					height: MINI_AVATAR_SIZE,
					borderRadius: MINI_AVATAR_SIZE / 2,
				}}
			/>
		</View>
	);
}

type Props = {
	item: MessageObjectType;
};

function ChatRoomMessageItemView({ item }: Props) {
	const { theme } = useAppTheme();
	const { acct } = useActiveUserSession();

	const IS_ME = item.senderId === acct.identifier;

	if (IS_ME) {
		return (
			<View style={styles.rootRight}>
				<View style={{ flex: 1 }} />
				<NativeTextNormal emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}>
					{DatetimeUtil.timeAgo(item.createdAt)}
				</NativeTextNormal>
				<View
					style={[
						styles.messageContentBoxRight,
						{
							backgroundColor: theme.primary,
						},
					]}
				>
					<NativeTextNormal style={{ color: theme.primaryText }}>
						{item.content?.raw}
					</NativeTextNormal>
				</View>
			</View>
		);
	} else {
		return (
			<View style={styles.rootLeft}>
				<_Sender senderId={item.senderId} />
				<View
					style={[
						styles.messageContentBoxLeft,
						{
							backgroundColor: theme.complementary,
						},
					]}
				>
					<NativeTextNormal style={{ color: theme.primaryText }}>
						{item.content?.raw}
					</NativeTextNormal>
				</View>
				<NativeTextNormal emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}>
					{DatetimeUtil.timeAgo(item.createdAt)}
				</NativeTextNormal>
			</View>
		);
	}
}

export default ChatRoomMessageItemView;

const styles = StyleSheet.create({
	rootLeft: {
		flexDirection: 'row',
		marginBottom: 8,
		marginLeft: 10,
		alignItems: 'flex-start',
	},
	rootRight: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 8,
	},
	avatarContainer: {
		alignItems: 'flex-start',
		height: '100%',
	},
	messageContentBoxLeft: {
		alignSelf: 'flex-end',
		maxWidth: '60%',
		padding: 6,
		borderRadius: 8,
		marginRight: 10,
		borderTopLeftRadius: 0,
		marginLeft: 8,
	},
	messageContentBoxRight: {
		alignSelf: 'flex-end',
		maxWidth: '60%',
		padding: 6,
		borderRadius: 8,
		marginRight: 10,
		borderBottomRightRadius: 0,
		marginLeft: 8,
	},
});
