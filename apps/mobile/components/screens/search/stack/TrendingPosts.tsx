import { Animated, RefreshControl } from 'react-native';
import { Fragment, useRef, useState } from 'react';
import WithScrollOnRevealContext from '../../../../states/useScrollOnReveal';
import StatusItem from '../../../common/status/StatusItem';
import { TimelineLoadingIndicator } from '../../../../ui/LoadingIndicator';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import useTrendingPosts from '../api/useTrendingPosts';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import FeatureUnsupported from '../../../error-screen/FeatureUnsupported';
import { useAppApiClient } from '../../../../hooks/utility/global-state-extractors';

const SHOWN_SECTION_HEIGHT = 50;
const HIDDEN_SECTION_HEIGHT = 50;

/**
 * Search Module -- Trending Posts
 */
function ApiWrapper() {
	const { driver } = useAppApiClient();
	const { IsLoading, fetchStatus, refetch } = useTrendingPosts();

	const { onScroll, translateY } = useScrollMoreOnPageEnd();

	const ref = useRef(null);
	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = () => {
		setRefreshing(true);
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
					<Animated.FlatList
						data={[]}
						ref={ref}
						renderItem={(o) => <StatusItem key={o.index} />}
						onScroll={onScroll}
						contentContainerStyle={{
							paddingTop: SHOWN_SECTION_HEIGHT + 4,
						}}
						scrollEventThrottle={16}
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
					/>
					<TimelineLoadingIndicator visible={visible} loading={loading} />
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
			<ApiWrapper />
		</WithScrollOnRevealContext>
	);
}

export default TrendingPostsContainer;
