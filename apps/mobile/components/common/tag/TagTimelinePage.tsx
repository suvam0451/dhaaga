import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import StatusItem from '../status/StatusItem';
import { Skeleton } from '@rneui/base';
import { StatusInterface } from '@dhaaga/shared-abstraction-activitypub';
import WithActivitypubStatusContext from '../../../states/useStatus';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../states/usePagination';
import WithScrollOnRevealContext, {
	useScrollOnReveal,
} from '../../../states/useScrollOnReveal';
import { RefreshControl } from 'react-native';
import LoadingMore from '../../screens/home/LoadingMore';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../containers/WithAutoHideTopNavBar';
import useLoadingMoreIndicatorState from '../../../states/useLoadingMoreIndicatorState';
import usePageRefreshIndicatorState from '../../../states/usePageRefreshIndicatorState';
import { AnimatedFlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import ActivityPubAdapterService from '../../../services/activitypub-adapter.service';

function ApiWrapper() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { client, domain } = useActivityPubRestClientContext();
	const {
		data: PageData,
		queryCacheMaxId,
		updateQueryCache,
		append,
		setMaxId,
	} = useAppPaginationContext();
	const { resetEndOfPageFlag } = useScrollOnReveal();

	async function api() {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.timelines.hashtag(id, {
			maxId: queryCacheMaxId,
			limit: 5,
		});
		if (error) return [];
		return ActivityPubAdapterService.adaptManyStatuses(data, domain);
	}

	// Queries
	const { status, data, fetchStatus, refetch } = useQuery<StatusInterface[]>({
		queryKey: ['tag-timeline', id],
		queryFn: api,
		enabled: client && id !== undefined,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		if (data.length > 0) {
			append(data);
			setMaxId(data[data.length - 1]?.getId());
			resetEndOfPageFlag();
		}
	}, [status, fetchStatus]);

	const { visible, loading } = useLoadingMoreIndicatorState({ fetchStatus });
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: PageData.length,
		updateQueryCache,
	});
	const { onRefresh, refreshing } = usePageRefreshIndicatorState({
		fetchStatus,
		refetch,
	});

	if (!data) return <Skeleton />;
	return (
		<WithAutoHideTopNavBar title={`#${id}`} translateY={translateY}>
			<AnimatedFlashList
				estimatedItemSize={72}
				data={PageData}
				renderItem={(o) => (
					<WithActivitypubStatusContext statusInterface={o.item}>
						<StatusItem />
					</WithActivitypubStatusContext>
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

function TagTimelinePage() {
	return (
		<WithScrollOnRevealContext maxDisplacement={150}>
			<WithAppPaginationContext>
				<ApiWrapper />
			</WithAppPaginationContext>
		</WithScrollOnRevealContext>
	);
}

export default TagTimelinePage;
