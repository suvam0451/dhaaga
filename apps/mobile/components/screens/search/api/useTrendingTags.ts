import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useScrollOnReveal } from '#/states/useScrollOnReveal';
import { useAppApiClient } from '#/hooks/utility/global-state-extractors';

function useTrendingTags() {
	const { client } = useAppApiClient();

	const { resetEndOfPageFlag } = useScrollOnReveal();

	async function api() {
		if (!client) return;

		return client.trends.tags({ limit: 20, offset: 0 });
	}

	// Queries
	const { status, data, fetchStatus } = useQuery({
		queryKey: ['trending/tags'],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		if (data.length > 0) {
			// append(data, (o) => o.name);
			// setMaxId((PageData.length + data.length).toString());
			resetEndOfPageFlag();
		}
	}, [fetchStatus]);

	return { fetchStatus };
}

export default useTrendingTags;
