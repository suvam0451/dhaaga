import WithUserTimelineCtx from '../timelines/contexts/UserTimelineCtx';
import ProfileFollowingsPresenter from './presenters/ProfileFollowingsPresenter';

function Followings() {
	return (
		<WithUserTimelineCtx>
			<ProfileFollowingsPresenter />
		</WithUserTimelineCtx>
	);
}

export default Followings;
