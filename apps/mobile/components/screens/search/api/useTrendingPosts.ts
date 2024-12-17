import { useAppPaginationContext } from '../../../../states/usePagination';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function useTrendingPosts() {
	const { client, driver, acct } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			driver: o.driver,
			acct: o.acct,
		})),
	);
	const {
		data: PageData,
		setMaxId,
		queryCacheMaxId,
	} = useAppPaginationContext();
	const [IsLoading, setIsLoading] = useState(false);

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
			const dataI = ActivityPubAdapterService.adaptManyStatuses(data, driver);

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
