import { AppPostObject } from '../../../types/app-post.types';
import LoadingMore from '../../../components/screens/home/LoadingMore';
import { Fragment } from 'react';
import { FetchStatus } from '@tanstack/react-query';
import useLoadingMoreIndicatorState from '../../../states/useLoadingMoreIndicatorState';
import { Animated, RefreshControl } from 'react-native';
import StatusItem from '../../../components/common/status/StatusItem';
import WithAppStatusItemContext from '../../../hooks/ap-proto/useAppStatusItem';
import { appDimensions } from '../../../styles/dimensions';

type PostTimelineProps = {
	data: AppPostObject[];
	refreshing: boolean;
	onRefresh: () => void;
	onScroll: (...args: any[]) => void;
	fetchStatus: FetchStatus;
};

/**
 * This DataView needs to be wrapped
 * with WithPostTimelineCtx
 * @constructor
 */
export function PostTimelinePresenter({
	data,
	refreshing,
	fetchStatus,
	onRefresh,
	onScroll,
}: PostTimelineProps) {
	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
	});

	return (
		<Fragment>
			<Animated.FlatList
				data={data}
				renderItem={({ item }) => (
					<WithAppStatusItemContext dto={item}>
						<StatusItem />
					</WithAppStatusItemContext>
				)}
				onScroll={onScroll}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
				}}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
			<LoadingMore visible={visible} loading={loading} />
		</Fragment>
	);
}
