import type {
	FeedObjectType,
	PostObjectType,
	ResultPage,
	UserObjectType,
} from '@dhaaga/bridge';
import {
	useFeedTimelineState,
	usePostTimelineState,
	useUserTimelineState,
} from '@dhaaga/core';
import PostSkeleton from '#/ui/skeletons/PostSkeleton';
import TimelineErrorView from '#/features/timelines/view/TimelineErrorView';
import { View } from 'react-native';
import { DefinedUseQueryResult } from '@tanstack/react-query';

type PostResultPage = ResultPage<PostObjectType[]>;
type UserResultPage = ResultPage<UserObjectType[]>;
type FeedResultPage = ResultPage<FeedObjectType[]>;

type PostSearchStateIndicatorProps = {
	containerHeight: number;
	queryResult: DefinedUseQueryResult<PostResultPage, Error>;
};

export function PostSearchStateIndicator({
	containerHeight,
	queryResult,
}: PostSearchStateIndicatorProps) {
	const State = usePostTimelineState()!;

	console.log(containerHeight);

	const { isFetched, error, isRefetching } = queryResult;
	if (State.items.length === 0 && (isRefetching || !isFetched))
		return <PostSkeleton containerHeight={containerHeight} />;
	if (error) return <TimelineErrorView error={error} />;
	return <View />;
}

type PeopleSearchStateIndicatorProps = {
	containerHeight: number;
	queryResult: DefinedUseQueryResult<UserResultPage, Error>;
};

export function PeopleSearchStateIndicator({
	containerHeight,
	queryResult,
}: PeopleSearchStateIndicatorProps) {
	const State = useUserTimelineState()!;

	const { isFetched, error, isRefetching } = queryResult;
	if (State.items.length === 0 && (isRefetching || !isFetched))
		return <PostSkeleton containerHeight={containerHeight} />;
	if (error) return <TimelineErrorView error={error} />;
	return <View />;
}

type FeedSearchStateIndicatorProps = {
	containerHeight: number;
	queryResult: DefinedUseQueryResult<FeedResultPage, Error>;
};

export function FeedSearchStateIndicator({
	containerHeight,
	queryResult,
}: FeedSearchStateIndicatorProps) {
	const State = useFeedTimelineState()!;

	const { isFetched, error, isRefetching } = queryResult;
	if (State.items.length === 0 && (isRefetching || !isFetched))
		return <PostSkeleton containerHeight={containerHeight} />;
	if (error) return <TimelineErrorView error={error} />;
	return <View />;
}
