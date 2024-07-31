import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import { ActivityPubStatus } from '@dhaaga/shared-abstraction-activitypub';
import { useEffect, useMemo } from 'react';
import { useActivitypubStatusContext } from '../../../../states/useStatus';

/**
 *
 * @param postId
 * @returns rootI the root status
 */
function useStatusContext(postId: string) {
	const { client } = useActivityPubRestClientContext();
	const { setStatusContextData, contextRootLookup, stateKey } =
		useActivitypubStatusContext();

	async function api() {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.statuses.getContext(postId);
		if (error) {
			return { ancestors: [], descendants: [] };
		}
		return data;
	}

	const { status, data, fetchStatus } = useQuery<ActivityPubStatus>({
		queryKey: ['status/details', postId],
		queryFn: api,
		enabled: client && postId !== undefined,
	});

	useEffect(() => {
		if (status === 'success') {
			setStatusContextData(data);
		}
	}, [status, fetchStatus]);

	const root = useMemo(() => {
		return contextRootLookup.current;
	}, [stateKey]);

	return { rootI: root };
}

export default useStatusContext;
