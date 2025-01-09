import { AppPostObject } from '../../types/app-post.types';
import { AppFlashList } from '../lib/AppFlashList';
import LoadingMore from '../screens/home/LoadingMore';
import UserPeekModal from '../modals/UserPeekModal';
import { Fragment } from 'react';
import { FetchStatus } from '@tanstack/react-query';
import useLoadingMoreIndicatorState from '../../states/useLoadingMoreIndicatorState';

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
	onRefresh,
	onScroll,
	fetchStatus,
}: PostTimelineProps) {
	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
	});

	return (
		<Fragment>
			<AppFlashList.Post
				data={data}
				paddingTop={50 + 16}
				refreshing={refreshing}
				onRefresh={onRefresh}
				onScroll={onScroll}
			/>
			<LoadingMore visible={visible} loading={loading} />
			<UserPeekModal />
		</Fragment>
	);
}
