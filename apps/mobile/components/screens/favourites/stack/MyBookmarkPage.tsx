import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useEffect } from 'react';
import StatusItem from '../../../common/status/StatusItem';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import LoadingMore from '../../home/LoadingMore';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import { AnimatedFlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';
import { useRealm } from '@realm/react';
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import usePageRefreshIndicatorState from '../../../../states/usePageRefreshIndicatorState';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import useGetBookmarks from '../../../../hooks/api/accounts/useGetBookmarks';
import WithAppStatusItemContext from '../../../../hooks/ap-proto/useAppStatusItem';
import WithAppTimelineDataContext, {
	useAppTimelineDataContext,
} from '../../../common/timeline/api/useTimelineData';
import { ActivitypubStatusService } from '../../../../services/ap-proto/activitypub-status.service';

function Core() {
	const { primaryAcct, subdomain } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;
	const { updateQueryCache, queryCacheMaxId, setMaxId } =
		useAppPaginationContext();
	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();

	const { addPosts, listItems, clear } = useAppTimelineDataContext();

	useEffect(() => {
		clear();
	}, [primaryAcct.subdomain, primaryAcct.username]);

	const { data, refetch, fetchStatus } = useGetBookmarks({
		limit: 10,
		maxId: queryCacheMaxId,
	});

	useEffect(() => {
		const statuses = data.data;
		if (statuses.length <= 0) return;

		setMaxId(data.maxId);
		addPosts(statuses);
		for (const status of statuses) {
			ActivitypubStatusService.factory(status, domain, subdomain)
				.resolveInstances()
				.syncSoftware(db)
				.then((res) => {
					res.syncCustomEmojis(db, globalDb).then(() => {});
				});
		}
	}, [data, db, globalDb, domain, subdomain]);

	/**
	 * Composite Hook Collection
	 */
	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
	});
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: listItems.length,
		updateQueryCache,
	});
	const { onRefresh, refreshing } = usePageRefreshIndicatorState({
		fetchStatus,
		refetch,
	});

	return (
		<WithAutoHideTopNavBar title={'My Bookmarks'} translateY={translateY}>
			<AnimatedFlashList
				estimatedItemSize={100}
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

function MyBookmarkPage() {
	return (
		<WithAppPaginationContext>
			<WithAppTimelineDataContext>
				<Core />
			</WithAppTimelineDataContext>
		</WithAppPaginationContext>
	);
}

export default MyBookmarkPage;
