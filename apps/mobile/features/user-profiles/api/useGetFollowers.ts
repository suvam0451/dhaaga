import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '../../../hooks/utility/global-state-extractors';
import { defaultResultPage } from '@dhaaga/bridge';

function useGetFollowers(acctId: string, maxId: string | null) {
	const { client } = useAppApiClient();

	return useQuery({
		queryKey: ['followers', acctId, maxId],
		queryFn: () =>
			client.user
				.getFollowers({
					id: acctId,
					limit: 10,
					maxId,
					allowPartial: true,
				})
				.then((o) => o.unwrapOrElse(defaultResultPage)),
		enabled: !!client,
		initialData: defaultResultPage,
	});
}

export default useGetFollowers;
