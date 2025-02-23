import { useQuery } from '@tanstack/react-query';
import { defaultResultPage } from '@dhaaga/bridge';
import { useAppApiClient } from '../../../hooks/utility/global-state-extractors';

function useGetFollows(acctId: string, maxId: string | null) {
	const { client } = useAppApiClient();

	return useQuery({
		queryKey: ['follows', acctId, maxId],
		queryFn: () =>
			client.user
				.getFollows({
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

export default useGetFollows;
