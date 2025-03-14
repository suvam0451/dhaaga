import useGetPostInterface from './useGetPostInterface';
import { useEffect, useReducer } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	DriverService,
	KNOWN_SOFTWARE,
	PostTargetInterface,
} from '@dhaaga/bridge';
import statusContextReducer, {
	defaultAppStatusContext,
	STATUS_CONTEXT_REDUCER_ACTION,
} from './statusContextReducer';
import { PostParser } from '@dhaaga/bridge';
import {
	useAppAcct,
	useAppApiClient,
} from '../../utility/global-state-extractors';

/**
 * Get the context chain for a given status id
 * @param id
 */
function useGetStatusCtxInterface(id: string) {
	const { client, driver } = useAppApiClient();
	const { acct } = useAppAcct();
	const { data: postI } = useGetPostInterface(id);
	const [Data, dispatch] = useReducer(
		statusContextReducer,
		defaultAppStatusContext,
	);

	async function api() {
		const { data, error } = await client.statuses.getContext(id);
		if (error) return null;

		// handled by context solver, instead
		if (DriverService.supportsAtProto(driver)) return data as any;

		return {
			ancestors: PostParser.rawToInterface<unknown[]>(
				(data as any).ancestors,
				driver,
			),
			descendants: PostParser.rawToInterface<unknown[]>(
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
		ancestors: PostTargetInterface[];
		descendants: PostTargetInterface[];
	}>({
		queryKey: ['status/view', id],
		queryFn: api,
		enabled: !!client && id !== undefined,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;

		/**
		 * Handle AT Protocol
		 */
		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			dispatch({
				type: STATUS_CONTEXT_REDUCER_ACTION.INIT_ATPROTO,
				payload: {
					resp: ctxData,
					domain: driver,
					subdomain: acct?.server,
				},
			});
		}

		/**
		 * 	Handle ActivityPub Protocol
		 * 	- postI is required by Mastodon specifically
		 */
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
	}, [postI, fetchStatus]);

	return { Data, dispatch, refetch };
}

export default useGetStatusCtxInterface;
