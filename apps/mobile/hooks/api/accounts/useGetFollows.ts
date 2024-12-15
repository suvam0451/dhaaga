import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
	KNOWN_SOFTWARE,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { AppBskyGraphGetFollows } from '@atproto/api';
import ActivityPubAdapterService from '../../../services/activitypub-adapter.service';
import useAppPaginator from '../../app/useAppPaginator';
import ActivityPubService from '../../../services/activitypub.service';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function useGetFollows(id: string) {
	const [Data, setData] = useState<UserInterface[]>([]);
	const { lastId, MaxId, loadNext } = useAppPaginator();

	const { driver, acct, client } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			driver: o.driver,
			client: o.router,
		})),
	);

	async function api() {
		const { data, error } = await client.accounts.followings({
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
		queryKey: ['follows', id, MaxId, acct?.id],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success' || data === null)
			return;

		// EOL

		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			const _data = (data as AppBskyGraphGetFollows.Response).data;
			lastId.current = _data.cursor;
			setData(ActivityPubAdapterService.adaptManyUsers(_data.follows, driver));
		} else if (ActivityPubService.misskeyLike(driver)) {
			if ((data as any).data.length === 0) return;

			lastId.current = (data as any).data[(data as any).data.length - 1].id;
			setData(
				ActivityPubAdapterService.adaptManyUsers(
					(data as any).data.map((o: any) => o.followee),
					driver,
				),
			);
		} else {
			const LEN = (data as any).length;
			if (LEN === 0) return;
			lastId.current = (data as any)?.data?.maxId;
			setData(
				ActivityPubAdapterService.adaptManyUsers((data as any)?.data, driver),
			);
		}
	}, [fetchStatus]);

	return { Data, refetch, loadNext };
}

export default useGetFollows;
