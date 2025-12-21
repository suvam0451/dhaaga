import { useAccountManager, useAppApiClient } from '#/states/global/hooks';
import {
	AutoFillPromptType,
	AutoFillResultsType,
} from '../types/composer.types';
import { useQuery } from '@tanstack/react-query';
import { AtprotoApiAdapter, DriverService, UserParser } from '@dhaaga/bridge';

const DEFAULT: AutoFillResultsType = {
	accounts: [],
	emojis: [],
	hashtags: [],
};

function useSuggestionsApi(prompt: AutoFillPromptType) {
	const { client, driver, server } = useAppApiClient();
	const { acctManager } = useAccountManager();

	async function api() {
		switch (prompt.type) {
			case 'acct': {
				const data = DriverService.supportsAtProto(driver)
					? await (client as AtprotoApiAdapter).search.findUsersTypeAhead({
							q: prompt.q,
							query: prompt.q,
							limit: 5,
							type: 'accounts',
						})
					: await client.search.findUsers({
							q: prompt.q,
							query: prompt.q,
							limit: 5,
							type: 'accounts',
						});

				return {
					...DEFAULT,
					accounts: UserParser.parse<unknown[]>(data.data, driver, server),
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
	}

	return useQuery<AutoFillResultsType>({
		queryKey: ['composer/suggestions', prompt],
		queryFn: api,
		enabled: !!client && prompt.type !== 'none' && !!prompt.q,
		initialData: DEFAULT,
	});
}

export default useSuggestionsApi;
