import { memo, useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import TimelinesHeader from '../../../shared/topnavbar/fragments/TopNavbarTimelineStack';
import WithAppPaginationContext from '../../../../states/usePagination';
import LoadingMore from '../../../screens/home/LoadingMore';
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
import { TimelineFetchMode } from '../utils/timeline.types';
import WithAppTimelineDataContext, {
	useAppTimelinePosts,
} from '../../../../hooks/app/timelines/useAppTimelinePosts';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { AppBskyFeedGetTimeline } from '@atproto/api';
import {
	AppPaginationContext,
	usePagination,
	usePaginationActions,
} from '../../../../states/local/pagination';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppFlashList } from '../../../../components/lib/AppFlashList';

/*
 * Render a Timeline
 */
const Timeline = memo(() => {
	const { maxId } = usePagination();
	const { setNextMaxId, clear, next } = usePaginationActions();

	const { query, opts } = useTimelineController();
	const { homepageType, router, driver } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			homepageType: o.homepageType,
			router: o.router,
			driver: o.driver,
		})),
	);

	const {
		addPosts: appendTimelineData,
		clear: timelineDataStoreClear,
		data: timelineData,
	} = useAppTimelinePosts();

	// const [PageLoadedAtLeastOnce, setPageLoadedAtLeastOnce] = useState(false);

	useEffect(() => {
		// setPageLoadedAtLeastOnce(false);
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
			// setPageLoadedAtLeastOnce(true);
			return;
		}

		if (data?.length > 0) {
			setNextMaxId(data[data.length - 1]?.id);
			const _data = ActivityPubAdapterService.adaptManyStatuses(data, driver);
			appendTimelineData(_data);
			// setPageLoadedAtLeastOnce(true);
		}
	}, [fetchStatus]);

	const label = useTimelineLabel();
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

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
					backgroundColor: theme.palette.bg,
				},
			]}
		>
			<Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
				<TimelinesHeader title={label} />
			</Animated.View>
			<AppFlashList.Post
				data={timelineData}
				onScroll={onScroll}
				refreshing={refreshing}
				onRefresh={onRefresh}
				paddingTop={50}
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
