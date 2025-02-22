import { useQuery } from '@tanstack/react-query';
import { PostParser } from '@dhaaga/core';
import { StatusInterface } from '@dhaaga/bridge';
import { useAppApiClient } from '../../utility/global-state-extractors';

/**
 * Returns the interface for a post
 * @param id apProto id, or atProto cid
 */
function useGetPostInterface(id: string) {
	const { client, driver } = useAppApiClient();

	async function api(): Promise<StatusInterface> {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.statuses.get(id);
		if (error) throw new Error(error.message);
		return PostParser.rawToInterface(data, driver);
	}

	return useQuery<StatusInterface>({
		queryKey: ['post', id],
		queryFn: api,
		enabled: client && id !== undefined,
		initialData: null,
	});
}

export default useGetPostInterface;
