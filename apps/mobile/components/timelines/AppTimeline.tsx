import { AppTimelineRendererProps } from '#/components/timelines/shared';
import { useAppTheme } from '#/states/global/hooks';
import { useEffect, useState } from 'react';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';
import NavBar_Simple from '#/components/topnavbar/NavBar_Simple';
import { appDimensions } from '#/styles/dimensions';
import { TimelineQueryStatusIndicator } from '#/components/timelines/StateIndicator';
import PostSkeleton from '#/ui/skeletons/PostSkeleton';
import { AppDividerSoft } from '#/ui/Divider';
import NavBar_Feed from '#/components/topnavbar/NavBar_Feed';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import { FlatList, View } from 'react-native';
import NavBar_Explore from '#/components/topnavbar/NavBar_Explore';
import NavBar_Inbox from '#/components/topnavbar/NavBar_Inbox';
import {
	POST_FEED_INITIAL_NUM_TO_RENDER,
	POST_FEED_WINDOW_SIZE,
} from '#/utils/constans';

const navbarConfigs: Record<
	string,
	{ height: number; topLoaderOffset: number }
> = {
	unified: {
		height: appDimensions.topNavbar.hubVariantHeight,
		topLoaderOffset: appDimensions.topNavbar.hubVariantHeight + 8,
	},
	explore: {
		height: appDimensions.topNavbar.hubVariantHeight,
		topLoaderOffset: appDimensions.topNavbar.hubVariantHeight + 8,
	},
	simple: {
		height: appDimensions.topNavbar.simpleVariantHeight,
		topLoaderOffset: appDimensions.topNavbar.simpleVariantHeight + 8,
	},
	updates: {
		height: appDimensions.topNavbar.hubVariantHeight,
		topLoaderOffset: appDimensions.topNavbar.hubVariantHeight + 8,
	},
};

const widgetConfigs: Record<
	string,
	{ height: number; bottomLoaderOffset: number }
> = {
	explore: {
		height: 52,
		bottomLoaderOffset: 52,
	},
	simple: {
		height: 0,
		bottomLoaderOffset: 0,
	},
};

function AppTimeline({
	items,
	label,
	queryResult,
	skipTimelineInit,
	fnLoadNextPage,
	fnLoadMore,
	fnReset,
	renderItem,
	navbarType,
	NavBar,
	flatListKey,
}: AppTimelineRendererProps) {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { theme } = useAppTheme();

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
		fnLoadMore();
	}

	const { scrollHandler, animatedStyle } = useScrollHandleFlatList(
		onEndReached,
		navbarConfigs[navbarType]?.height ?? 52,
	);

	const [ContainerHeight, setContainerHeight] = useState(0);
	function onLayout(event: any) {
		setContainerHeight(event.nativeEvent.layout.height);
	}

	/**
	 * NOTE: AT proto does not return a detailed view
	 */
	return (
		<>
			{navbarType === 'none' ? <View /> : <View />}
			{navbarType === 'custom' ? NavBar : <View />}
			{navbarType === 'unified' ? (
				<NavBar_Feed animatedStyle={animatedStyle} />
			) : (
				<View />
			)}
			{navbarType === 'simple' ? (
				<NavBar_Simple label={label} animatedStyle={animatedStyle} />
			) : (
				<View />
			)}
			{navbarType === 'updates' ? (
				<NavBar_Inbox
					label={label}
					type={'updates'}
					animatedStyle={animatedStyle}
				/>
			) : (
				<View />
			)}
			{navbarType === 'explore' ? (
				<NavBar_Explore animatedStyle={animatedStyle} />
			) : (
				<View />
			)}
			<FlatList
				onLayout={onLayout}
				data={items}
				renderItem={renderItem}
				onScroll={scrollHandler}
				contentContainerStyle={{
					paddingTop: navbarConfigs[navbarType]?.topLoaderOffset,
					paddingBottom: appDimensions.lists.paddingBottom,
				}}
				scrollEventThrottle={16}
				onRefresh={onRefresh}
				refreshing={IsRefreshing}
				progressViewOffset={52}
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
				removeClippedSubviews={true}
				keyExtractor={(item) => item.id}
				// onLoad={onListLoad}
				key={flatListKey}
				initialNumToRender={POST_FEED_INITIAL_NUM_TO_RENDER}
				windowSize={POST_FEED_WINDOW_SIZE}
				maxToRenderPerBatch={POST_FEED_WINDOW_SIZE}
			/>
			<TimelineLoadingIndicator
				numItems={items.length}
				networkFetchStatus={fetchStatus}
				style={{
					marginBottom: widgetConfigs[navbarType]?.bottomLoaderOffset ?? 0,
				}}
			/>
		</>
	);
}

export default AppTimeline;
