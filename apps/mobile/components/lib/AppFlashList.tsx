import { FlatList, Pressable, RefreshControlProps, View } from 'react-native';
import {
	JSXElementConstructor,
	ReactElement,
	useEffect,
	useState,
} from 'react';
import type {
	NotificationObjectType,
	UserObjectType,
	PostObjectType,
} from '@dhaaga/core';
import {
	ProfilePinnedTag,
	ProfilePinnedTimeline,
	ProfilePinnedUser,
} from '@dhaaga/db';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { Image } from 'expo-image';
import { AppText } from './Text';
import { AppChatRoom } from '../../services/chat.service';
import { AppDivider } from './Divider';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../utils/theming.util';
import { AppIcon } from './Icon';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../utils/route-list';

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
		setLatestMessageMe(item.lastMessage.sender.id === item.myId);
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
					{/*@ts-ignore-next-line*/}
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
					<AppText.Medium
						style={{ marginBottom: 4, width: '100%' }}
						numberOfLines={1}
					>
						{MemberAvatar?.displayName || MemberAvatar?.handle}
					</AppText.Medium>

					<AppText.Normal
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
						numberOfLines={1}
					>
						{LatestMessageMe ? (
							<AppText.Normal style={{ color: theme.primary.a0 }}>
								You:{' '}
							</AppText.Normal>
						) : (
							''
						)}
						{item.lastMessage.content.raw}
					</AppText.Normal>
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

type AppFlatListProps<
	T extends
		| PostObjectType
		| UserObjectType
		| NotificationObjectType
		| ProfilePinnedUser
		| ProfilePinnedTimeline
		| ProfilePinnedTag
		| AppChatRoom,
> = {
	// the data used for render
	data: T[];
	paddingTop?: number;
	refreshing?: boolean;
	onRefresh?: () => void;
	ListHeaderComponent?: any;

	refreshControl?: ReactElement<
		RefreshControlProps,
		string | JSXElementConstructor<any>
	>;
};

/**
 * Collection of various FlatLists
 * that are able to render lists of
 * data in various formats
 */
export class AppFlashList {
	static Chatrooms({
		data,
		ListHeaderComponent,
		refreshControl,
	}: AppFlatListProps<AppChatRoom>) {
		return (
			<FlatList
				data={data}
				renderItem={({ item }) => {
					return <Chatroom_Item item={item} />;
				}}
				ListHeaderComponent={ListHeaderComponent}
				refreshControl={refreshControl}
			/>
		);
	}
}
