import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import useGetStatus from './useGetStatus';
import { useEffect, useReducer } from 'react';
import { useQuery } from '@tanstack/react-query';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import ActivityPubAdapterService from '../../../services/activitypub-adapter.service';
import statusContextReducer, {
	defaultAppStatusContext,
	STATUS_CONTEXT_REDUCER_ACTION,
} from './statusContextReducer';

/**
 * Get the context chain for a given status id
 * @param postId
 */
function useGetStatusContext(postId: string) {
	const { client, domain, subdomain } = useActivityPubRestClientContext();

	const { data: PostData } = useGetStatus(postId);

	const [Data, dispatch] = useReducer(
		statusContextReducer,
		defaultAppStatusContext,
	);

	async function api() {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.statuses.getContext(postId);
		if (error) {
			return null;
		}

		if (domain === KNOWN_SOFTWARE.BLUESKY) {
			return data;
		}

		return {
			ancestors: ActivityPubAdapterService.adaptManyStatuses(
				(data as any).ancestors,
				domain,
			),
			descendants: ActivityPubAdapterService.adaptManyStatuses(
				(data as any).descendants,
				domain,
			),
		};
	}

	const { data, status, fetchStatus, refetch } = useQuery({
		queryKey: ['status/details', postId],
		queryFn: api,
		enabled: client && postId !== undefined,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;

		if (domain === KNOWN_SOFTWARE.BLUESKY) {
			dispatch({
				type: STATUS_CONTEXT_REDUCER_ACTION.INIT_ATPROTO,
				payload: {
					resp: data,
					domain,
					subdomain,
				},
			});
		} else {
			// Required by Mastodon specifically
			if (!PostData) return;

			dispatch({
				type: STATUS_CONTEXT_REDUCER_ACTION.INIT,
				payload: {
					source: PostData,
					ancestors: (data as any).ancestors,
					descendants: (data as any).descendants,
					domain,
					subdomain,
				},
			});
		}
	}, [PostData, fetchStatus, dispatch]);

	return { Data, dispatch, refetch };
}

export default useGetStatusContext;
