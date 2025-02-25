import { useLocalSearchParams } from 'expo-router';
import useGetFollowers from '../api/useGetFollowers';
import { useEffect } from 'react';
import { UserTimelineStateAction, useUserTimelineDispatch } from '@dhaaga/core';

function useFollowersInteractor() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const queryResult = useGetFollowers(id, null);
	const dispatch = useUserTimelineDispatch();

	useEffect(() => {
		dispatch({
			type: UserTimelineStateAction.APPEND,
			payload: queryResult.data,
		});
	}, [queryResult.fetchStatus]);

	return { ...queryResult };
}

export default useFollowersInteractor;
