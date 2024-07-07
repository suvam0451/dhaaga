import { View } from 'react-native';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import WithScrollOnRevealContext, {
	useScrollOnReveal,
} from '../../../../states/useScrollOnReveal';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import { TagType } from '@dhaaga/shared-abstraction-activitypub';
import WithActivitypubTagContext from '../../../../states/useTag';
import TagItem from '../../../common/tag/TagItem';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useTopbarSmoothTranslate from '../../../../states/useTopbarSmoothTranslate';
import NavigationService from '../../../../services/navigation.service';
import LoadingMore from '../../home/LoadingMore';
import { AnimatedFlashList } from '@shopify/flash-list';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';

function Content() {
	const { data: PageData } = useAppPaginationContext();

	if (!PageData) return <View></View>;
	return (
		<View style={{ display: 'flex', backgroundColor: '#121212' }}>
			{PageData.map((o: TagType, i) => (
				<WithActivitypubTagContext tag={o} key={i}>
					<TagItem />
				</WithActivitypubTagContext>
			))}
		</View>
	);
}

/**
 * Search Module -- Trending Posts
 */
function ApiWrapper() {
	const { client } = useActivityPubRestClientContext();
	const {
		data: PageData,
		queryCacheMaxId,
		updateQueryCache,
		append,
		setMaxId,
	} = useAppPaginationContext();
	const { resetEndOfPageFlag } = useScrollOnReveal();

	const api = () =>
		client
			? client.getTrendingTags({
					limit: 20,
					offset: parseInt(queryCacheMaxId),
				})
			: null;

	// Queries
	const { status, data, error, fetchStatus, refetch } = useQuery({
		queryKey: ['trending/tags', queryCacheMaxId],
		queryFn: api,
		enabled: client !== null,
	});

	function onScrollEndReach() {
		if (PageData.length > 0) {
			updateQueryCache();
			refetch();
		}
	}

	useEffect(() => {
		if (status !== 'success' || !data) return;
		if (data.length > 0) {
			append(data, (o) => o.name);
			setMaxId((PageData.length + data.length).toString());
			resetEndOfPageFlag();
		}
	}, [fetchStatus]);

	const [IsNextPageLoading, setIsNextPageLoading] = useState(false);
	const [LoadingMoreComponentProps, setLoadingMoreComponentProps] = useState({
		visible: false,
		loading: false,
	});
	/**
	 * Loads next set, when scroll end is reached
	 */
	const onPageEndReached = () => {
		if (PageData.length === 0 || IsNextPageLoading) return;

		setIsNextPageLoading(true);
		updateQueryCache();
		setLoadingMoreComponentProps({
			visible: true,
			loading: true,
		});
	};
	const handleScrollJs = (e: any) => {
		NavigationService.invokeWhenPageEndReached(e, onPageEndReached);
	};
	const { onScroll, translateY } = useTopbarSmoothTranslate({
		onScrollJsFn: handleScrollJs,
		totalHeight: 100,
		hiddenHeight: 50,
	});

	const { visible, loading } = useLoadingMoreIndicatorState({ fetchStatus });
	return (
		<WithAutoHideTopNavBar title={'Trending Tags'} translateY={translateY}>
			<AnimatedFlashList
				estimatedItemSize={72}
				data={PageData}
				renderItem={(o) => (
					<WithActivitypubTagContext tag={o.item} key={o.index}>
						<TagItem />
					</WithActivitypubTagContext>
				)}
				onScroll={onScroll}
				contentContainerStyle={{
					paddingTop: 50 + 4,
				}}
				scrollEventThrottle={16}
				// refreshControl={
				//   <RefreshControl
				//       refreshing={refreshing}
				//       onRefresh={onRefresh}/>
				// }
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
