import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { KNOWN_SOFTWARE, MisskeyRestClient } from '@dhaaga/bridge';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

export type AppListDto = {
	id: string;
	label: string;
	userIds: string[]; // Misskey
	isPublic: false; // Misskey
};

export type AppAntennaDto = {
	id: string;
	label: string;
};

type ActivityPubListsListingDto = {
	lists: AppListDto[];
	antennas: AppAntennaDto[];
};

const DEFAULT = {
	lists: [],
	antennas: [],
};

/**
 * Obtain lists and antennas
 * for this account
 */
function useActivityPubLists() {
	const [Data, setData] = useState<ActivityPubListsListingDto>(DEFAULT);
	const { client, acct, driver } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			client: o.router,
			acct: o.acct,
		})),
	);

	useEffect(() => {
		setData(DEFAULT);
	}, [acct]);

	async function api() {
		if (!client) throw new Error('_client not initialized');

		let retval: ActivityPubListsListingDto = {
			lists: [],
			antennas: [],
		};

		const { data, error } = await client.lists.list();
		if (error) {
			console.log('[WARN]: error fetching lists');
		} else {
			retval.lists = data.map((o) => ({
				id: o.id,
				label: o.title || o.name,
				isPublic: o.isPublic || false,
				userIds: o.userIds || [],
			}));
		}

		if (
			[
				KNOWN_SOFTWARE.MISSKEY,
				KNOWN_SOFTWARE.FIREFISH,
				KNOWN_SOFTWARE.SHARKEY,
			].includes(driver)
		) {
			const { data: antennaData, error: antennaError } = await (
				client as MisskeyRestClient
			).lists.listAntennas();

			if (antennaError) {
				console.log('[WARN]: error fetching antennas');
			} else {
				retval.antennas = antennaData.map((o) => ({
					id: o.id,
					label: o.name,
				}));
			}
		}
		return retval;
	}

	// Queries
	const { data, status, fetchStatus } = useQuery<ActivityPubListsListingDto>({
		queryKey: ['lists', acct?.username, driver],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		setData(data);
	}, [fetchStatus]);

	return { data: Data, fetchStatus };
}

export default useActivityPubLists;
