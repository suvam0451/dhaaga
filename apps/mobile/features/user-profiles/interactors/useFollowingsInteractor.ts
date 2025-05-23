import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { UserTimelineStateAction, useUserTimelineDispatch } from '@dhaaga/core';
import useGetFollows from '../api/useGetFollows';

function useFollowersInteractor() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const queryResult = useGetFollows(id, null);
	const TimelineDispatch = useUserTimelineDispatch();

	useEffect(() => {
		TimelineDispatch({
			type: UserTimelineStateAction.APPEND,
			payload: queryResult.data,
		});
	}, [queryResult.fetchStatus]);

	return { ...queryResult };
}

export default useFollowersInteractor;
