import { useEffect, useReducer } from 'react';
import { useQueries } from '@tanstack/react-query';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import statusContextReducer, {
	defaultAppStatusContext,
	STATUS_CONTEXT_REDUCER_ACTION,
} from './statusContextReducer';
import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';
import {
	postDetailsInterfaceQueryOpts,
	postHierarchyQueryOpts,
} from '@dhaaga/react';

/**
 * Get the context chain for a given status id
 * @param id
 */
function useGetStatusCtxInterface(id: string) {
	const { client, driver } = useAppApiClient();
	const { acct } = useActiveUserSession();
	const [postDetailResult, postHierarchyResult] = useQueries({
		queries: [
			postDetailsInterfaceQueryOpts(client, driver, id),
			postHierarchyQueryOpts(client, driver, id),
		],
	});
	const [Data, dispatch] = useReducer(
		statusContextReducer,
		defaultAppStatusContext,
	);

	useEffect(() => {
		if (
			postHierarchyResult.fetchStatus === 'fetching' ||
			postHierarchyResult.status !== 'success'
		)
			return;

		/**
		 * Handle AT Protocol
		 */
		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			dispatch({
				type: STATUS_CONTEXT_REDUCER_ACTION.INIT_ATPROTO,
				payload: {
					resp: postHierarchyResult.data,
					domain: driver,
					subdomain: acct?.server,
				},
			});
		}

		/**
		 * 	Handle ActivityPub Protocol
		 * 	- postI is required by Mastodon specifically
		 */
		if (!postDetailResult.data) return;

		dispatch({
			type: STATUS_CONTEXT_REDUCER_ACTION.INIT,
			payload: {
				source: postDetailResult.data,
				ancestors: postHierarchyResult.data.ancestors,
				descendants: postHierarchyResult.data.descendants,
				driver,
				server: acct?.server,
			},
		});
	}, [postDetailResult.data, postHierarchyResult.fetchStatus]);

	return { Data, dispatch, refetch: postHierarchyResult.refetch };
}

export default useGetStatusCtxInterface;
