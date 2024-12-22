import { AppUserObject } from '../../types/app-user.types';
import { AppPostObject } from '../../types/app-post.types';
import { AnimatedFlashList } from '@shopify/flash-list';
import FlashListPostRenderer from '../common/timeline/fragments/FlashListPostRenderer';
import { FlatList, RefreshControl } from 'react-native';
import { useMemo } from 'react';
import FlashListService from '../../services/flashlist.service';
import FlatListRenderer from '../screens/notifications/landing/fragments/FlatListRenderer';
import { AppNotificationObject } from '../../types/app-notification.types';

type AppFlashListProps<
	T extends AppPostObject | AppUserObject | AppNotificationObject,
> = {
	// the data used for render
	data: T[];
	// this needs to come from useTopbarSmoothTranslate
	onScroll: (...args: any[]) => void;
	paddingTop?: number;
	refreshing?: boolean;
	onRefresh?: () => void;
	ListHeaderComponent?: any;
};

type AppFlatListProps<
	T extends AppPostObject | AppUserObject | AppNotificationObject,
> = {
	// the data used for render
	data: T[];
	paddingTop?: number;
	refreshing?: boolean;
	onRefresh?: () => void;
	ListHeaderComponent?: any;
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
}
