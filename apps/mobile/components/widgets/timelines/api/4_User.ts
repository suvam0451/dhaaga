import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import {
	MastoAccount,
	MegaAccount,
} from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_interface';
import { Endpoints } from 'misskey-js';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppBskyActorSearchActorsTypeahead } from '@atproto/api';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';

function TimelineWidgetUserApi(q: string) {
	const { client, acct, driver } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			acct: o.acct,
			driver: o.driver,
		})),
	);
	const username = acct?.username;

	async function api() {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.search.findUsers({
			type: 'accounts',
			limit: 5,
			q,
			query: q,
		});
		if (error) return [];
		return data;
	}

	// Queries
	const { fetchStatus, data, status } = useQuery<
		| MastoAccount[]
		| Endpoints['users/search']['res']
		| MegaAccount[]
		| AppBskyActorSearchActorsTypeahead.Response
	>({
		queryKey: [username, acct?.server, q],
		queryFn: api,
		enabled: client !== null && q !== '',
	});

	const transformedData = useMemo(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return [];
		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			return ActivityPubAdapterService.adaptManyUsers(
				(data as AppBskyActorSearchActorsTypeahead.Response).data?.actors,
				driver,
			);
		}
		return (
			(data as any)?.map((o) =>
				ActivityPubAdapterService.adaptUser(o, driver),
			) || []
		);
	}, [fetchStatus]);

	return { transformedData };
}

export default TimelineWidgetUserApi;
