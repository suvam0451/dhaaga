import { RefreshControl } from 'react-native';
import { Fragment, useRef, useState } from 'react';
import WithScrollOnRevealContext from '../../../../states/useScrollOnReveal';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import WithActivitypubStatusContext from '../../../../states/useStatus';
import StatusItem from '../../../common/status/StatusItem';
import { AnimatedFlashList } from '@shopify/flash-list';
import LoadingMore from '../../home/LoadingMore';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import useTrendingPosts from '../api/useTrendingPosts';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import FeatureUnsupported from '../../../error-screen/FeatureUnsupported';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const SHOWN_SECTION_HEIGHT = 50;
const HIDDEN_SECTION_HEIGHT = 50;

/**
 * Search Module -- Trending Posts
 */
function ApiWrapper() {
	const { driver } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
		})),
	);
	const { data: PageData, updateQueryCache, clear } = useAppPaginationContext();

	const { IsLoading, fetchStatus, refetch } = useTrendingPosts();

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
		additionalLoadingStates: IsLoading,
	});

	return (
		<WithAutoHideTopNavBar title={'Trending Posts'} translateY={translateY}>
			{driver === KNOWN_SOFTWARE.MASTODON ? (
				<Fragment>
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
						scrollEventThrottle={16}
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
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
