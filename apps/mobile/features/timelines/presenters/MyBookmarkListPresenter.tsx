import WithAutoHideTopNavBar from '../../../components/containers/WithAutoHideTopNavBar';
import WithPostTimelineCtx from '../contexts/PostTimelineCtx';
import { TimelineFetchMode } from '../../../states/interactors/post-timeline.reducer';
import { PostTimelinePresenter } from './PostTimelinePresenter';
import useTimeline from '../api/useTimeline';

function DataView() {
	const { data, fetchStatus, refresh, refreshing, onScroll, translateY } =
		useTimeline(TimelineFetchMode.BOOKMARKS);

	return (
		<WithAutoHideTopNavBar title={'My Bookmarks'} translateY={translateY}>
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

function MyBookmarkListPresenter() {
	return (
		<WithPostTimelineCtx>
			<DataView />
		</WithPostTimelineCtx>
	);
}

export default MyBookmarkListPresenter;
