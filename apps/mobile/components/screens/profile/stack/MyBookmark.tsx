import { useEffect } from 'react';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import LoadingMore from '../../home/LoadingMore';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import usePageRefreshIndicatorState from '../../../../states/usePageRefreshIndicatorState';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import useGetBookmarks from '../../../../hooks/api/accounts/useGetBookmarks';
import WithAppTimelineDataContext, {
	useAppTimelinePosts,
} from '../../../../hooks/app/timelines/useAppTimelinePosts';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppFlashList } from '../../../lib/AppFlashList';

function Core() {
	const { driver, acct } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			acct: o.acct,
		})),
	);
	const { updateQueryCache, queryCacheMaxId, setMaxId } =
		useAppPaginationContext();

	const { addPosts, clear, data: timelineData } = useAppTimelinePosts();

	useEffect(() => {
		clear();
	}, [acct?.server, acct?.username]);

	const { data, refetch, fetchStatus } = useGetBookmarks({
		limit: 10,
		maxId: queryCacheMaxId,
	});

	useEffect(() => {
		const statuses = data.data;
		if (statuses.length <= 0) return;

		setMaxId(data.maxId);
		addPosts(statuses);
	}, [data, driver, acct?.server]);

	/**
	 * Composite Hook Collection
	 */
	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
	});
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: timelineData.length,
		updateQueryCache,
	});
	const { onRefresh, refreshing } = usePageRefreshIndicatorState({
		fetchStatus,
		refetch,
	});

	return (
		<WithAutoHideTopNavBar title={'My Bookmarks'} translateY={translateY}>
			<AppFlashList.Post
				data={timelineData}
				paddingTop={50 + 4}
				refreshing={refreshing}
				onRefresh={onRefresh}
				onScroll={onScroll}
			/>
			<LoadingMore visible={visible} loading={loading} />
		</WithAutoHideTopNavBar>
	);
}

function MyBookmark() {
	return (
		<WithAppPaginationContext>
			<WithAppTimelineDataContext>
				<Core />
			</WithAppTimelineDataContext>
		</WithAppPaginationContext>
	);
}

export default MyBookmark;
