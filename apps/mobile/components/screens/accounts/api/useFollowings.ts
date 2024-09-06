import { useQuery } from '@tanstack/react-query';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useAppPaginationContext } from '../../../../states/usePagination';
import { useEffect } from 'react';
import { useScrollOnReveal } from '../../../../states/useScrollOnReveal';
import ActivityPubService from '../../../../services/activitypub.service';

function useFollowings(id: string) {
	const { client, domain } = useActivityPubRestClientContext();
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
		const { data, error } = await client.accounts.followings({
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
		queryKey: ['followings', id, queryCacheMaxId],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		if (data.data.length > 0) {
			if (ActivityPubService.misskeyLike(domain)) {
				append(
					data.data.map((o) => o.followee),
					(o) => o.id,
				);
				setMaxId((data.data[data.data.length - 1] as any).id);
			} else {
				append(data.data, (o) => o.id);
				setMaxId(data.maxId);
			}
			resetEndOfPageFlag();
		}
	}, [fetchStatus, domain]);

	return { updateQueryCache, data: PageData };
}

export default useFollowings;
