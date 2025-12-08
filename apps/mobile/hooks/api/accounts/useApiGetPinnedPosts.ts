import { useQuery } from '@tanstack/react-query';
import { AtprotoApiAdapter, MisskeyApiAdapter } from '@dhaaga/bridge';
import { PostParser, ActivityPubService } from '@dhaaga/bridge';
import type { PostObjectType } from '@dhaaga/bridge';
import {
	useAppAcct,
	useAppApiClient,
} from '../../utility/global-state-extractors';

/**
 * -- Obtain the pinned posts --
 *
 * Mastodon = Separate Call
 * Misskey - Already embedded in UserDetailed
 * Pleroma - ???
 */
function useApiGetPinnedPosts(userId: string) {
	const { client, driver } = useAppApiClient();
	const { acct } = useAppAcct();

	async function fn() {
		/**
		 * Misskey returns pinned notes as part of
		 * UserDetailed object
		 */

		if (ActivityPubService.misskeyLike(driver)) {
			const { data, error } = await (client as MisskeyApiAdapter).users.get(
				userId,
			);
			if (error) throw new Error(error.message);
			const _data = data as any;
			return PostParser.parse<unknown[]>(
				_data.pinnedNotes,
				driver,
				acct?.server,
			).slice(0, 10);
		} else if (ActivityPubService.blueskyLike(driver)) {
			return PostParser.parse<unknown[]>(
				await (client as AtprotoApiAdapter).users.getPinnedPosts(userId),
				driver,
				acct?.server,
			).slice(0, 10);
		} else {
			const data = await client.users.getPosts(userId, {
				limit: 10,
				pinned: true,
				userId,
			});
			return PostParser.parse<unknown[]>(
				data as any,
				driver,
				acct?.server,
			).slice(0, 10);
		}
	}

	// Post Queries
	return useQuery<PostObjectType[]>({
		queryKey: ['acct', acct?.server, userId],
		queryFn: fn,
		enabled: !!userId && typeof userId === 'string',
		initialData: [],
	});
}

export default useApiGetPinnedPosts;
