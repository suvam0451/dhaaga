import ProfileFollowingsPresenter from './presenters/ProfileFollowingsPresenter';
import { UserTimelineCtx } from '@dhaaga/core';

function Followings() {
	return (
		<UserTimelineCtx>
			<ProfileFollowingsPresenter />
		</UserTimelineCtx>
	);
}

export default Followings;
