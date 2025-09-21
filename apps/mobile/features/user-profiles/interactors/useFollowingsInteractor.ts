import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { UserTimelineStateAction, useUserTimelineDispatch } from '@dhaaga/core';
import { useQuery } from '@tanstack/react-query';
import { userFollowsQueryOpts } from '@dhaaga/react';
import { useAppApiClient } from '../../../hooks/utility/global-state-extractors';

function useFollowersInteractor() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { client } = useAppApiClient();
	const queryResult = useQuery(userFollowsQueryOpts(client, id, null));
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
