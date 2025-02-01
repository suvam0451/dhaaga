import { useQuery } from '@tanstack/react-query';
import { MisskeyRestClient } from '@dhaaga/bridge';
import { AppPostObject } from '../../../types/app-post.types';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';
import {
	useAppAcct,
	useAppApiClient,
} from '../../utility/global-state-extractors';
import ActivityPubService from '../../../services/activitypub.service';

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
			const { data, error } = await (client as MisskeyRestClient).accounts.get(
				userId,
			);
			if (error) throw new Error(error.message);
			const _data = data as any;
			return PostMiddleware.deserialize<unknown[]>(
				_data.pinnedNotes,
				driver,
				acct?.server,
			).slice(0, 10);
		} else {
			const { data, error } = (await client.accounts.statuses(userId, {
				limit: 10,
				pinned: true,
				userId,
			})) as any;
			if (error) throw new Error(error.message);
			return PostMiddleware.deserialize<unknown[]>(
				data,
				driver,
				acct?.server,
			).slice(0, 10);
		}
	}

	// Post Queries
	return useQuery<AppPostObject[]>({
		queryKey: ['acct', acct?.server, userId],
		queryFn: fn,
		enabled: !!userId && typeof userId === 'string',
		initialData: [],
	});
}

export default useApiGetPinnedPosts;
