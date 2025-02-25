import { useQuery } from '@tanstack/react-query';
import { DhaagaJsPostSearchDTO } from '@dhaaga/bridge/dist/adapters/_client/_router/routes/search';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { useAppApiClient } from '../../../hooks/utility/global-state-extractors';
import {
	defaultAppSearchResults,
	DiscoverTabSearchResultType,
} from '../reducers/discover-tab.reducer';
import { UserParser, PostParser } from '@dhaaga/bridge';

export enum APP_SEARCH_TYPE {
	POSTS,
	USERS,
	LINKS,
	HASHTAGS,
}

/**
 * Search for anything
 * @param type
 * @param dto
 */
function useSearch(type: APP_SEARCH_TYPE, dto: DhaagaJsPostSearchDTO) {
	const { client, server, driver } = useAppApiClient();

	async function api(): Promise<DiscoverTabSearchResultType> {
		switch (type) {
			case APP_SEARCH_TYPE.POSTS: {
				// Akko-gang, nani da fukk? Y your maxId no work? 😭
				// et tu, sharks 🤨?
				const FALLBACK_TO_OFFSET = [
					KNOWN_SOFTWARE.AKKOMA, // KNOWN_SOFTWARE.SHARKEY,
				].includes(driver);
				const offset = FALLBACK_TO_OFFSET
					? dto.maxId
						? parseInt(dto.maxId)
						: undefined
					: undefined;
				const maxId = FALLBACK_TO_OFFSET ? undefined : dto.maxId;
				const untilId = FALLBACK_TO_OFFSET ? undefined : dto.maxId;

				const { data, error } = await client.search.findPosts({
					...dto,
					q: dto.q,
					query: dto.q,
					type: 'statuses',
					maxId,
					untilId,
					offset,
				});
				if (error) {
					console.log('[WARN]: error searching for posts', error.message);
					throw new Error(error.message);
				}

				return {
					...defaultAppSearchResults,
					posts: PostParser.parse<unknown[]>(data as any, driver, server),
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
				if (error) throw new Error(error.message);
				return {
					...defaultAppSearchResults,
					users: UserParser.parse<unknown[]>(data as any[], driver, server),
				};
			}
			default:
				throw new Error('[E_Not_Implemented]');
		}
	}

	return useQuery<DiscoverTabSearchResultType>({
		queryKey: ['search', server, dto, type],
		queryFn: api,
		enabled: client !== null && !!dto.q,
		initialData: defaultAppSearchResults,
	});
}

export default useSearch;
