import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import WithAppTimelineDataContext, {
	useAppTimelinePosts,
} from '../../../../hooks/app/timelines/useAppTimelinePosts';
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { View } from 'react-native';
import useTimeline from '../../../common/timeline/api/useTimeline';
import { TimelineFetchMode } from '../../../common/timeline/utils/timeline.types';
import { useEffect, useState } from 'react';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../shared/topnavbar/AppTopNavbar';
import FlashListPosts from '../../../shared/flash-lists/FlashListPosts';
import LoadingMore from '../../home/LoadingMore';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import ListHeaderComponent from '../../../common/timeline/fragments/FlashListHeader';
import WithTimelineControllerContext, {
	useTimelineController,
} from '../../../common/timeline/api/useTimelineController';
import { ActivitypubStatusService } from '../../../../services/approto/activitypub-status.service';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../states/_global';

function Core() {
	// const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();
	const { driver, acct, me } = useGlobalState(
		useShallow((o) => ({
			me: o.me,
			driver: o.driver,
			acct: o.acct,
		})),
	);
	const {
		updateQueryCache,
		queryCacheMaxId,
		setMaxId,
		clear: paginationClear,
	} = useAppPaginationContext();
	const { addPosts, listItems, clear } = useAppTimelinePosts();

	const { timelineType, query, opts, setTimelineType, setQuery } =
		useTimelineController();

	useEffect(() => {
		setPageLoadedAtLeastOnce(false);
		paginationClear();
		clear();
	}, [timelineType, query, opts]);

	const MY_ID = me?.getId();
	useEffect(() => {
		setTimelineType(TimelineFetchMode.USER);
		setQuery({ id: MY_ID, label: 'My Posts' });
	}, [MY_ID]);

	const { fetchStatus, data, status } = useTimeline({
		type: TimelineFetchMode.USER,
		query,
		opts,
		maxId: queryCacheMaxId,
	});

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: listItems.length,
		updateQueryCache,
	});

	const [PageLoadedAtLeastOnce, setPageLoadedAtLeastOnce] = useState(false);

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;

		if (data?.length > 0) {
			setMaxId(data[data.length - 1]?.id);
			const _data = ActivityPubAdapterService.adaptManyStatuses(data, driver);
			addPosts(_data);
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

	if (!MY_ID) {
		return (
			<WithAutoHideTopNavBar title={'My Posts'} translateY={translateY}>
				<View />
			</WithAutoHideTopNavBar>
		);
	}
	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
	});

	return (
		<AppTopNavbar
			title={'My Posts'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<FlashListPosts
				ListHeaderComponent={
					<ListHeaderComponent
						itemCount={listItems.length}
						loadedOnce={PageLoadedAtLeastOnce}
					/>
				}
				onScroll={onScroll}
				data={listItems}
			/>
			<LoadingMore visible={visible} loading={loading} />
		</AppTopNavbar>
	);
}

function MyPosts() {
	return (
		<WithTimelineControllerContext>
			<WithAppPaginationContext>
				<WithAppTimelineDataContext>
					<Core />
				</WithAppTimelineDataContext>
			</WithAppPaginationContext>
		</WithTimelineControllerContext>
	);
}

export default MyPosts;
