import { useQuery } from '@tanstack/react-query';
import {
	ActivityPubAccount,
	KNOWN_SOFTWARE,
} from '@dhaaga/shared-abstraction-activitypub';
import { useEffect, useState } from 'react';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { AppUser } from '../../../types/app-user.types';
import AppUserService from '../../../services/approto/app-user-service';
import BlueskyRestClient from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/bluesky';

type Type = {
	userId?: string;
	requestId: string;
	handle?: string;
};

/**
 * GET user profile
 * @param user an existing user interface
 * @param userId userId to query against
 */
function useGetProfile({ userId, handle }: Type) {
	const { client, domain, subdomain } = useActivityPubRestClientContext();
	const [Data, setData] = useState<AppUser>(null);
	const [Error, setError] = useState(null);

	async function api() {
		if (!client || (!userId && !handle)) {
			return null;
		}
		if (userId) {
			const { data, error } = await client.accounts.get(userId);
			if (error) {
				setData(null);
				setError('');
				return null;
			}
			return data;
		} else if (handle) {
			if (domain === KNOWN_SOFTWARE.BLUESKY) {
				const { data: didData, error: didError } = await (
					client as BlueskyRestClient
				).accounts.getDid(handle);
				// console.log(didData, didError);
				if (didError) return null;
				const { data, error } = await client.accounts.get(didData.data.did);
				console.log(data, error);
				return data;
			}
		}
	}

	// Queries
	const { status, data } = useQuery<ActivityPubAccount>({
		queryKey: ['profile', userId, handle],
		queryFn: api,
		enabled: client !== undefined && client !== null,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		if (domain === KNOWN_SOFTWARE.BLUESKY) {
			setData(AppUserService.exportRaw(data.data, domain, subdomain));
		} else {
			setData(AppUserService.exportRaw(data, domain, subdomain));
		}
	}, [status, data]);

	return { Data, Error };
}

export default useGetProfile;
