import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { AppUserTimelineReducerActionType } from '../../../states/interactors/user-timeline.reducer';
import { useUserTimelineDispatch } from '../../timelines/contexts/UserTimelineCtx';
import useGetFollows from '../api/useGetFollows';

function useFollowersInteractor() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const queryResult = useGetFollows(id, null);
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
