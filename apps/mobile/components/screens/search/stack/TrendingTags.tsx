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
import { Fragment } from 'react';
import FeatureUnsupported from '../../../error-screen/FeatureUnsupported';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

/**
 * Search Module -- Trending Posts
 */
function ApiWrapper() {
	const { driver } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
		})),
	);

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
