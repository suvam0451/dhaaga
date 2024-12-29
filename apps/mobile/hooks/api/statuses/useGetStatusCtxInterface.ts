import useGetPostInterface from './useGetPostInterface';
import { useEffect, useReducer } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	KNOWN_SOFTWARE,
	StatusInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import statusContextReducer, {
	defaultAppStatusContext,
	STATUS_CONTEXT_REDUCER_ACTION,
} from './statusContextReducer';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../states/_global';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';

/**
 * Get the context chain for a given status id
 * @param id
 */
function useGetStatusCtxInterface(id: string) {
	const { client, driver, acct } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			client: o.router,
			acct: o.acct,
		})),
	);

	const { data: postI } = useGetPostInterface(id);

	const [Data, dispatch] = useReducer(
		statusContextReducer,
		defaultAppStatusContext,
	);

	async function api() {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.statuses.getContext(id);
		if (error) {
			console.log(error);
			return null;
		}

		if (driver === KNOWN_SOFTWARE.BLUESKY) return data as any;

		return {
			ancestors: PostMiddleware.rawToInterface<unknown[]>(
				(data as any).ancestors,
				driver,
			),
			descendants: PostMiddleware.rawToInterface<unknown[]>(
				(data as any).descendants,
				driver,
			),
		};
	}

	const {
		data: ctxData,
		status,
		fetchStatus,
		refetch,
	} = useQuery<{
		ancestors: StatusInterface[];
		descendants: StatusInterface[];
	}>({
		queryKey: ['status/details', id],
		queryFn: api,
		enabled: client && id !== undefined,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;

		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			dispatch({
				type: STATUS_CONTEXT_REDUCER_ACTION.INIT_ATPROTO,
				payload: {
					resp: ctxData,
					driver,
					subdomain: acct?.server,
				},
			});
		} else {
			// Required by Mastodon specifically
			if (!postI) return;

			dispatch({
				type: STATUS_CONTEXT_REDUCER_ACTION.INIT,
				payload: {
					source: postI,
					ancestors: (ctxData as any).ancestors,
					descendants: (ctxData as any).descendants,
					driver,
					server: acct?.server,
				},
			});
		}
	}, [postI, fetchStatus, dispatch]);

	return { Data, dispatch, refetch };
}

export default useGetStatusCtxInterface;
