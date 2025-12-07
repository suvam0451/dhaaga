import InboxTimelineSkeleton from '#/ui/InboxTimelineSkeleton';
import TimelineErrorView from '#/features/timelines/view/TimelineErrorView';
import { UseQueryResult } from '@tanstack/react-query';
import { View } from 'react-native';

export function StateIndicator({
	containerHeight,
	queryResult,
	numItems = 0,
}: {
	queryResult: UseQueryResult<any, Error>;
	containerHeight: number;
	numItems: number;
}) {
	const { isFetched, error, isRefetching } = queryResult;
	if (numItems === 0 && (isRefetching || !isFetched))
		return <InboxTimelineSkeleton containerHeight={containerHeight} />;
	if (error) return <TimelineErrorView error={error} />;
	return <View />;
}
