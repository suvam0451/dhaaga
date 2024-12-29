import {
	ActivityPubStatus,
	InstanceApi_CustomEmojiDTO,
	KNOWN_SOFTWARE,
	TagInterface,
	UserInterface,
} from '@dhaaga/bridge';
import ActivityPubAdapterService from '../../../../../services/activitypub-adapter.service';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import {
	PostComposerDispatchType,
	PostComposerReducerActionType,
	PostComposerReducerStateType,
} from '../../../../../states/reducers/post-composer.reducer';

// TODO: convert interfaces to objects
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

function usePostComposeAutoCompletion(
	state: PostComposerReducerStateType,
	dispatch: PostComposerDispatchType,
) {
	const { client, driver, acctManager } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			driver: o.driver,
			acctManager: o.acctManager,
		})),
	);

	async function api(): Promise<PostComposeAutoCompletionResults> {
		if (!client) throw new Error('_client not initialized');

		if (state.prompt.q === '') throw new Error('E_Empty_Prompt');

		switch (state.prompt.type) {
			case 'acct': {
				const { data, error } = await client.search.findUsers({
					q: state.prompt.q,
					query: state.prompt.q,
					limit: 5,
					type: 'accounts',
				});
				if (error) throw new Error(error.message);

				// Custom Logic
				if (driver === KNOWN_SOFTWARE.BLUESKY) {
					return {
						...DEFAULT,
						accounts: ((data as any).data.actors as any).map((o) =>
							ActivityPubAdapterService.adaptUser(o, driver),
						),
					};
				}

				return {
					...DEFAULT,
					accounts: (data as any).map((o) =>
						ActivityPubAdapterService.adaptUser(o, driver),
					),
				};
			}
			case 'emoji': {
				acctManager.loadReactions();
				const cache = acctManager.serverReactionCache;
				const matches = cache.filter((o) =>
					o.shortCode.includes(state.prompt.q),
				);
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

	const { status, data, fetchStatus } = useQuery<ActivityPubStatus>({
		queryKey: ['composer/autocomplete', state.prompt],
		queryFn: api,
		enabled:
			client !== null && client !== undefined && state.prompt.type !== 'none',
	});

	useEffect(() => {
		if (fetchStatus === 'fetching') return;
		if (status !== 'success') {
			dispatch({ type: PostComposerReducerActionType.CLEAR_SUGGESTION });
			return;
		}
		dispatch({
			type: PostComposerReducerActionType.SET_SUGGESTION,
			payload: data,
		});
	}, [fetchStatus, data]);
}

export default usePostComposeAutoCompletion;
