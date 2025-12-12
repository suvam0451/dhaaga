import { AppTimelineRendererProps } from '#/components/timelines/shared';
import { useAppTheme } from '#/states/global/hooks';
import { useUserTimelineState } from '@dhaaga/core';
import { useEffect, useState } from 'react';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';
import { FlatList, RefreshControl } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { TimelineQueryStatusIndicator } from '#/components/timelines/StateIndicator';
import PostSkeleton from '#/ui/skeletons/PostSkeleton';
import { AppDividerSoft } from '#/ui/Divider';
import NavBar_Feed from '#/components/shared/topnavbar/NavBar_Feed';

function AppTimeline({
	items,
	label,
	queryResult,
	skipTimelineInit,
	fnLoadNextPage,
	fnLoadMore,
	fnReset,
	renderItem,
	feedSwitcherEnabled,
}: AppTimelineRendererProps) {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { theme } = useAppTheme();
	const State = useUserTimelineState();

	useEffect(() => {
		if (skipTimelineInit) return;
		fnReset();
	}, []);

	const { fetchStatus, data, status, refetch } = queryResult;

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		fnLoadNextPage(data);
	}, [fetchStatus]);

	function onRefresh() {
		setIsRefreshing(true);
		fnReset();
		refetch().finally(() => setIsRefreshing(false));
	}

	function onEndReached() {
		if (State.items.length > 0 && fetchStatus !== 'fetching') {
			fnLoadMore();
		}
	}

	const { scrollHandler, animatedStyle } =
		useScrollHandleFlatList(onEndReached);

	const [ContainerHeight, setContainerHeight] = useState(0);
	function onLayout(event: any) {
		setContainerHeight(event.nativeEvent.layout.height);
	}

	/**
	 * NOTE: AT proto does not return a detailed view
	 */
	return (
		<>
			{feedSwitcherEnabled ? (
				<NavBar_Feed animatedStyle={animatedStyle} />
			) : (
				<NavBar_Simple label={label} animatedStyle={animatedStyle} />
			)}
			<FlatList
				onLayout={onLayout}
				data={items}
				renderItem={renderItem}
				onScroll={scrollHandler}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
				}}
				scrollEventThrottle={64}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
				}
				style={{ backgroundColor: theme.background.a0 }}
				ListEmptyComponent={
					<TimelineQueryStatusIndicator
						queryResult={queryResult}
						numItems={items.length}
						renderSkeleton={() => (
							<PostSkeleton containerHeight={ContainerHeight} />
						)}
					/>
				}
				ItemSeparatorComponent={() => (
					<AppDividerSoft style={{ marginVertical: 10 }} />
				)}
			/>
		</>
	);
}

export default AppTimeline;
