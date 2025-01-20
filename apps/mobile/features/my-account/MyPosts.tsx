import WithPostTimelineCtx from '../timelines/contexts/PostTimelineCtx';
import MyPostsPresenter from './presenters/MyPostsPresenter';

function MyPosts() {
	return (
		<WithPostTimelineCtx>
			<MyPostsPresenter />
		</WithPostTimelineCtx>
	);
}

export default MyPosts;
