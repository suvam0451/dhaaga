import { useQuery } from '@tanstack/react-query';
import { KNOWN_SOFTWARE, MisskeyRestClient } from '@dhaaga/bridge';
import { UserDetailed } from 'misskey-js/built/autogen/models';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppPostObject } from '../../../../types/app-post.types';
import { PostMiddleware } from '../../../../services/middlewares/post.middleware';

/**
 * -- Obtain the pinned posts --
 *
 * Mastodon = Separate Call
 * Misskey - Already embedded in UserDetailed
 * Pleroma - ???
 */
function usePinnedPosts(userId: string) {
	const { client, acct, driver } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			driver: o.driver,
			client: o.router,
		})),
	);

	async function fn() {
		switch (driver) {
			// NOTE: may be redundant
			case KNOWN_SOFTWARE.MISSKEY:
			case KNOWN_SOFTWARE.FIREFISH:
			case KNOWN_SOFTWARE.SHARKEY: {
				const { data, error } = await (
					client as MisskeyRestClient
				).accounts.get(userId);
				if (error) return [];
				const _data = data as UserDetailed;
				return PostMiddleware.deserialize<unknown[]>(
					_data.pinnedNotes,
					driver,
					acct?.server,
				).slice(0, 10);
			}
			default: {
				const { data, error } = (await client.accounts.statuses(userId, {
					limit: 10,
					pinned: true,
					userId,
				})) as any;
				if (error) return [];
				return PostMiddleware.deserialize<unknown[]>(
					data,
					driver,
					acct?.server,
				).slice(0, 10);
			}
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

export default usePinnedPosts;
