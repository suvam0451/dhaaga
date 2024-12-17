import { useQuery } from '@tanstack/react-query';
import { useAppPaginationContext } from '../../../../states/usePagination';
import { useEffect } from 'react';
import { useScrollOnReveal } from '../../../../states/useScrollOnReveal';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../states/_global';

function useTrendingTags() {
	const { client } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
		})),
	);

	const { resetEndOfPageFlag } = useScrollOnReveal();

	const {
		queryCacheMaxId,
		append,
		setMaxId,
		data: PageData,
	} = useAppPaginationContext();

	async function api() {
		if (!client) return;

		const { data, error } = await client.trends.tags({ limit: 20, offset: 0 });
		console.log(error);
		if (error) return [];
		return data;
	}

	// Queries
	const { status, data, fetchStatus } = useQuery({
		queryKey: ['trending/tags', queryCacheMaxId],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		if (data.length > 0) {
			append(data, (o) => o.name);
			setMaxId((PageData.length + data.length).toString());
			resetEndOfPageFlag();
		}
	}, [fetchStatus]);

	return { fetchStatus };
}

export default useTrendingTags;
