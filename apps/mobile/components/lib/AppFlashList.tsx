import { AppUserObject } from '../../types/app-user.types';
import { AppPostObject } from '../../types/app-post.types';
import { AnimatedFlashList } from '@shopify/flash-list';
import FlashListPostRenderer from '../common/timeline/fragments/FlashListPostRenderer';
import {
	FlatList,
	Pressable,
	RefreshControl,
	RefreshControlProps,
	StyleSheet,
	View,
} from 'react-native';
import {
	JSXElementConstructor,
	ReactElement,
	useEffect,
	useMemo,
	useState,
} from 'react';
import FlashListService, {
	FlashListType_PinnedTag,
} from '../../services/flashlist.service';
import NotificationItemPresenter from '../../features/inbox/presenters/NotificationItemPresenter';
import { AppNotificationObject } from '../../types/app-notification.types';
import {
	Account,
	ProfilePinnedTag,
	ProfilePinnedTimeline,
	ProfilePinnedUser,
} from '../../database/_schema';
import {
	useAppBottomSheet_Improved,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_PINNED_OBJECT_TYPE } from '../../services/driver.service';
import UserListItemView from '../../features/timelines/view/UserListItemView';
import { AppText } from './Text';
import { AppChatRoom } from '../../services/chat.service';
import { AppDivider } from './Divider';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../utils/theming.util';
import { AppIcon } from './Icon';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../utils/route-list';
import { AppFeedObject } from '../../types/app-feed.types';
import FeedListItemView from '../../features/timelines/view/FeedListItemView';
import { appDimensions } from '../../styles/dimensions';
import { APP_BOTTOM_SHEET_ENUM } from '../../states/_global';

function Chatroom_Item({ item }: { item: AppChatRoom }) {
	const [MemberAvatar, setMemberAvatar] = useState<AppUserObject>(null);
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

type PinnedTag_ListItemProps = {
	item: FlashListType_PinnedTag;
};

function Pinned_Tags_ListItem({ item }: PinnedTag_ListItemProps) {
	const { theme } = useAppTheme();
	const { show } = useAppBottomSheet_Improved();

	function onPressAddedTag() {
		if (item.type === 'eol') return;
		switch (item.props.dto.category) {
			case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_TAG_LOCAL: {
				// toProfile(item.identifier);
				break;
			}
			case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_TAG_REMOTE: {
				/**
				 * 	NOTE: this would need to resolve the remote server's
				 * 	drivers and make the necessary network calls to open
				 * 	and "anonymous" tab
				 */
				console.log('[WARN]: pin category not implemented');
				break;
			}
			default: {
				console.log('[WARN]: pin category not registered');
			}
		}
	}

	function onPressAddTag() {
		show(APP_BOTTOM_SHEET_ENUM.ADD_HUB_TAG, true);
	}

	if (item.type === 'entry') {
		return (
			<Pressable
				style={[
					styles.tagContainer,
					{ backgroundColor: theme.palette.menubar },
				]}
				onPress={onPressAddedTag}
			>
				<AppText.Medium
					numberOfLines={1}
					style={[
						{
							fontSize: 16,
							flexShrink: 1,
							color: theme.complementary.a0,
						},
					]}
				>
					#{item.props.dto.name}
				</AppText.Medium>
			</Pressable>
		);
	}

	if (item.type === 'eol')
		return (
			<Pressable onPress={onPressAddTag}>
				<View
					style={[
						styles.tagContainer,
						{
							backgroundColor: theme.palette.menubar,
							flexDirection: 'row',
							alignItems: 'center',
						},
					]}
				>
					<Ionicons
						name={'add'}
						size={22}
						color={theme.secondary.a40}
						style={{ marginLeft: 2 }}
					/>
				</View>
			</Pressable>
		);

	return <View />;
}

type AppFlashListProps<
	T extends AppPostObject | AppUserObject | AppNotificationObject,
> = {
	// the data used for render
	data: T[]; // this needs to come from useTopbarSmoothTranslate
	onScroll: (...args: any[]) => void;
	paddingTop?: number;
	refreshing?: boolean;
	onRefresh?: () => void;
	ListHeaderComponent?: any;
};

type AppFlatListProps<
	T extends
		| AppPostObject
		| AppUserObject
		| AppNotificationObject
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

type AppFlatListPinCategory<
	T extends
		| AppPostObject
		| AppUserObject
		| AppNotificationObject
		| ProfilePinnedUser
		| ProfilePinnedTimeline
		| ProfilePinnedTag,
> = AppFlatListProps<T> & {
	account: Account;
};

const POST_ESTIMATED_SIZE = 200;
const NOTIFICATION_ESTIMATED_SIZE = 100;
const USER_ESTIMATED_SIZE = 72;
const FEED_ESTIMATED_SIZE = 48;

/**
 * Collection of various FlatLists
 * that are able to render lists of
 * data in various formats
 */
export class AppFlashList {
	static Post({
		data,
		onScroll,
		refreshing,
		onRefresh,
		paddingTop,
		ListHeaderComponent,
	}: AppFlashListProps<AppPostObject>) {
		const listItems = useMemo(() => {
			return FlashListService.posts(data);
		}, [data]);

		return (
			<AnimatedFlashList
				estimatedItemSize={POST_ESTIMATED_SIZE}
				data={listItems}
				renderItem={FlashListPostRenderer}
				getItemType={(o) => o.type}
				onScroll={onScroll}
				contentContainerStyle={{
					paddingTop,
				}}
				ListHeaderComponent={ListHeaderComponent}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
		);
	}

	static Feeds({
		data,
		onScroll,
		refreshing,
		onRefresh,
		paddingTop,
		ListHeaderComponent,
	}: AppFlashListProps<AppFeedObject>) {
		return (
			<AnimatedFlashList
				estimatedItemSize={FEED_ESTIMATED_SIZE}
				data={data}
				renderItem={({ item }) => <FeedListItemView item={item} />}
				onScroll={onScroll}
				contentContainerStyle={{
					paddingTop,
				}}
				ListHeaderComponent={ListHeaderComponent}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
		);
	}

	static Users({
		data,
		onScroll,
		refreshing,
		onRefresh,
		paddingTop,
		ListHeaderComponent,
	}: AppFlashListProps<AppUserObject>) {
		return (
			<AnimatedFlashList
				estimatedItemSize={USER_ESTIMATED_SIZE}
				data={data}
				renderItem={({ item }) => <UserListItemView item={item} />}
				onScroll={onScroll}
				contentContainerStyle={{
					paddingTop:
						paddingTop || appDimensions.topNavbar.scrollViewTopPadding,
				}}
				ListHeaderComponent={ListHeaderComponent}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
		);
	}

	static Mentions({
		data,
		ListHeaderComponent,
		refreshControl,
	}: AppFlatListProps<AppNotificationObject>) {
		const listItems = useMemo(() => {
			return FlashListService.notifications(data);
		}, [data]);

		return (
			<FlatList
				data={listItems}
				renderItem={({ item }) => <NotificationItemPresenter item={item} />}
				ListHeaderComponent={ListHeaderComponent}
				refreshControl={refreshControl}
			/>
		);
	}

	static PinnedTags({ data }: AppFlatListProps<ProfilePinnedTag>) {
		const listItems = useMemo(() => {
			return FlashListService.pinnedTags(data);
		}, [data]);

		return (
			<View style={styles.pinnedTagListContainer}>
				{listItems.map((tag, i) => (
					<Pinned_Tags_ListItem key={i} item={tag} />
				))}
			</View>
		);
	}

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

const styles = StyleSheet.create({
	tagContainer: {
		padding: 6,
		borderRadius: 12,
		paddingHorizontal: 12,
		marginBottom: 8,
		marginRight: 8,
		flexShrink: 1,
	},
	tagText: {
		fontSize: 16,
		flexShrink: 1,
	},
	pinnedTagListContainer: {
		flexWrap: 'wrap',
		display: 'flex',
		flexDirection: 'row',
		flexGrow: 1,
		overflow: 'hidden',
	},

	// generated
	container: {
		flex: 1,
	},
	maskedView: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	mask: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: 180,
		height: 180,
		borderRadius: 100,
		borderWidth: 10,
		borderColor: 'transparent',
	},
	gradientBorder: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		borderRadius: 100, // Keep the border radius consistent for rounded corners
		borderWidth: 5, // Set the width of your rainbow border
		borderColor: 'transparent',
	},
	text: {
		marginTop: 20,
		fontSize: 18,
		fontWeight: 'bold',
	},
});
