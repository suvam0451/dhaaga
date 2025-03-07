import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { useState } from 'react';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import { PostTimelinePresenter } from '../../timelines/presenters/PostTimelinePresenter';
import useMyPosts from '../interactors/useMyPosts';
import { usePostTimelineState } from '@dhaaga/core';

function MyPostsPresenter() {
	const [Refreshing, setRefreshing] = useState(false);
	const { loadMore, onRefresh, fetchStatus } = useMyPosts();
	const State = usePostTimelineState();

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
			<PostTimelinePresenter
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
