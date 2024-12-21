import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import LoadingMore from '../../home/LoadingMore';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import usePageRefreshIndicatorState from '../../../../states/usePageRefreshIndicatorState';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import useGetLikes from '../../../../hooks/api/accounts/useGetLikes';
import WithAppTimelineDataContext, {
	useAppTimelinePosts,
} from '../../../../hooks/app/timelines/useAppTimelinePosts';
import { useEffect } from 'react';
import ActivityPubService from '../../../../services/activitypub.service';
import FeatureUnsupported from '../../../error-screen/FeatureUnsupported';
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

	const { data, fetchStatus, refetch } = useGetLikes({
		limit: 10,
		maxId: queryCacheMaxId,
	});
	const { addPosts, data: timelineData } = useAppTimelinePosts();

	useEffect(() => {
		if (data.length <= 0) return;

		setMaxId(data[data.length - 1].getId());
		addPosts(data);
	}, [data, driver, acct?.server]);

	const { visible, loading } = useLoadingMoreIndicatorState({ fetchStatus });
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: data.length,
		updateQueryCache,
	});
	const { onRefresh, refreshing } = usePageRefreshIndicatorState({
		fetchStatus,
		refetch,
	});

	if (!ActivityPubService.mastodonLike(driver)) {
		return (
			<WithAutoHideTopNavBar title={'My Liked Posts'} translateY={translateY}>
				<FeatureUnsupported />;
			</WithAutoHideTopNavBar>
		);
	}

	return (
		<WithAutoHideTopNavBar title={'My Liked Posts'} translateY={translateY}>
			<AppFlashList.Post
				onScroll={onScroll}
				data={timelineData}
				paddingTop={50 + 4}
				refreshing={refreshing}
				onRefresh={onRefresh}
			/>
			<LoadingMore visible={visible} loading={loading} />
		</WithAutoHideTopNavBar>
	);
}

function MyLikes() {
	return (
		<WithAppPaginationContext>
			<WithAppTimelineDataContext>
				<Core />
			</WithAppTimelineDataContext>
		</WithAppPaginationContext>
	);
}

export default MyLikes;
