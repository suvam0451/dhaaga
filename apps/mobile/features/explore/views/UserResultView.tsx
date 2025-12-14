import { useDiscoverState, UserTimelineCtx } from '@dhaaga/core';
import { useApiSearchUsers } from '#/hooks/api/useApiSearch';
import { useUserTimelineState } from '@dhaaga/core';
import { UserTimelineView } from '#/components/timelines/UserTimelineView';

function Generator() {
	const State = useDiscoverState();
	const state = useUserTimelineState();
	const queryResult = useApiSearchUsers(
		'suggested',
		State.q,
		state.appliedMaxId,
	);

	return (
		<UserTimelineView
			label={null}
			navbarType={'none'}
			queryResult={queryResult}
			flatListKey={'explore/users'}
		/>
	);
}

function UserResultView() {
	return (
		<UserTimelineCtx>
			<Generator />
		</UserTimelineCtx>
	);
}

export default UserResultView;
