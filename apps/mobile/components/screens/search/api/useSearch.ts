import { useQuery } from '@tanstack/react-query';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useEffect, useState } from 'react';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import {
	StatusInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';

export enum APP_SEARCH_TYPE {
	ALL,
	POSTS,
	USERS,
	LINKS,
	HASHTAGS,
}

type AppSearchResults = {
	accounts: UserInterface[];
	statuses: StatusInterface[];
	hashtags: any[];
};

function useSearch(q: string, type: APP_SEARCH_TYPE) {
	const { client, domain } = useActivityPubRestClientContext();
	const [Data, setData] = useState<AppSearchResults>({
		accounts: [],
		hashtags: [],
		statuses: [],
	});
	const [IsLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
	}, [q, type]);

	async function api() {
		const { data, error } = await client.search.findPosts({
			limit: 5,
			q,
			query: q,
		});
		return data;
	}

	// Queries
	const { fetchStatus, data, status } = useQuery({
		queryKey: ['search', q, type],
		queryFn: api,
		enabled: client !== null && q !== '',
	});

	useEffect(() => {
		if (status !== 'success') return;
		switch (type) {
			case APP_SEARCH_TYPE.POSTS: {
				setData({
					accounts: [],
					statuses: ActivityPubAdapterService.adaptManyStatuses(data, domain),
					hashtags: [],
				});
			}
		}
		setIsLoading(false);
	}, [fetchStatus]);

	return { Data, IsLoading };
}

export default useSearch;
