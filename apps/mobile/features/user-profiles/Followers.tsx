import WithUserTimelineCtx from '../timelines/contexts/UserTimelineCtx';
import ProfileFollowersPresenter from './presenters/ProfileFollowersPresenter';

function Followers() {
	return (
		<WithUserTimelineCtx>
			<ProfileFollowersPresenter />
		</WithUserTimelineCtx>
	);
}

export default Followers;
