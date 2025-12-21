import { useAppBottomSheet } from '#/states/global/hooks';
import { UserTimelineCtx, useUserTimelineState } from '@dhaaga/core';
import { usePostEventBusStore } from '#/hooks/pubsub/usePostEventBus';
import BottomSheetMenu from '#/components/dhaaga-bottom-sheet/components/BottomSheetMenu';
import { UserTimelineView } from '#/features/timelines/view/UserTimelineView';
import { useApiGetPostLikedBy } from '#/components/api';

function Content() {
	const { ctx } = useAppBottomSheet();
	const { post } = usePostEventBusStore(
		ctx.$type === 'post-id' ? ctx.postId : null,
	);

	const State = useUserTimelineState();
	const queryResult = useApiGetPostLikedBy(post.id, State.appliedMaxId);

	return (
		<>
			<BottomSheetMenu title={'Liked By'} variant={'clear'} />
			<UserTimelineView
				label={null}
				queryResult={queryResult}
				navbarType={'none'}
				flatListKey={'post/likes'}
				itemType={'user-any'}
			/>
		</>
	);
}

function ShowLikesBottomSheet() {
	return (
		<UserTimelineCtx>
			<Content />
		</UserTimelineCtx>
	);
}

export default ShowLikesBottomSheet;
