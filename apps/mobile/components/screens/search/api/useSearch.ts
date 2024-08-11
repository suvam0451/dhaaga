import { useQuery } from '@tanstack/react-query';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useEffect, useState } from 'react';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import {
	StatusInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { DhaagaJsPostSearchDTO } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/routes/search';

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

function useSearch(type: APP_SEARCH_TYPE, dto: DhaagaJsPostSearchDTO) {
	const { client, domain, subdomain } = useActivityPubRestClientContext();
	const [Data, setData] = useState<AppSearchResults>({
		accounts: [],
		hashtags: [],
		statuses: [],
	});
	const [IsLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (dto.q !== '') {
			setIsLoading(true);
		}
	}, [dto.q]);

	async function api() {
		const { data, error } = await client.search.findPosts({
			limit: 5,
			q: dto.q,
			query: dto.q,
			untilId: dto.maxId,
			...dto,
		});
		return data;
	}

	// Queries
	const { fetchStatus, data, status } = useQuery({
		queryKey: ['search', subdomain, dto, type],
		queryFn: api,
		enabled: client !== null && dto.q !== '',
	});

	useEffect(() => {
		if (fetchStatus !== 'fetching') setIsLoading(false);

		if (status !== 'success') {
			setIsLoading(false);
			return;
		}
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

	return { Data, IsLoading, fetchStatus };
}

export default useSearch;
