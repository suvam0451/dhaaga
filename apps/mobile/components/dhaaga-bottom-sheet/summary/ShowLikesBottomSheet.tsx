import { useAppBottomSheet } from '#/states/global/hooks';
import { UserTimelineCtx, useUserTimelineState } from '@dhaaga/core';
import { usePostEventBusStore } from '#/hooks/pubsub/usePostEventBus';
import BottomSheetMenu from '#/components/dhaaga-bottom-sheet/components/BottomSheetMenu';
import { UserTimelineView } from '#/features/timelines/view/UserTimelineView';
import { useApiGetPostLikedBy } from '#/components/api';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

function Content() {
	const { ctx } = useAppBottomSheet();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);
	const { post } = usePostEventBusStore(
		ctx.$type === 'post-id' ? ctx.postId : null,
	);

	const State = useUserTimelineState();
	const queryResult = useApiGetPostLikedBy(post?.id, State.appliedMaxId);

	if (!post) return <View />;
	return (
		<>
			<BottomSheetMenu title={t(`sheetLabels.likedBy`)} variant={'clear'} />
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
