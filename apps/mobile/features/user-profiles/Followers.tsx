import ProfileFollowersPresenter from './presenters/ProfileFollowersPresenter';
import { UserTimelineCtx } from '@dhaaga/core';

function Followers() {
	return (
		<UserTimelineCtx>
			<ProfileFollowersPresenter />
		</UserTimelineCtx>
	);
}

export default Followers;
