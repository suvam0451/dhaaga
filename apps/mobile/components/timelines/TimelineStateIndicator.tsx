import type { PostObjectType, ResultPage } from '@dhaaga/bridge';
import { DefinedUseQueryResult } from '@tanstack/react-query';
import { usePostTimelineState } from '@dhaaga/core';
import TimelineErrorView from '#/features/timelines/view/TimelineErrorView';
import { View } from 'react-native';
import PostSkeleton from '#/ui/skeletons/PostSkeleton';

export function PostTimelineStateIndicator({
	queryResult,
	containerHeight,
}: {
	containerHeight: number;
	queryResult: DefinedUseQueryResult<ResultPage<PostObjectType>, Error>;
}) {
	const State = usePostTimelineState()!;

	const { isFetched, error, isRefetching } = queryResult;
	if (State.items.length === 0 && (isRefetching || !isFetched))
		return <PostSkeleton containerHeight={containerHeight} />;
	if (error) return <TimelineErrorView error={error} />;
	return <View />;
}
