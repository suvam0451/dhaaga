import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { useEffect, useState } from 'react';
import { StatusInterface } from '@dhaaga/shared-abstraction-activitypub';
import { useQuery } from '@tanstack/react-query';
import { GetPostsQueryDTO } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_interface';
import ActivityPubAdapterService from '../../../services/activitypub-adapter.service';

function useGetLikes(query: GetPostsQueryDTO) {
	const { client, primaryAcct, domain } = useActivityPubRestClientContext();
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
		return ActivityPubAdapterService.adaptManyStatuses(data, domain);
	}

	const { status, data, fetchStatus, refetch } = useQuery<StatusInterface[]>({
		queryKey: [
			'favourites',
			primaryAcct.subdomain,
			primaryAcct.username,
			query,
		],
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
