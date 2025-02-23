import { useLocalSearchParams } from 'expo-router';
import useGetFollowers from '../api/useGetFollowers';
import { useEffect } from 'react';
import { AppUserTimelineReducerActionType } from '../../../states/interactors/user-timeline.reducer';
import { useUserTimelineDispatch } from '../../timelines/contexts/UserTimelineCtx';

function useFollowersInteractor() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const queryResult = useGetFollowers(id, null);
	const TimelineDispatch = useUserTimelineDispatch();

	useEffect(() => {
		TimelineDispatch({
			type: AppUserTimelineReducerActionType.APPEND,
			payload: queryResult.data,
		});
	}, [queryResult.fetchStatus]);

	return { ...queryResult };
}

export default useFollowersInteractor;
