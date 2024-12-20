import { useQuery } from '@tanstack/react-query';
import {
	ActivityPubAccount,
	KNOWN_SOFTWARE,
} from '@dhaaga/shared-abstraction-activitypub';
import { useEffect, useState } from 'react';
import { AppUserDto } from '../../../types/app-user.types';
import AppUserService from '../../../services/approto/app-user-service';
import BlueskyRestClient from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/bluesky';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

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
	const { client, driver, acct } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			client: o.router,
			acct: o.acct,
		})),
	);

	const [Data, setData] = useState<AppUserDto>(null);
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
			if (driver === KNOWN_SOFTWARE.BLUESKY) {
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
		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			setData(AppUserService.exportRaw(data.data, driver, acct?.server));
		} else {
			setData(AppUserService.exportRaw(data, driver, acct?.server));
		}
	}, [status, data]);

	return { Data, Error };
}

export default useGetProfile;
