import { memo, useEffect, useState } from 'react';
import { Animated, RefreshControl, StyleSheet, View } from 'react-native';
import TimelinesHeader from '../../../shared/topnavbar/fragments/TopNavbarTimelineStack';
import WithAppPaginationContext from '../../../../states/usePagination';
import LoadingMore from '../../../screens/home/LoadingMore';
import { AnimatedFlashList } from '@shopify/flash-list';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import Introduction from '../../../tutorials/screens/home/new-user/Introduction';
import WithTimelineControllerContext, {
	useTimelineController,
} from '../api/useTimelineController';
import SocialHub from '../fragments/SocialHub';
import usePageRefreshIndicatorState from '../../../../states/usePageRefreshIndicatorState';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import useTimeline from '../api/useTimeline';
import useTimelineLabel from '../api/useTimelineLabel';
import FlashListPostRenderer from '../fragments/FlashListPostRenderer';
import ListHeaderComponent from '../fragments/FlashListHeader';
import { TimelineFetchMode } from '../utils/timeline.types';
import WithAppTimelineDataContext, {
	useAppTimelinePosts,
} from '../../../../hooks/app/timelines/useAppTimelinePosts';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { AppBskyFeedGetTimeline } from '@atproto/api';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';
import {
	AppPaginationContext,
	usePagination,
	usePaginationActions,
} from '../../../../states/local/pagination';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

/*
 * Render a Timeline
 */
const Timeline = memo(() => {
	const { maxId } = usePagination();
	const { setNextMaxId, clear, next } = usePaginationActions();

	const { query, opts, setTimelineType } = useTimelineController();
	const { acct, homepageType, router, driver } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			homepageType: o.homepageType,
			router: o.router,
			driver: o.driver,
		})),
	);

	const {
		addPosts: appendTimelineData,
		listItems,
		clear: timelineDataStoreClear,
	} = useAppTimelinePosts();

	const [PageLoadedAtLeastOnce, setPageLoadedAtLeastOnce] = useState(false);

	// reset to home
	useEffect(() => {
		setTimelineType(TimelineFetchMode.IDLE);
	}, [acct]);

	useEffect(() => {
		setPageLoadedAtLeastOnce(false);
		clear();
		timelineDataStoreClear();
	}, [homepageType, query, opts]);

	const { fetchStatus, data, status, refetch } = useTimeline({
		type: homepageType,
		query,
		opts,
		maxId,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;

		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			const _payload = data as unknown as AppBskyFeedGetTimeline.Response;
			const cursor = _payload.data.cursor;
			const posts = _payload.data.feed;

			setNextMaxId(cursor);
			const _data = ActivityPubAdapterService.adaptManyStatuses(posts, driver);
			appendTimelineData(_data);
			setPageLoadedAtLeastOnce(true);
			return;
		}

		if (data?.length > 0) {
			setNextMaxId(data[data.length - 1]?.id);
			const _data = ActivityPubAdapterService.adaptManyStatuses(data, driver);
			appendTimelineData(_data);
			setPageLoadedAtLeastOnce(true);

			/**
			 * Resolve Software + Custom Emojis
			 */
			for (const datum of _data) {
				// ActivitypubStatusService.factory(datum, domain, subdomain)
				// 	.resolveInstances()
				// 	.syncSoftware(db)
				// 	.then((res) => {
				// 		res.syncCustomEmojis(db, globalDb).then(() => {});
				// 	});
			}
		}
	}, [fetchStatus]);

	const label = useTimelineLabel();
	const { colorScheme } = useAppTheme();

	/**
	 * Composite Hook Collection
	 */
	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
	});
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: appendTimelineData.length,
		updateQueryCache: next,
	});
	const { onRefresh, refreshing } = usePageRefreshIndicatorState({
		fetchStatus,
		refetch,
	});

	if (router === null) return <Introduction />;
	if (homepageType === TimelineFetchMode.IDLE) return <SocialHub />;

	return (
		<View
			style={[
				styles.container,
				{
					position: 'relative',
					backgroundColor: colorScheme.palette.bg,
				},
			]}
		>
			<Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
				<TimelinesHeader title={label} />
			</Animated.View>
			<AnimatedFlashList
				ListHeaderComponent={
					<ListHeaderComponent
						itemCount={listItems.length}
						loadedOnce={PageLoadedAtLeastOnce}
					/>
				}
				estimatedItemSize={200}
				data={listItems}
				renderItem={FlashListPostRenderer}
				getItemType={(o) => o.type}
				onScroll={onScroll}
				contentContainerStyle={{
					paddingTop: 54,
				}}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
			<LoadingMore visible={visible} loading={loading} />
		</View>
	);
});

function TimelineWrapper() {
	return (
		<WithTimelineControllerContext>
			<AppPaginationContext>
				<WithAppPaginationContext>
					<WithAppTimelineDataContext>
						<Timeline />
					</WithAppTimelineDataContext>
				</WithAppPaginationContext>
			</AppPaginationContext>
		</WithTimelineControllerContext>
	);
}

export default TimelineWrapper;

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
	container: {
		flex: 1,
	},
});
