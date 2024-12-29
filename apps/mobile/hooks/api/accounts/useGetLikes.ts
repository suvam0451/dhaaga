import { useEffect, useState } from 'react';
import { StatusInterface } from '@dhaaga/bridge';
import { useQuery } from '@tanstack/react-query';
import { GetPostsQueryDTO } from '@dhaaga/bridge/dist/adapters/_client/_interface';
import ActivityPubAdapterService from '../../../services/activitypub-adapter.service';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function useGetLikes(query: GetPostsQueryDTO) {
	const { client, acct, driver } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			acct: o.acct,
			driver: o.driver,
		})),
	);
	const [Data, setData] = useState<StatusInterface[]>([]);

	async function api() {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.accounts.likes({
			...query,
			limit: query.limit || 10,
		});
		if (error) {
			console.log('[ERROR]: fetching likes', error);
			return [];
		}
		return ActivityPubAdapterService.adaptManyStatuses(data, driver);
	}

	const { status, data, fetchStatus, refetch } = useQuery<StatusInterface[]>({
		queryKey: ['favourites', acct?.server, acct?.username, query],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		setData(data);
	}, [fetchStatus]);

	return { data: Data, refetch, fetchStatus };
}

export default useGetLikes;
