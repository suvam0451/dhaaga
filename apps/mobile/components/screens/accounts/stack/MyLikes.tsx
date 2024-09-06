import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import LoadingMore from '../../home/LoadingMore';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import { AnimatedFlashList } from '@shopify/flash-list';
import usePageRefreshIndicatorState from '../../../../states/usePageRefreshIndicatorState';
import { RefreshControl } from 'react-native';
import StatusItem from '../../../common/status/StatusItem';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import useGetLikes from '../../../../hooks/api/accounts/useGetLikes';
import WithAppTimelineDataContext, {
	useAppTimelineDataContext,
} from '../../../common/timeline/api/useTimelineData';
import WithAppStatusItemContext from '../../../../hooks/ap-proto/useAppStatusItem';
import { useEffect } from 'react';
import { ActivitypubStatusService } from '../../../../services/ap-proto/activitypub-status.service';
import { useRealm } from '@realm/react';
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import ActivityPubService from '../../../../services/activitypub.service';
import FeatureUnsupported from '../../../error-screen/FeatureUnsupported';

function Core() {
	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();
	const { domain, subdomain } = useActivityPubRestClientContext();
	const { updateQueryCache, queryCacheMaxId, setMaxId } =
		useAppPaginationContext();

	const { data, fetchStatus, refetch } = useGetLikes({
		limit: 10,
		maxId: queryCacheMaxId,
	});
	const { addPosts, listItems, clear } = useAppTimelineDataContext();

	useEffect(() => {
		if (data.length <= 0) return;

		setMaxId(data[data.length - 1].getId());
		addPosts(data);
		for (const status of data) {
			ActivitypubStatusService.factory(status, domain, subdomain)
				.resolveInstances()
				.syncSoftware(db)
				.then((res) => {
					res.syncCustomEmojis(db, globalDb).then(() => {});
				});
		}
	}, [data, db, globalDb, domain, subdomain]);

	const { visible, loading } = useLoadingMoreIndicatorState({ fetchStatus });
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: data.length,
		updateQueryCache,
	});
	const { onRefresh, refreshing } = usePageRefreshIndicatorState({
		fetchStatus,
		refetch,
	});

	if (!ActivityPubService.mastodonLike(domain)) {
		return (
			<WithAutoHideTopNavBar title={'My Liked Posts'} translateY={translateY}>
				<FeatureUnsupported />;
			</WithAutoHideTopNavBar>
		);
	}

	return (
		<WithAutoHideTopNavBar title={'My Liked Posts'} translateY={translateY}>
			<AnimatedFlashList
				estimatedItemSize={72}
				data={listItems}
				renderItem={({ item }) => (
					<WithAppStatusItemContext dto={item.props.dto}>
						<StatusItem />
					</WithAppStatusItemContext>
				)}
				onScroll={onScroll}
				contentContainerStyle={{
					paddingTop: 50 + 4,
				}}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
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
