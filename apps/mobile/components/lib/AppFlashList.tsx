import { AppUserObject } from '../../types/app-user.types';
import { AppPostObject } from '../../types/app-post.types';
import { AnimatedFlashList } from '@shopify/flash-list';
import FlashListPostRenderer from '../common/timeline/fragments/FlashListPostRenderer';
import {
	FlatList,
	Pressable,
	RefreshControl,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useMemo } from 'react';
import FlashListService, {
	FlashListType_PinnedTag,
} from '../../services/flashlist.service';
import FlatListRenderer from '../screens/notifications/landing/fragments/FlatListRenderer';
import { AppNotificationObject } from '../../types/app-notification.types';
import {
	Account,
	ProfilePinnedTag,
	ProfilePinnedTimeline,
	ProfilePinnedUser,
} from '../../database/_schema';
import {
	useAppBottomSheet_Improved,
	useAppDialog,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import useAppNavigator from '../../states/useAppNavigator';
import { APP_PINNED_OBJECT_TYPE } from '../../services/driver.service';
import { APP_FONTS } from '../../styles/AppFonts';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AccountService } from '../../database/entities/account';
import * as Haptics from 'expo-haptics';
import { APP_BOTTOM_SHEET_ENUM } from '../dhaaga-bottom-sheet/Core';
import { DialogBuilderService } from '../../services/dialog-builder.service';
import SearchResultUserItem from '../screens/search/SearchResultUserItem';

// avatar width + (padding + border) * 2
const PINNED_USER_BOX_SIZE = 64 + (3 + 1.75) * 2;

function Pinned_Users_LastItem() {
	const { theme } = useAppTheme();
	const { show } = useAppBottomSheet_Improved();

	function onPress() {
		show(APP_BOTTOM_SHEET_ENUM.ADD_HUB_USER, true);
	}
	return (
		<Pressable
			style={{
				flex: 1,
				marginBottom: 8,
				maxWidth: '25%',
				height: '100%',
			}}
			onPress={onPress}
		>
			<View
				style={{
					width: PINNED_USER_BOX_SIZE,
					alignSelf: 'center',
				}}
			>
				<View
					style={{
						borderRadius: '100%',
						overflow: 'hidden',
						padding: 2,
						borderColor: theme.secondary.a50,
						borderWidth: 2.75,
						opacity: 0.78,
						height: 71.5,
					}}
				>
					<View
						style={{
							width: 48,
							height: 48,
							alignSelf: 'center',
							margin: 'auto',
						}}
					>
						<Ionicons
							name={'add-outline'}
							size={48}
							color={theme.secondary.a50}
						/>
					</View>
				</View>
			</View>
		</Pressable>
	);
}

type ListItemProps = {
	item: ProfilePinnedUser;
	account: Account;
};

function Pinned_Users_ListItem({ item, account }: ListItemProps) {
	const { theme } = useAppTheme();
	const { acct, db, loadApp } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			db: o.db,
			loadApp: o.loadApp,
		})),
	);
	const { show, hide } = useAppDialog();
	const { toTimelineViaPin } = useAppNavigator();

	function onPress() {
		if (account.id !== acct.id) {
			show(
				DialogBuilderService.toSwitchActiveAccount(() => {
					AccountService.select(db, account);
					try {
						loadApp().then(() => {
							hide();
							toTimelineViaPin(item.id, 'user');
						});
					} catch (e) {
						hide();
					}
				}),
			);
			return;
		}

		switch (item.category) {
			case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_USER_LOCAL: {
				// toProfile(item.identifier);
				toTimelineViaPin(item.id, 'user');
				break;
			}
			case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_USER_REMOTE: {
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

	function onLongPress() {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
	}

	return (
		<Pressable
			style={{
				flex: 1,
				marginBottom: 8,
				maxWidth: '25%',
			}}
			onPress={onPress}
			onLongPress={onLongPress}
		>
			<View
				style={{
					width: 64 + 4.75 * 2,
					alignSelf: 'center',
				}}
			>
				<View
					style={{
						borderRadius: '100%',
						overflow: 'hidden',
						padding: 3,
						borderColor: theme.complementary.a0,
						borderWidth: 1.75,
						opacity: 0.78,
					}}
				>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{
							uri: item.avatarUrl,
						}}
						style={{
							borderRadius: 64 / 2,
							width: 64,
							height: 64,
						}}
					/>
				</View>
			</View>
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
				<Text
					numberOfLines={1}
					style={[
						styles.tagText,
						{
							color: theme.complementary.a0,
						},
					]}
				>
					#{item.props.dto.name}
				</Text>
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
		| ProfilePinnedTag,
> = {
	// the data used for render
	data: T[];
	paddingTop?: number;
	refreshing?: boolean;
	onRefresh?: () => void;
	ListHeaderComponent?: any;
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
				estimatedItemSize={POST_ESTIMATED_SIZE}
				data={data}
				renderItem={({ item }) => <SearchResultUserItem item={item} />}
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

	static Mentions({
		data,
		ListHeaderComponent,
	}: AppFlatListProps<AppNotificationObject>) {
		const listItems = useMemo(() => {
			return FlashListService.notifications(data);
		}, [data]);

		return (
			<FlatList
				data={listItems}
				renderItem={({ item }) => {
					return <FlatListRenderer item={item} />;
				}}
				ListHeaderComponent={ListHeaderComponent}
			/>
		);
	}

	static PinnedProfiles({
		data,
		account,
	}: AppFlatListPinCategory<ProfilePinnedUser>) {
		const listItems = useMemo(() => {
			return FlashListService.pinnedUsers(data);
		}, [data]);

		return (
			<FlatList
				data={listItems}
				numColumns={4}
				renderItem={({ item }) => {
					if (item.type === 'entry')
						return (
							<Pinned_Users_ListItem item={item.props.dto} account={account} />
						);
					return <Pinned_Users_LastItem />;
				}}
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
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
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
});
