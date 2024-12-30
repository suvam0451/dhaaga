import { useQuery } from '@tanstack/react-query';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';
import { StatusInterface } from '@dhaaga/bridge';

/**
 * Returns the interface for a post
 * @param id apProto id, or atProto cid
 */
function useGetPostInterface(id: string) {
	const { client, driver } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			driver: o.driver,
		})),
	);

	async function api(): Promise<StatusInterface> {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.statuses.get(id);
		if (error) throw new Error(error.message);
		return PostMiddleware.rawToInterface(data, driver);
	}

	return useQuery<StatusInterface>({
		queryKey: ['post', id],
		queryFn: api,
		enabled: client && id !== undefined,
		initialData: null,
	});
}

export default useGetPostInterface;
