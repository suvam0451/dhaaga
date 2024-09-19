import { useQuery } from '@tanstack/react-query';
import {
	ActivityPubAccount,
	KNOWN_SOFTWARE,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { useEffect, useState } from 'react';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { AppUser } from '../../../types/app-user.types';
import AppUserService from '../../../services/approto/app-user-service';

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
	const { client, domain, subdomain } = useActivityPubRestClientContext();
	const [Data, setData] = useState<AppUser>(null);
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
		queryKey: ['profile', user?.getId(), userId],
		queryFn: api,
		enabled:
			client !== undefined &&
			client !== null &&
			(user === undefined || user === null),
	});

	useEffect(() => {
		if (user !== undefined && user !== null) {
			setData(AppUserService.export(user, domain, subdomain));
			return;
		}
		if (status !== 'success' || !data) return;
		if (domain === KNOWN_SOFTWARE.BLUESKY) {
			setData(AppUserService.exportRaw(data.data, domain, subdomain));
		} else {
			setData(AppUserService.exportRaw(data, domain, subdomain));
		}
	}, [status, data, user]);

	return { Data, Error };
}

export default useGetProfile;
