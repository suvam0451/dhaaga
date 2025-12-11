import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { KNOWN_SOFTWARE, MisskeyApiAdapter } from '@dhaaga/bridge';
import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';

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
	const { client, driver } = useAppApiClient();
	const { acct } = useActiveUserSession();

	useEffect(() => {
		setData(DEFAULT);
	}, [acct]);

	async function api() {
		if (!client) throw new Error('_client not initialized');

		let retval: ActivityPubListsListingDto = {
			lists: [],
			antennas: [],
		};

		const data = await client.lists.list();
		retval.lists = data.map((o) => ({
			id: o.id,
			label: o.title || o.name,
			isPublic: o.isPublic || false,
			userIds: o.userIds || [],
		}));

		if (
			[
				KNOWN_SOFTWARE.MISSKEY,
				KNOWN_SOFTWARE.FIREFISH,
				KNOWN_SOFTWARE.SHARKEY,
			].includes(driver)
		) {
			const antennaData = await (
				client as MisskeyApiAdapter
			).lists.listAntennas();

			retval.antennas = antennaData.map((o) => ({
				id: o.id,
				label: o.name,
			}));
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
