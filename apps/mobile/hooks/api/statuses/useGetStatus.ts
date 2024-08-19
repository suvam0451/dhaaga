import { useQuery } from '@tanstack/react-query';
import { StatusInterface } from '@dhaaga/shared-abstraction-activitypub';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import ActivityPubAdapterService from '../../../services/activitypub-adapter.service';
import { useEffect, useState } from 'react';

function useGetStatus(id: string) {
	const [Data, setData] = useState<StatusInterface>(null);
	const { client, domain } = useActivityPubRestClientContext();

	async function api() {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.statuses.get(id);
		if (error) return null;
		return ActivityPubAdapterService.adaptStatus(data, domain);
	}

	const { status, data, fetchStatus, refetch } = useQuery<StatusInterface>({
		queryKey: ['status', id],
		queryFn: api,
		enabled: client && id !== undefined,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		setData(data);
	}, [fetchStatus]);

	return { data: Data, loading: fetchStatus == 'fetching', refetch };
}

export default useGetStatus;
