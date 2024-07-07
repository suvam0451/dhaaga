import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import StatusItem from '../status/StatusItem';
import { Skeleton } from '@rneui/base';
import { ActivityPubStatuses } from '@dhaaga/shared-abstraction-activitypub';
import WithActivitypubStatusContext from '../../../states/useStatus';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { useNavigation, useRoute } from '@react-navigation/native';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../states/usePagination';
import WithScrollOnRevealContext, {
	useScrollOnReveal,
} from '../../../states/useScrollOnReveal';
import { RefreshControl, View } from 'react-native';
import LoadingMore from '../../screens/home/LoadingMore';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../containers/WithAutoHideTopNavBar';
import useLoadingMoreIndicatorState from '../../../states/useLoadingMoreIndicatorState';
import usePageRefreshIndicatorState from '../../../states/usePageRefreshIndicatorState';
import { AnimatedFlashList } from '@shopify/flash-list';

function Content() {
	const { data: PageData } = useAppPaginationContext();
	if (!PageData) return <View></View>;

	return (
		<>
			{PageData.map((o, i) => (
				<WithActivitypubStatusContext status={o} key={i}>
					<StatusItem key={i} />
				</WithActivitypubStatusContext>
			))}
		</>
	);
}

function ApiWrapper() {
	const navigation = useNavigation();
	const route = useRoute<any>();
	const q = route?.params?.q;
	const { client } = useActivityPubRestClientContext();
	const {
		data: PageData,
		queryCacheMaxId,
		updateQueryCache,
		append,
		setMaxId,
	} = useAppPaginationContext();
	const { resetEndOfPageFlag } = useScrollOnReveal();

	function api() {
		if (!client) throw new Error('_client not initialized');
		return client.getTimelineByHashtag(q, { maxId: queryCacheMaxId, limit: 5 });
	}

	// Queries
	const { status, data, error, fetchStatus, refetch } =
		useQuery<ActivityPubStatuses>({
			queryKey: ['local/tag', q],
			queryFn: api,
			enabled: client && q !== undefined,
		});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		if (data.length > 0) {
			append(data);
			setMaxId(data[data.length - 1]?.id);
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
		<WithAutoHideTopNavBar title={`#${q}`} translateY={translateY}>
			<AnimatedFlashList
				estimatedItemSize={72}
				data={PageData}
				renderItem={(o) => (
					<WithActivitypubStatusContext status={o.item} key={o.index}>
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

function TagBrowseLocal() {
	return (
		<WithScrollOnRevealContext maxDisplacement={150}>
			<WithAppPaginationContext>
				<ApiWrapper />
			</WithAppPaginationContext>
		</WithScrollOnRevealContext>
	);
}

export default TagBrowseLocal;
