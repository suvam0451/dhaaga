import WithAppStatusItemContext from '#/components/containers/WithPostItemContext';
import { TimelineFilter_EmojiCrash } from '#/components/common/status/TimelineFilter_EmojiCrash';
import PostTimelineEntryView from '#/features/post-item/PostTimelineEntryView';
import { AppDividerSoft } from '#/ui/Divider';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import { RefreshControl, View } from 'react-native';
import { useState } from 'react';
import Animated, { ScrollHandlerProcessed } from 'react-native-reanimated';
import { FetchStatus } from '@tanstack/react-query';

type Props = {
	forwardedRef: any;
	fnOnRefresh: () => Promise<void>;
	fnOnEndReached: () => void;
	onScroll: ScrollHandlerProcessed<Record<string, unknown>>;
	data: any[];
	headerHeight: number;
	fetchStatus: FetchStatus;
};

function ProfileModuleListRenderer({
	forwardedRef,
	fnOnRefresh,
	fnOnEndReached,
	onScroll,
	data,
	headerHeight,
	fetchStatus,
}: Props) {
	const [IsRefreshing, setIsRefreshing] = useState(false);

	function onRefresh() {
		setIsRefreshing(true);
		fnOnRefresh().finally(() => setIsRefreshing(false));
	}

	function onEndReached() {
		if (data.length > 0 && fetchStatus !== 'fetching') {
			fnOnEndReached();
		}
	}

	return (
		<>
			<Animated.FlatList
				ref={forwardedRef}
				data={data}
				onScroll={onScroll}
				renderItem={({ item }) => (
					<WithAppStatusItemContext dto={item}>
						<TimelineFilter_EmojiCrash>
							<PostTimelineEntryView />
						</TimelineFilter_EmojiCrash>
					</WithAppStatusItemContext>
				)}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
				}
				ListHeaderComponent={<View style={{ height: headerHeight }} />}
				contentContainerStyle={{ paddingTop: 16 }}
				ItemSeparatorComponent={() => (
					<AppDividerSoft style={{ marginVertical: 10 }} />
				)}
				keyExtractor={(item) => item.id}
				removeClippedSubviews={true}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.25}
			/>
			<TimelineLoadingIndicator
				numItems={data.length}
				networkFetchStatus={fetchStatus}
			/>
		</>
	);
}

export default ProfileModuleListRenderer;
