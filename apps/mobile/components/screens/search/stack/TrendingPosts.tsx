import { RefreshControl } from 'react-native';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import WithScrollOnRevealContext from '../../../../states/useScrollOnReveal';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import WithActivitypubStatusContext from '../../../../states/useStatus';
import StatusItem from '../../../common/status/StatusItem';
import { AnimatedFlashList } from '@shopify/flash-list';
import LoadingMore from '../../home/LoadingMore';
import { EmojiService } from '../../../../services/emoji.service';
import { useRealm } from '@realm/react';
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';

const SHOWN_SECTION_HEIGHT = 50;
const HIDDEN_SECTION_HEIGHT = 50;

/**
 * Search Module -- Trending Posts
 */
function ApiWrapper() {
	const { client } = useActivityPubRestClientContext();
	const {
		data: PageData,
		setMaxId,
		append,
		queryCacheMaxId,
		updateQueryCache,
		clear,
		maxId,
	} = useAppPaginationContext();
	const { primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;
	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();
	const [EmojisLoading, setEmojisLoading] = useState(false);
	const PageLoadedAtLeastOnce = useRef(false);

	async function api() {
		if (!client) return null;
		const { data, error } = await client.trends.posts({
			limit: 5,
			offset: parseInt(queryCacheMaxId),
		});
		if (error) {
			return [];
		}
		return data;
	}

	// Queries
	const { status, data, fetchStatus, refetch } = useQuery({
		queryKey: [queryCacheMaxId],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;

		if (data?.length > 0) {
			setMaxId((PageData.length + data.length).toString());
			setEmojisLoading(true);
			EmojiService.preloadInstanceEmojisForStatuses(db, globalDb, data, domain)
				.then((res) => {})
				.finally(() => {
					append(data);
					setEmojisLoading(false);
					PageLoadedAtLeastOnce.current = true;
				});
		}
	}, [fetchStatus]);

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: PageData.length,
		updateQueryCache,
	});

	const ref = useRef(null);
	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = () => {
		setRefreshing(true);
		clear();
		refetch();
	};

	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
		additionalLoadingStates: EmojisLoading,
	});
	return (
		<WithAutoHideTopNavBar title={'Trending Posts'} translateY={translateY}>
			<AnimatedFlashList
				estimatedItemSize={200}
				data={PageData}
				ref={ref}
				renderItem={(o) => (
					<WithActivitypubStatusContext status={o.item} key={o.index}>
						<StatusItem key={o.index} />
					</WithActivitypubStatusContext>
				)}
				onScroll={onScroll}
				contentContainerStyle={{
					paddingTop: SHOWN_SECTION_HEIGHT + 4,
				}}
				scrollEventThrottle={100}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
			<LoadingMore visible={visible} loading={loading} />
		</WithAutoHideTopNavBar>
	);
}

function TrendingPostsContainer() {
	return (
		<WithScrollOnRevealContext maxDisplacement={150}>
			<WithAppPaginationContext>
				<ApiWrapper />
			</WithAppPaginationContext>
		</WithScrollOnRevealContext>
	);
}

export default TrendingPostsContainer;
