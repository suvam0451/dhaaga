import { AppDividerSoft } from '#/ui/Divider';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import { RefreshControl, View } from 'react-native';
import { useState } from 'react';
import Animated, { ScrollHandlerProcessed } from 'react-native-reanimated';
import { FetchStatus } from '@tanstack/react-query';
import TimelinePostItemView from '#/features/post-item-view/TimelinePostItemView';

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
				renderItem={({ item }) => <TimelinePostItemView post={item} />}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
				}
				ListHeaderComponent={<View style={{ height: headerHeight }} />}
				contentContainerStyle={{ paddingTop: 16 }}
				ItemSeparatorComponent={() => (
					<AppDividerSoft themed style={{ marginVertical: 6 }} />
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
