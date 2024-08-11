import { useQuery } from '@tanstack/react-query';
import {
	ActivityPubAccount,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { useEffect, useState } from 'react';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import ActivitypubAdapterService from '../../../services/activitypub-adapter.service';

type GetProfile_Type = {
	user?: UserInterface;
	userId?: string;
	requestId: string;
};

/**
 * GET user profile
 * @param user an existing user interface
 * @param userId userId to query against
 * @param requestId to ensure recalculation on prop change
 */
function useGetProfile({ user, userId }: GetProfile_Type) {
	const { client, domain } = useActivityPubRestClientContext();
	const [Data, setData] = useState<UserInterface>(null);
	const [Error, setError] = useState(null);

	async function api() {
		if (!client || !userId) {
			return null;
		}
		const { data, error } = await client.accounts.get(userId);
		if (error) {
			setData(null);
			setError('');
			return null;
		}
		return data;
	}

	// Queries
	const { status, data } = useQuery<ActivityPubAccount>({
		queryKey: ['profile', user, userId],
		queryFn: api,
		enabled:
			client !== undefined &&
			client !== null &&
			(user === undefined || user === null),
	});

	useEffect(() => {
		if (user !== undefined && user !== null) {
			setData(user);
			return;
		}
		if (status !== 'success' || !data) return;
		setData(ActivitypubAdapterService.adaptUser(data, domain));
	}, [status, data, user]);

	return { Data, Error };
}

export default useGetProfile;
