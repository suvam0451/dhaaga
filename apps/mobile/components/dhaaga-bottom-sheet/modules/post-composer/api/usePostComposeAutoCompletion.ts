import {
	ActivityPubStatus,
	InstanceApi_CustomEmojiDTO,
	KNOWN_SOFTWARE,
	TagInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import ActivityPubAdapterService from '../../../../../services/activitypub-adapter.service';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useComposerContext } from './useComposerContext';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type PostComposeAutoCompletionResults = {
	accounts: UserInterface[];
	hashtags: TagInterface[];
	emojis: InstanceApi_CustomEmojiDTO[];
};

const DEFAULT: PostComposeAutoCompletionResults = {
	accounts: [],
	emojis: [],
	hashtags: [],
};

function usePostComposeAutoCompletion() {
	const { client, driver, acctManager } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			driver: o.driver,
			acctManager: o.acctManager,
		})),
	);
	const { setAutoCompletion, state } = useComposerContext();

	async function api(): Promise<PostComposeAutoCompletionResults> {
		if (!client) throw new Error('_client not initialized');

		switch (state.prompt.type) {
			case 'acct': {
				if (state.prompt.q === '') return DEFAULT;
				const { data, error } = await client.search.findUsers({
					q: state.prompt.q,
					query: state.prompt.q,
					limit: 5,
					type: 'accounts',
				});
				console.log('acct search response', state.prompt, data, error);
				if (error) {
					return DEFAULT;
				}

				// Custom Logic
				if (driver === KNOWN_SOFTWARE.BLUESKY) {
					return {
						accounts: ((data as any).data.actors as any).map((o) =>
							ActivityPubAdapterService.adaptUser(o, driver),
						),
						hashtags: [],
						emojis: [],
					};
				}

				return {
					accounts: (data as any).map((o) =>
						ActivityPubAdapterService.adaptUser(o, driver),
					),
					hashtags: [],
					emojis: [],
				};
			}
			case 'emoji': {
				if (state.prompt.q === '') return DEFAULT;
				const cache = acctManager.serverReactionCache;
				const matches = cache.filter((o) =>
					o.shortCode.includes(state.prompt.q),
				);
				return {
					accounts: [],
					hashtags: [],
					emojis: matches.slice(0, 5),
				};
			}
			default: {
				return DEFAULT;
			}
		}
	}

	console.log(state.prompt);
	const { status, data, fetchStatus } = useQuery<ActivityPubStatus>({
		queryKey: ['composer/autocomplete', state.prompt],
		queryFn: api,
		enabled:
			client !== null && client !== undefined && state.prompt.type !== 'none',
	});

	useEffect(() => {
		if (fetchStatus === 'fetching') return;
		console.log(data);
		if (status !== 'success') {
			setAutoCompletion(DEFAULT);
			return;
		}
		setAutoCompletion(data);
	}, [fetchStatus, data]);

	return;
}

export default usePostComposeAutoCompletion;
