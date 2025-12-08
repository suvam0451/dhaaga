import { useQuery } from '@tanstack/react-query';
import type { GetPostsQueryDTO, PostObjectType } from '@dhaaga/bridge';
import {
	useAppAcct,
	useAppApiClient,
} from '../../utility/global-state-extractors';
import { AppResultPageType } from '#/types/app.types';
import {
	AtprotoApiAdapter,
	KNOWN_SOFTWARE,
	PostParser,
	ActivityPubService,
} from '@dhaaga/bridge';

function useGetLikes(query: GetPostsQueryDTO) {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useAppAcct();

	return useQuery<AppResultPageType<PostObjectType>>({
		queryKey: ['acct/likes', acct, query],
		queryFn: async () => {
			if (driver === KNOWN_SOFTWARE.BLUESKY) {
				const data = await (client as AtprotoApiAdapter).users.atProtoLikes(
					acct.identifier,
					{
						limit: 5,
						cursor: query.maxId === null ? undefined : query.maxId,
					},
				);
				return {
					success: true,
					items: PostParser.parse<unknown[]>(data.feed, driver, server),
					maxId: data.cursor,
					minId: null,
				};
			}

			const { data, error } = await client.users.likes({
				...query,
				limit: 5,
			});
			if (error) throw new Error(error.message);

			return {
				success: true,
				items: PostParser.parse<unknown[]>(data as any, driver, server),
				maxId: null,
				minId: null,
			};
		},
		enabled: !!client && !ActivityPubService.misskeyLike(driver),
	});
}

export default useGetLikes;
