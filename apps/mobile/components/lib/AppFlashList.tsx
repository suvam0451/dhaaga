import { Pressable, View } from 'react-native';
import { useEffect, useState } from 'react';
import type { UserObjectType } from '@dhaaga/bridge';
import { useAppTheme } from '#/states/global/hooks';
import { Image } from 'expo-image';
import { AppChatRoom } from '#/services/chat.service';
import { AppDivider } from './Divider';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { AppIcon } from './Icon';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { NativeTextNormal } from '#/ui/NativeText';

export function Chatroom_Item({ item }: { item: AppChatRoom }) {
	const [MemberAvatar, setMemberAvatar] = useState<UserObjectType>(null);
	const [LatestMessageMe, setLatestMessageMe] = useState(false);
	const { theme } = useAppTheme();

	const AVATAR_SIZE = 54;

	useEffect(() => {
		const others = item.members.filter((o) => o.id !== item.myId);
		if (others.length > 0) {
			setMemberAvatar(others[0]);
		}
		setLatestMessageMe(item.lastMessage.senderId === item.myId);
	}, [item]);

	function onPress() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.CHATROOM,
			params: {
				roomId: item.externalId,
			},
		});
	}

	return (
		<Pressable style={{ paddingHorizontal: 10 }} onPress={onPress}>
			<View style={{ flexDirection: 'row', width: '100%' }}>
				<View>
					<Image
						source={{ uri: MemberAvatar?.avatarUrl }}
						style={{
							width: AVATAR_SIZE,
							height: AVATAR_SIZE,
							borderRadius: AVATAR_SIZE / 2,
						}}
					/>
				</View>
				<View style={{ marginLeft: 10, flexGrow: 1, flex: 1 }}>
					<NativeTextNormal
						style={{ marginBottom: 4, width: '100%' }}
						numberOfLines={1}
					>
						{MemberAvatar?.displayName || MemberAvatar?.handle}
					</NativeTextNormal>

					<NativeTextNormal
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
						numberOfLines={1}
					>
						{LatestMessageMe ? (
							<NativeTextNormal style={{ color: theme.primary }}>
								You:{' '}
							</NativeTextNormal>
						) : (
							''
						)}
						{item.lastMessage.content.raw}
					</NativeTextNormal>
				</View>
				<View
					style={{
						// height: '100%',
						alignItems: 'center', // backgroundColor: 'red',
						alignSelf: 'center',
					}}
				>
					<AppIcon id={'chevron-right'} />
				</View>
			</View>
			<AppDivider.Hard
				style={{ backgroundColor: '#242424', marginVertical: 8 }}
			/>
		</Pressable>
	);
}
