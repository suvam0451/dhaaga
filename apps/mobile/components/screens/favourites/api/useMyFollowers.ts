import { useQuery } from '@tanstack/react-query';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useAppPaginationContext } from '../../../../states/usePagination';
import { useEffect } from 'react';
import { useScrollOnReveal } from '../../../../states/useScrollOnReveal';

function useMyFollowers() {
	const { client, me } = useActivityPubRestClientContext();
	const userId = me.getId();
	const {
		queryCacheMaxId,
		append,
		setMaxId,
		data: PageData,
		updateQueryCache,
	} = useAppPaginationContext();
	const { resetEndOfPageFlag } = useScrollOnReveal();

	async function api() {
		if (!client) throw new Error('_client not initialized');
		return await client.getFollowers(me.getId());
	}

	// Queries
	const { data, status, fetchStatus } = useQuery({
		queryKey: ['followers', userId, queryCacheMaxId],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		if (data.length > 0) {
			append(data, (o) => o.id);
			setMaxId((PageData.length + data.length).toString());
			resetEndOfPageFlag();
		}
	}, [fetchStatus]);

	return { updateQueryCache, data };
}

export default useMyFollowers;
