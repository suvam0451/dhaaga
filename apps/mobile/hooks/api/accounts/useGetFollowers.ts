import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
	KNOWN_SOFTWARE,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { AppBskyGraphGetFollowers } from '@atproto/api';
import ActivityPubAdapterService from '../../../services/activitypub-adapter.service';
import useAppPaginator from '../../app/useAppPaginator';
import ActivityPubService from '../../../services/activitypub.service';

function useGetFollowers(id: string) {
	const [Data, setData] = useState<UserInterface[]>([]);
	const { lastId, MaxId, loadNext } = useAppPaginator();

	const { client, primaryAcct, domain } = useActivityPubRestClientContext();

	async function api() {
		const { data, error } = await client.accounts.followers({
			id,
			limit: 20,
			maxId: MaxId,
			allowPartial: false,
		});
		if (error) return null;
		return data;
	}

	// Queries
	const { status, data, refetch, fetchStatus } = useQuery({
		queryKey: ['followers', id, MaxId, primaryAcct._id],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success' || data === null)
			return;

		if (domain === KNOWN_SOFTWARE.BLUESKY) {
			const _data = (data as AppBskyGraphGetFollowers.Response).data;
			lastId.current = _data.cursor;
			setData(
				ActivityPubAdapterService.adaptManyUsers(_data.followers, domain),
			);
		} else if (ActivityPubService.misskeyLike(domain)) {
			if ((data as any).data.length === 0) return;
			lastId.current = (data as any).data[(data as any).data.length - 1].id;

			setData(
				ActivityPubAdapterService.adaptManyUsers(
					(data as any).data.map((o: any) => o.follower),
					domain,
				),
			);
		} else {
			const LEN = (data as any).length;
			if (LEN === 0) return;
			lastId.current = (data as any)[LEN - 1].id;
			setData(ActivityPubAdapterService.adaptManyUsers(data as any, domain));
		}
	}, [fetchStatus]);

	return { Data, refetch, loadNext };
}

export default useGetFollowers;
