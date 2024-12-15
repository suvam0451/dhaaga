import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import { AppUser } from '../../../../types/app-user.types';
import AppUserService from '../../../../services/approto/app-user-service';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function useMyProfile() {
	const { client, me, acct, driver } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			me: o.me,
			driver: o.driver,
			acct: o.acct,
		})),
	);
	const [Data, setData] = useState<AppUser>(null);
	const userId = me?.getId();

	async function api() {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.accounts.get(me.getId());
		if (error) {
			return ActivityPubAdapterService.adaptUser(null, null);
		}
		return ActivityPubAdapterService.adaptUser(data, driver);
	}

	// Queries
	const { data, status, fetchStatus } = useQuery({
		queryKey: ['accounts', userId],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (status !== 'success' || fetchStatus === 'fetching' || !data) return;
		setData(AppUserService.export(data, driver, acct?.server));
	}, [fetchStatus]);

	return { Data, fetchStatus };
}

export default useMyProfile;
