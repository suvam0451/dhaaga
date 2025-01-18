import { useQuery } from '@tanstack/react-query';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppBskyGraphGetFollows } from '@atproto/api';
import ActivityPubService from '../../../services/activitypub.service';
import { useAppApiClient } from '../../../hooks/utility/global-state-extractors';
import { AppResultPageType } from '../../../types/app.types';
import { AppUserObject } from '../../../types/app-user.types';
import { UserMiddleware } from '../../../services/middlewares/user.middleware';

/**
 * ------ Shared ------
 */

const defaultResult = {
	success: true,
	maxId: null,
	minId: null,
	items: [],
};

type UserResultPage = AppResultPageType<AppUserObject>;

function useGetFollows(acctId: string, maxId?: string) {
	const { driver, client, server } = useAppApiClient();

	async function api() {
		const { data, error } = await client.accounts.followings({
			id: acctId,
			limit: 10,
			maxId,
			allowPartial: true,
		});
		if (error) throw new Error(error.message);

		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			const _data = (data as AppBskyGraphGetFollows.Response).data;
			return {
				success: true,
				maxId: _data.cursor,
				minId: null,
				items: UserMiddleware.deserialize<unknown[]>(
					_data.follows,
					driver,
					server,
				),
			};
		}

		if (ActivityPubService.misskeyLike(driver)) {
			return {
				items: UserMiddleware.deserialize<unknown[]>(
					(data as any).data.map((o: any) => o.follower),
					driver,
					server,
				),
				maxId: (data as any).data[(data as any).data.length - 1].id,
				minId: null,
				success: true,
			};
		}

		return {
			items: UserMiddleware.deserialize<unknown[]>(
				(data as any)?.data,
				driver,
				server,
			),
			maxId: (data as any)?.data?.maxId,
			minId: null,
			success: true,
		};
	}

	return useQuery<UserResultPage>({
		queryKey: ['follows', acctId, maxId],
		queryFn: api,
		enabled: !!client,
		initialData: defaultResult,
	});
}

export default useGetFollows;
