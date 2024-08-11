import { useQuery } from '@tanstack/react-query';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import {
	StatusInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { DhaagaJsPostSearchDTO } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/routes/search';
import { useEffect, useState } from 'react';

export enum APP_SEARCH_TYPE {
	POSTS,
	USERS,
	LINKS,
	HASHTAGS,
}

type AppSearchResults = {
	accounts: UserInterface[];
	statuses: StatusInterface[];
	hashtags: any[];
	links: any[];
};

const DEFAULT_RESPONSE: AppSearchResults = {
	accounts: [],
	statuses: [],
	hashtags: [],
	links: [],
};

/**
 * Search for anything
 * @param type
 * @param dto
 */
function useSearch(type: APP_SEARCH_TYPE, dto: DhaagaJsPostSearchDTO) {
	const { client, domain, subdomain } = useActivityPubRestClientContext();
	const [Data, setData] = useState<AppSearchResults>(DEFAULT_RESPONSE);

	async function api() {
		try {
			switch (type) {
				case APP_SEARCH_TYPE.POSTS: {
					const { data, error } = await client.search.findPosts({
						...dto,
						q: dto.q,
						query: dto.q,
						untilId: dto.maxId,
						type: 'statuses',
					});
					if (error) {
						console.log(error);
						return DEFAULT_RESPONSE;
					}

					return {
						...DEFAULT_RESPONSE,
						statuses: ActivityPubAdapterService.adaptManyStatuses(data, domain),
					};
				}
				case APP_SEARCH_TYPE.USERS: {
					const { data, error } = await client.search.findUsers({
						...dto,
						origin: 'combined',
						q: dto.q,
						query: dto.q,
						untilId: dto.maxId,
					});
					if (error) {
						console.log(error);
						return DEFAULT_RESPONSE;
					}
					return {
						...DEFAULT_RESPONSE,
						accounts: data.map((o) =>
							ActivityPubAdapterService.adaptUser(o, domain),
						),
					};
				}
				default: {
					return DEFAULT_RESPONSE;
				}
			}
		} catch (e) {
			console.log(e);
			return DEFAULT_RESPONSE;
		}
	}

	// Queries
	const { fetchStatus, data, status } = useQuery<AppSearchResults>({
		queryKey: ['search', subdomain, dto, type],
		queryFn: api,
		enabled: client !== null && dto.q !== '',
	});

	/**
	 * Update forwarded state
	 */
	useEffect(() => {
		if (status !== 'success') {
			setData(DEFAULT_RESPONSE);
			return;
		}
		setData(data);
	}, [fetchStatus]);

	return {
		Data,
		IsLoading: fetchStatus === 'fetching',
		fetchStatus,
		status,
	};
}

export default useSearch;
