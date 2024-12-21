import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import WithAppTimelineDataContext, {
	useAppTimelinePosts,
} from '../../../../hooks/app/timelines/useAppTimelinePosts';
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
import LoadingMore from '../../home/LoadingMore';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import WithTimelineControllerContext, {
	useTimelineController,
} from '../../../common/timeline/api/useTimelineController';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../states/_global';
import { AppFlashList } from '../../../lib/AppFlashList';

function Core() {
	const { driver, me } = useGlobalState(
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
	const { addPosts, data: timelineData, clear } = useAppTimelinePosts();

	const { timelineType, query, opts, setTimelineType, setQuery } =
		useTimelineController();

	useEffect(() => {
		setPageLoadedAtLeastOnce(false);
		paginationClear();
		clear();
	}, [timelineType, query, opts]);

	useEffect(() => {
		setTimelineType(TimelineFetchMode.USER);
		setQuery({ id: me.id, label: 'My Posts' });
	}, [me.id]);

	const { fetchStatus, data, status } = useTimeline({
		type: TimelineFetchMode.USER,
		query,
		opts,
		maxId: queryCacheMaxId,
	});

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: timelineData.length,
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
		}
	}, [fetchStatus]);

	if (!me.id) {
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
			<AppFlashList.Post
				data={timelineData}
				onScroll={onScroll}
				paddingTop={50}
				refreshing={loading}
				onRefresh={() => {}}
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
