import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import {
	ActivityPubStatus,
	TagInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import ActivityPubAdapterService from '../../../../../services/activitypub-adapter.service';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useComposerContext } from './useComposerContext';
import { EmojiService } from '../../../../../services/emoji.service';
import { useGlobalMmkvContext } from '../../../../../states/useGlobalMMkvCache';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';

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
	const { client, domain, subdomain } = useActivityPubRestClientContext();
	const { setAutoCompletion, autoCompletionPrompt } = useComposerContext();
	const { globalDb } = useGlobalMmkvContext();

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
				return {
					accounts: data.map((o) =>
						ActivityPubAdapterService.adaptUser(o, domain),
					),
					hashtags: [],
					emojis: [],
				};
			}
			case 'emoji': {
				if (autoCompletionPrompt.q === '') return DEFAULT;
				const cache = EmojiService.getEmojiCache(globalDb, subdomain);
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
