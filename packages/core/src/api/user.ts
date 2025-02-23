import { defaultResultPage } from '@dhaaga/bridge';
import { useQuery } from '@tanstack/react-query';

// function useGetFollowers(acctId: string, maxId?: string | null) {
// 	const { client } = useAppApiClient();
//
// 	return useQuery({
// 		queryKey: ['followers', acctId, maxId],
// 		queryFn: () =>
// 			client.user
// 				.getFollowers({
// 					id: acctId,
// 					limit: 10,
// 					maxId,
// 					allowPartial: true,
// 				})
// 				.then((o) => o.unwrapOrElse(defaultResultPage)),
// 		enabled: !!client,
// 		initialData: defaultResultPage,
// 	});
// }
//
//
// function useGetFollows(acctId: string, maxId: string | null) {
// 	const { client } = useAppApiClient();
//
// 	return useQuery({
// 		queryKey: ['follows', acctId, maxId],
// 		queryFn: () =>
// 			client.user
// 				.getFollows({
// 					id: acctId,
// 					limit: 10,
// 					maxId,
// 					allowPartial: true,
// 				})
// 				.then((o) => o.unwrapOrElse(defaultResultPage)),
// 		enabled: !!client,
// 		initialData: defaultResultPage,
// 	});
// }
