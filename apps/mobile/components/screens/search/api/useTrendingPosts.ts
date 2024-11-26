import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useAppPaginationContext } from '../../../../states/usePagination';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
// import { useRealm } from '@realm/react';
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import { ActivitypubStatusService } from '../../../../services/approto/activitypub-status.service';

function useTrendingPosts() {
	const { client, domain, subdomain } = useActivityPubRestClientContext();
	const {
		data: PageData,
		setMaxId,
		queryCacheMaxId,
	} = useAppPaginationContext();
	const [IsLoading, setIsLoading] = useState(false);
	// const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();

	async function api() {
		if (!client) return null;
		const { data, error } = await client.trends.posts({
			limit: 5,
			offset: parseInt(queryCacheMaxId),
		});
		if (error) {
			console.log(error);
			return [];
		}
		console.log(data);
		return data;
	}

	// Queries
	const { status, data, fetchStatus, refetch } = useQuery({
		queryKey: ['trending/posts', queryCacheMaxId],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;

		if (data?.length > 0) {
			setMaxId((PageData.length + data.length).toString());
			setIsLoading(true);
			const dataI = ActivityPubAdapterService.adaptManyStatuses(data, domain);

			/**
			 * Resolve Software + Custom Emojis
			 */
			for (const datum of dataI) {
				// ActivitypubStatusService.factory(datum, domain, subdomain)
				// 	.resolveInstances()
				// 	.syncSoftware(db)
				// 	.then((res) => {
				// 		res.syncCustomEmojis(db, globalDb).then(() => {});
				// 	});
			}
		}
	}, [fetchStatus]);

	return { IsLoading, fetchStatus, refetch };
}

export default useTrendingPosts;
