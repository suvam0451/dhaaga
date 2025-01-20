import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { useState } from 'react';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import { useTimelineState } from '../../timelines/contexts/PostTimelineCtx';
import { PostTimeline } from '../../../components/data-views/PostTimeline';
import useMyPosts from '../interactors/useMyPosts';

function MyPostsPresenter() {
	const [Refreshing, setRefreshing] = useState(false);
	const { loadMore, onRefresh, fetchStatus } = useMyPosts();
	const State = useTimelineState();

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: State.items.length,
		updateQueryCache: loadMore,
	});

	function _onRefresh() {
		setRefreshing(true);
		onRefresh().finally(() => {
			setRefreshing(false);
		});
	}

	return (
		<AppTopNavbar
			title={'My Posts'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<PostTimeline
				data={State.items}
				onScroll={onScroll}
				refreshing={Refreshing}
				onRefresh={_onRefresh}
				fetchStatus={fetchStatus}
			/>
		</AppTopNavbar>
	);
}

export default MyPostsPresenter;
