import { RefreshControl } from 'react-native';
import WithScrollOnRevealContext from '../../../../states/useScrollOnReveal';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import WithActivitypubTagContext from '../../../../states/useTag';
import TagItem from '../../../common/tag/TagItem';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import LoadingMore from '../../home/LoadingMore';
import { AnimatedFlashList } from '@shopify/flash-list';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import useTrendingTags from '../api/useTrendingTags';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { Fragment, useState } from 'react';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import FeatureUnsupported from '../../../error-screen/FeatureUnsupported';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';

/**
 * Search Module -- Trending Posts
 */
function ApiWrapper() {
	const { domain } = useActivityPubRestClientContext();
	const { data: PageData, updateQueryCache } = useAppPaginationContext();
	// const [refreshing, setRefreshing] = useState(false);
	// const onRefresh = () => {
	// 	setRefreshing(true);
	// 	clear();
	// 	refetch();
	// };

	const { fetchStatus } = useTrendingTags();

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: PageData.length,
		updateQueryCache,
	});

	const { visible, loading } = useLoadingMoreIndicatorState({ fetchStatus });
	return (
		<WithAutoHideTopNavBar title={'Trending Tags'} translateY={translateY}>
			{domain === KNOWN_SOFTWARE.MASTODON ? (
				<Fragment>
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
						// 	<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						// }
					/>
					<LoadingMore visible={visible} loading={loading} />
				</Fragment>
			) : (
				<FeatureUnsupported />
			)}
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
