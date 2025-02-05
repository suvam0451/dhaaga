import { AppPostObject } from '../../types/app-post.types';
import LoadingMore from '../screens/home/LoadingMore';
import UserPeekModalPresenter from '../../features/user-profiles/presenters/UserPeekModalPresenter';
import { Fragment } from 'react';
import { FetchStatus } from '@tanstack/react-query';
import useLoadingMoreIndicatorState from '../../states/useLoadingMoreIndicatorState';
import { Animated, RefreshControl } from 'react-native';
import StatusItem from '../common/status/StatusItem';
import WithAppStatusItemContext from '../../hooks/ap-proto/useAppStatusItem';

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
export function PostTimeline({
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
					paddingTop: 50 + 16,
				}}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
			<LoadingMore visible={visible} loading={loading} />
			<UserPeekModalPresenter />
		</Fragment>
	);
}
