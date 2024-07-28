import { useQuery } from '@tanstack/react-query';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useMemo } from 'react';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import {
	MastoAccount,
	MegaAccount,
} from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_interface';
import { Endpoints } from 'misskey-js';

function TimelineWidgetUserApi(q: string) {
	const { client, primaryAcct } = useActivityPubRestClientContext();
	const username = primaryAcct.username;
	const domain = primaryAcct.domain;
	const subdomain = primaryAcct.subdomain;

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
		MastoAccount[] | Endpoints['users/search']['res'] | MegaAccount[]
	>({
		queryKey: [username, subdomain, q],
		queryFn: api,
		enabled: client !== null && q !== '',
	});

	const transformedData = useMemo(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return [];
		return (
			data?.map((o) => ActivityPubAdapterService.adaptUser(o, domain)) || []
		);
	}, [fetchStatus]);

	return { transformedData };
}

export default TimelineWidgetUserApi;
