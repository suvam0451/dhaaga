import { useLocalSearchParams } from 'expo-router';
import useGetFollowers from '../api/useGetFollowers';
import { useEffect } from 'react';
import { AppUserTimelineReducerActionType } from '../../../states/interactors/user-timeline.reducer';
import { useUserTimelineDispatch } from '../../timelines/contexts/UserTimelineCtx';

function useFollowersInteractor() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const queryResult = useGetFollowers(id);
	const TimelineDispatch = useUserTimelineDispatch();

	useEffect(() => {
		if (!queryResult.data.success) {
			return;
		}
		TimelineDispatch({
			type: AppUserTimelineReducerActionType.APPEND_RESULTS,
			payload: queryResult.data,
		});
	}, [queryResult.fetchStatus]);

	return { ...queryResult };
}

export default useFollowersInteractor;
