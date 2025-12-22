import { useAppBottomSheet } from '#/states/global/hooks';
import { useApiGetPostSharedBy } from '#/components/api';
import { UserTimelineCtx, useUserTimelineState } from '@dhaaga/core';
import { usePostEventBusStore } from '#/hooks/pubsub/usePostEventBus';
import { UserTimelineView } from '#/features/timelines/view/UserTimelineView';
import BottomSheetMenu from '#/components/dhaaga-bottom-sheet/components/BottomSheetMenu';

function Generator() {
	const { ctx } = useAppBottomSheet();
	const { post } = usePostEventBusStore(
		ctx.$type === 'post-id' ? ctx.postId : null,
	);

	const State = useUserTimelineState();
	const queryResult = useApiGetPostSharedBy(post.id, State.appliedMaxId);

	return (
		<>
			<BottomSheetMenu title={'Shared By'} variant={'clear'} />
			<UserTimelineView
				label={null}
				queryResult={queryResult}
				navbarType={'none'}
				flatListKey={'post/shares'}
				itemType={'user-any'}
			/>
		</>
	);
}

function ShowSharesBottomSheet() {
	return (
		<UserTimelineCtx>
			<Generator />
		</UserTimelineCtx>
	);
}

export default ShowSharesBottomSheet;
