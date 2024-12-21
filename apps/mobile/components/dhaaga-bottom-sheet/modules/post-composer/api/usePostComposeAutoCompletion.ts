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
	const { setAutoCompletion, autoCompletionPrompt } = useComposerContext();

	async function api(): Promise<PostComposeAutoCompletionResults> {
		if (!client) throw new Error('_client not initialized');

		switch (autoCompletionPrompt.type) {
			case 'acct': {
				if (autoCompletionPrompt.q === '') return DEFAULT;
				const { data, error } = await client.search.findUsers({
					q: autoCompletionPrompt.q,
					query: autoCompletionPrompt.q,
					limit: 5,
					type: 'accounts',
				});
				if (error) return DEFAULT;

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
				if (autoCompletionPrompt.q === '') return DEFAULT;
				const cache = acctManager.serverReactionCache;
				const matches = cache.filter((o) =>
					o.shortCode.includes(autoCompletionPrompt.q),
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

	const { status, data, fetchStatus } = useQuery<ActivityPubStatus>({
		queryKey: ['composer/autocomplete', autoCompletionPrompt],
		queryFn: api,
		enabled:
			client !== null &&
			client !== undefined &&
			autoCompletionPrompt.type !== 'none',
	});

	useEffect(() => {
		if (fetchStatus === 'fetching') return;
		if (status !== 'success') {
			setAutoCompletion(DEFAULT);
			return;
		}
		setAutoCompletion(data);
	}, [fetchStatus]);

	return;
}

export default usePostComposeAutoCompletion;
