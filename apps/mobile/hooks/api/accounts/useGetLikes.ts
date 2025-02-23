import { useQuery } from '@tanstack/react-query';
import { GetPostsQueryDTO } from '@dhaaga/bridge/dist/adapters/_client/_interface';
import {
	useAppAcct,
	useAppApiClient,
} from '../../utility/global-state-extractors';
import { AppResultPageType } from '../../../types/app.types';
import ActivityPubService from '../../../services/activitypub.service';
import { AtprotoApiAdapter, KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { PostParser } from '@dhaaga/bridge';
import type { PostObjectType } from '@dhaaga/bridge';

function useGetLikes(query: GetPostsQueryDTO) {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useAppAcct();

	return useQuery<AppResultPageType<PostObjectType>>({
		queryKey: ['acct/likes', acct, query],
		queryFn: async () => {
			if (driver === KNOWN_SOFTWARE.BLUESKY) {
				const { data, error } = await (
					client as AtprotoApiAdapter
				).accounts.atProtoLikes(acct.identifier, {
					limit: 5,
					cursor: query.maxId === null ? undefined : query.maxId,
				});
				if (error) throw new Error(error.message);
				return {
					success: true,
					items: PostParser.parse<unknown[]>(data.feed, driver, server),
					maxId: data.cursor,
					minId: null,
				};
			}

			const { data, error } = await client.accounts.likes({
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
