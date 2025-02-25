import MyPostsPresenter from './presenters/MyPostsPresenter';
import { PostTimelineCtx } from '@dhaaga/core';

function MyPosts() {
	return (
		<PostTimelineCtx>
			<MyPostsPresenter />
		</PostTimelineCtx>
	);
}

export default MyPosts;
