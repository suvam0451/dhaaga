import {
	useAccountManager,
	useAppApiClient,
} from '../../../hooks/utility/global-state-extractors';
import {
	AutoFillPromptType,
	AutoFillResultsType,
} from '../types/composer.types';
import { useQuery } from '@tanstack/react-query';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { UserMiddleware } from '../../../services/middlewares/user.middleware';

const DEFAULT: AutoFillResultsType = {
	accounts: [],
	emojis: [],
	hashtags: [],
};

function useSuggestionsApi(prompt: AutoFillPromptType) {
	const { client, driver, server } = useAppApiClient();
	const { acctManager } = useAccountManager();

	return useQuery<AutoFillResultsType>({
		queryKey: ['composer/suggestions', prompt],
		queryFn: async () => {
			if (prompt.q === '') throw new Error('E_Empty_Prompt');

			switch (prompt.type) {
				case 'acct': {
					const { data, error } = await client.search.findUsers({
						q: prompt.q,
						query: prompt.q,
						limit: 5,
						type: 'accounts',
					});
					if (error) throw new Error(error.message);

					// Custom Logic
					if (driver === KNOWN_SOFTWARE.BLUESKY) {
						return {
							...DEFAULT,
							accounts: UserMiddleware.deserialize<unknown[]>(
								(data as any).data.actors as any[],
								driver,
								server,
							),
						};
					}

					return {
						...DEFAULT,
						accounts: UserMiddleware.deserialize<unknown[]>(
							data as any[],
							driver,
							server,
						),
					};
				}
				case 'emoji': {
					acctManager.loadReactions();
					const cache = acctManager.serverReactionCache;
					const matches = cache.filter((o) => o.shortCode.includes(prompt.q));
					return {
						...DEFAULT,
						emojis: matches.slice(0, 5),
					};
				}
				default: {
					throw new Error('E_Invalid_Prompt');
				}
			}
		},
		enabled: !!client && prompt.type !== 'none',
		initialData: DEFAULT,
	});
}

export default useSuggestionsApi;
