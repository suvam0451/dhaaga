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
import { router } from 'expo-router';

/*
 * Render a Timeline
 */
const Timeline = memo(() => {
	const { maxId } = usePagination();
	const { setNextMaxId, clear, next } = usePaginationActions();

	const { query, opts } = useTimelineController();
	const { homepageType, client, driver } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			homepageType: o.homepageType,
			client: o.router,
			driver: o.driver,
		})),
	);

	const {
		addPosts: appendTimelineData,
		clear: timelineDataStoreClear,
		data: timelineData,
	} = useAppTimelinePosts();

	useEffect(() => {
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
			return;
		}

		if (data?.length > 0) {
			setNextMaxId(data[data.length - 1]?.id);
			const _data = ActivityPubAdapterService.adaptManyStatuses(data, driver);
			appendTimelineData(_data);
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

	if (client === null) return <Introduction />;
	if (homepageType === TimelineFetchMode.IDLE) {
		router.navigate('/');
		return <View />;
	}

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
