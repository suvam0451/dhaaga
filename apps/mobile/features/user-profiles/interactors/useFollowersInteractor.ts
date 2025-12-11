import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { UserTimelineStateAction, useUserTimelineDispatch } from '@dhaaga/core';
import { useQuery } from '@tanstack/react-query';
import { userFollowersQueryOpts } from '@dhaaga/react';
import { useAppApiClient } from '#/states/global/hooks';

function useFollowersInteractor() {
	const { client } = useAppApiClient();
	const { id } = useLocalSearchParams<{ id: string }>();
	const queryResult = useQuery(userFollowersQueryOpts(client, id, null));
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
