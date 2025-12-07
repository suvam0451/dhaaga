import type { PostObjectType, ResultPage } from '@dhaaga/bridge/typings';
import { DefinedUseQueryResult } from '@tanstack/react-query';
import { usePostTimelineState } from '@dhaaga/core';
import TimelineErrorView from '#/features/timelines/view/TimelineErrorView';
import { View } from 'react-native';
import PostTimelineSkeleton from '#/ui/PostTimelineSkeleton';

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
		return <PostTimelineSkeleton containerHeight={containerHeight} />;
	if (error) return <TimelineErrorView error={error} />;
	return <View />;
}
