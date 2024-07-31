import { useQuery } from '@tanstack/react-query';
import { ActivityPubAccount } from '@dhaaga/shared-abstraction-activitypub';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useEffect, useState } from 'react';

function useProfile(userId: string) {
	const { client } = useActivityPubRestClientContext();
	const [Data, setData] = useState(null);
	const [Error, setError] = useState(null);

	async function api() {
		if (!client) return null;
		const { data, error } = await client.accounts.get(userId);
		if (error) {
			setError('');
			return null;
		}
		return data;
	}

	// Queries
	const { status, data } = useQuery<ActivityPubAccount>({
		queryKey: ['user', userId],
		queryFn: api,
		enabled: client !== undefined && client !== null,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		setData(data);
	}, [status]);

	return { Data, Error };
}

export default useProfile;
