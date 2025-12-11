import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { userFollowsQueryOpts } from '@dhaaga/react';
import { useAppApiClient } from '#/states/global/hooks';

function useFollowersInteractor() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { client } = useAppApiClient();
	const queryResult = useQuery(userFollowsQueryOpts(client, id, null));

	return { ...queryResult };
}

export default useFollowersInteractor;
