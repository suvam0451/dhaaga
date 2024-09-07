import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';

function useMyProfile() {
	const { client, me, domain } = useActivityPubRestClientContext();
	const [Data, setData] = useState(
		ActivityPubAdapterService.adaptUser(null, null),
	);
	const userId = me?.getId();

	async function api() {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.accounts.get(me.getId());
		if (error) {
			return ActivityPubAdapterService.adaptUser(null, null);
		}
		return ActivityPubAdapterService.adaptUser(data, domain);
	}

	// Queries
	const { data, status, fetchStatus } = useQuery({
		queryKey: ['accounts', userId],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (status !== 'success' || fetchStatus === 'fetching' || !data) return;
		setData(data);
	}, [fetchStatus]);

	return { Data, fetchStatus };
}

export default useMyProfile;
