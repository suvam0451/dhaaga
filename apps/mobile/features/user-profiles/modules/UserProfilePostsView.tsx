import { PostTimelineCtx, usePostTimelineState } from '@dhaaga/core';
import { ScrollHandlerProcessed } from 'react-native-reanimated';
import ProfileModulePostListRenderer from '#/features/user-profiles/components/ProfileModulePostListRenderer';
import { useApiGetOriginalPostsFromAuthor } from '#/features/user-profiles/api';

type Props = {
	forwardedRef: any;
	userId: string;
	onScroll: ScrollHandlerProcessed<Record<string, unknown>>;
	headerHeight: number;
};

function ContentView({ forwardedRef, userId, onScroll, headerHeight }: Props) {
	const State = usePostTimelineState()!;

	const queryResult = useApiGetOriginalPostsFromAuthor(
		userId,
		State.appliedMaxId,
	);

	return (
		<ProfileModulePostListRenderer
			forwardedRef={forwardedRef}
			onScroll={onScroll}
			headerHeight={headerHeight}
			queryResult={queryResult}
		/>
	);
}

function UserProfilePostsView({
	forwardedRef,
	userId,
	onScroll,
	headerHeight,
}: Props) {
	return (
		<PostTimelineCtx>
			<ContentView
				forwardedRef={forwardedRef}
				userId={userId}
				onScroll={onScroll}
				headerHeight={headerHeight}
			/>
		</PostTimelineCtx>
	);
}

export default UserProfilePostsView;
