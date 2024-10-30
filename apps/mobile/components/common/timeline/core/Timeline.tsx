import { memo, useEffect, useState } from 'react';
import { Animated, RefreshControl, StyleSheet, View } from 'react-native';
import TimelinesHeader from '../../../shared/topnavbar/fragments/TopNavbarTimelineStack';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
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
import FlashListRenderer from '../fragments/FlashListRenderer';
import ListHeaderComponent from '../fragments/FlashListHeader';
import { TimelineFetchMode } from '../utils/timeline.types';
import { useRealm } from '@realm/react';
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';
import WithAppTimelineDataContext, {
	useAppTimelinePosts,
} from '../../../../hooks/app/timelines/useAppTimelinePosts';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { AppBskyFeedGetTimeline } from '@atproto/api';
import { ActivitypubStatusService } from '../../../../services/approto/activitypub-status.service';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';
import {
	AppPaginationContext,
	usePagination,
	usePaginationActions,
} from '../../../../states/local/pagination';

/*
 * Render a Timeline
 */
const Timeline = memo(() => {
	const { maxId } = usePagination();
	const { setNextMaxId, clear, next } = usePaginationActions();

	const { timelineType, query, opts, setTimelineType } =
		useTimelineController();
	const { client, primaryAcct, domain, subdomain } =
		useActivityPubRestClientContext();
	const {
		addPosts: appendTimelineData,
		listItems,
		clear: timelineDataStoreClear,
	} = useAppTimelinePosts();
	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();

	const [PageLoadedAtLeastOnce, setPageLoadedAtLeastOnce] = useState(false);

	// reset to home
	useEffect(() => {
		setTimelineType(TimelineFetchMode.IDLE);
	}, [primaryAcct]);

	useEffect(() => {
		setPageLoadedAtLeastOnce(false);
		clear();
		timelineDataStoreClear();
	}, [timelineType, query, opts]);

	console.log(maxId);
	const { fetchStatus, data, status, refetch } = useTimeline({
		type: timelineType,
		query,
		opts,
		maxId,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;

		if (domain === KNOWN_SOFTWARE.BLUESKY) {
			const _payload = data as unknown as AppBskyFeedGetTimeline.Response;
			const cursor = _payload.data.cursor;
			const posts = _payload.data.feed;

			setNextMaxId(cursor);
			const _data = ActivityPubAdapterService.adaptManyStatuses(posts, domain);
			appendTimelineData(_data);
			setPageLoadedAtLeastOnce(true);
			return;
		}

		if (data?.length > 0) {
			setNextMaxId(data[data.length - 1]?.id);
			const _data = ActivityPubAdapterService.adaptManyStatuses(data, domain);
			appendTimelineData(_data);
			setPageLoadedAtLeastOnce(true);

			/**
			 * Resolve Software + Custom Emojis
			 */
			for (const datum of _data) {
				ActivitypubStatusService.factory(datum, domain, subdomain)
					.resolveInstances()
					.syncSoftware(db)
					.then((res) => {
						res.syncCustomEmojis(db, globalDb).then(() => {});
					});
			}
		}
	}, [fetchStatus, db]);

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

	if (!client) return <Introduction />;

	if (timelineType === TimelineFetchMode.IDLE) return <SocialHub />;

	return (
		<View
			style={[
				styles.container,
				{ position: 'relative', backgroundColor: colorScheme.palette.bg },
			]}
		>
			{/*<StatusBar backgroundColor={APP_THEME.DARK_THEME_MENUBAR} />*/}
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
				renderItem={FlashListRenderer}
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
