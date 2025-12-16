import { useDiscoverState, UserTimelineCtx } from '@dhaaga/core';
import { useApiSearchUsers } from '#/hooks/api/useApiSearch';
import { useUserTimelineState } from '@dhaaga/core';
import { UserTimelineView } from '#/components/timelines/UserTimelineView';

function Generator() {
	const State = useDiscoverState();
	const state = useUserTimelineState();
	const queryResult = useApiSearchUsers(State.q, state.appliedMaxId);

	return (
		<UserTimelineView
			label={null}
			navbarType={'explore'}
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
