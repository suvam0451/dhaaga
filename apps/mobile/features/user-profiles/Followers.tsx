import WithUserTimelineCtx from '../timelines/contexts/UserTimelineCtx';
import ProfileFollowersPresenter from './presenters/ProfileFollowersPresenter';

function Followings() {
	return (
		<WithUserTimelineCtx>
			<ProfileFollowersPresenter />
		</WithUserTimelineCtx>
	);
}

export default Followings;
