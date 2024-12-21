import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import { AppUserObject } from '../../../../types/app-user.types';
import AppUserService from '../../../../services/approto/app-user-service';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function useMyProfile() {
	const { client, me, acct, driver, db } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			me: o.me,
			driver: o.driver,
			acct: o.acct,
			db: o.db,
		})),
	);
	const [Data, setData] = useState<AppUserObject>(null);

	async function api() {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.accounts.get(me?.id);
		if (error) {
			return ActivityPubAdapterService.adaptUser(null, null);
		}
		return ActivityPubAdapterService.adaptUser(data, driver);
	}

	// Queries
	const { data, status, fetchStatus } = useQuery({
		queryKey: ['accounts', me?.id],
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
