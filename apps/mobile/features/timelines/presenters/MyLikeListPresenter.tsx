import WithAutoHideTopNavBar from '../../../components/containers/WithAutoHideTopNavBar';
import { PostTimelineCtx, TimelineFetchMode } from '@dhaaga/core';
import { PostTimelinePresenter } from './PostTimelinePresenter';
import useTimeline from '../api/useTimeline';

function DataView() {
	const { data, fetchStatus, refresh, refreshing, onScroll, translateY } =
		useTimeline(TimelineFetchMode.LIKES);

	return (
		<WithAutoHideTopNavBar title={'My Liked Posts'} translateY={translateY}>
			<PostTimelinePresenter
				data={data}
				onScroll={onScroll}
				refreshing={refreshing}
				onRefresh={refresh}
				fetchStatus={fetchStatus}
			/>
		</WithAutoHideTopNavBar>
	);
}

function MyLikeListPresenter() {
	return (
		<PostTimelineCtx>
			<DataView />
		</PostTimelineCtx>
	);
}

export default MyLikeListPresenter;
