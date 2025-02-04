import WithScrollOnRevealContext from '../../../../states/useScrollOnReveal';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import WithActivitypubTagContext from '../../../../states/useTag';
import TagItem from '../../../common/tag/TagItem';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import LoadingMore from '../../home/LoadingMore';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import useTrendingTags from '../api/useTrendingTags';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { Fragment } from 'react';
import FeatureUnsupported from '../../../error-screen/FeatureUnsupported';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { useAppApiClient } from '../../../../hooks/utility/global-state-extractors';
import { Animated } from 'react-native';

/**
 * Search Module -- Trending Posts
 */
function ApiWrapper() {
	const { driver } = useAppApiClient();

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
			{driver === KNOWN_SOFTWARE.MASTODON ? (
				<Fragment>
					<Animated.FlatList
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
