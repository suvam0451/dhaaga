import { useEffect } from 'react';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import { StatusArray } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/status/_interface';
import WithScrollOnRevealContext from '../../../../states/useScrollOnReveal';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import LoadingMore from '../../home/LoadingMore';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import { AnimatedFlashList } from '@shopify/flash-list';
import WithActivitypubStatusContext from '../../../../states/useStatus';
import usePageRefreshIndicatorState from '../../../../states/usePageRefreshIndicatorState';
import { RefreshControl } from 'react-native';
import StatusItem from '../../../common/status/StatusItem';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';

function ApiWrapper() {
	const { client } = useActivityPubRestClientContext();
	const {
		data: PageData,
		updateQueryCache,
		queryCacheMaxId,
		append,
		setMaxId,
	} = useAppPaginationContext();

	async function api() {
		if (!client) throw new Error('_client not initialized');
		return await client.getFavourites({
			limit: 5,
			maxId: queryCacheMaxId,
		});
	}

	// Queries
	const { data, status, fetchStatus, refetch } = useQuery<StatusArray>({
		queryKey: ['favourites', queryCacheMaxId],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		if (data.length > 0) {
			append(data, (o) => o.name);
			setMaxId((PageData.length + data.length).toString());
		}
	}, [fetchStatus]);

	useEffect(() => {
		if (status !== 'success' || !data) return;
		if (data.length > 0) {
			append(data);
			setMaxId(data[data.length - 1].id);
		}
	}, [fetchStatus]);

	const { visible, loading } = useLoadingMoreIndicatorState({ fetchStatus });
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: PageData.length,
		updateQueryCache,
	});
	const { onRefresh, refreshing } = usePageRefreshIndicatorState({
		fetchStatus,
		refetch,
	});

	return (
		<WithAutoHideTopNavBar title={'My Favourites'} translateY={translateY}>
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

function Wrapper() {
	return (
		<WithScrollOnRevealContext maxDisplacement={150}>
			<WithAppPaginationContext>
				<ApiWrapper />
			</WithAppPaginationContext>
		</WithScrollOnRevealContext>
	);
}

function FavouritesStackScreen() {
	return <Wrapper />;
}

export default FavouritesStackScreen;
