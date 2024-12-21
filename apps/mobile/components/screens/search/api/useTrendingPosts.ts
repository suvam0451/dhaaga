import { useAppPaginationContext } from '../../../../states/usePagination';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function useTrendingPosts() {
	const { client } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
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
		}
	}, [fetchStatus]);

	return { IsLoading, fetchStatus, refetch };
}

export default useTrendingPosts;
