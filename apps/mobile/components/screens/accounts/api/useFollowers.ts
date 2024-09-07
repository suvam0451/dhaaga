import { useQuery } from '@tanstack/react-query';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useAppPaginationContext } from '../../../../states/usePagination';
import { useEffect } from 'react';
import { useScrollOnReveal } from '../../../../states/useScrollOnReveal';
import ActivityPubService from '../../../../services/activitypub.service';

function useFollowers(id: string) {
	const { client, domain, primaryAcct } = useActivityPubRestClientContext();
	const {
		queryCacheMaxId,
		append,
		setMaxId,
		data: PageData,
		updateQueryCache,
		clear,
	} = useAppPaginationContext();
	const { resetEndOfPageFlag } = useScrollOnReveal();

	useEffect(() => {
		clear();
	}, [primaryAcct]);

	async function api() {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.accounts.followers({
			id,
			limit: 12,
			allowPartial: false,
			maxId: queryCacheMaxId,
		});
		if (error) {
			return { data: [] };
		}
		return data;
	}

	// Queries
	const { data, status, fetchStatus } = useQuery({
		queryKey: ['followers', id, queryCacheMaxId],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		if (data.data.length > 0) {
			if (ActivityPubService.misskeyLike(domain)) {
				append(
					data.data.map((o) => o.follower),
					(o) => o.id,
				);
				setMaxId((data.data[data.data.length - 1] as any).id);
			} else {
				append(data.data, (o) => o.id);
				setMaxId(data.maxId);
			}
			resetEndOfPageFlag();
		}
	}, [fetchStatus]);

	return { updateQueryCache, data: PageData };
}

export default useFollowers;
