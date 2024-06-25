import { useQuery } from '@tanstack/react-query';
import { mastodon } from '@dhaaga/shared-provider-mastodon/src';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useMemo } from 'react';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';

function TimelineWidgetUserApi(q: string) {
	const { client, primaryAcct } = useActivityPubRestClientContext();
	const username = primaryAcct.username;
	const domain = primaryAcct.domain;
	const subdomain = primaryAcct.subdomain;

	async function api() {
		if (!client) throw new Error('_client not initialized');
		return client.search(q, { type: 'accounts', limit: 5, following: false });
	}

	// Queries
	const queryResults = useQuery<mastodon.v2.Search>({
		queryKey: ['search/user', username, subdomain, q],
		queryFn: api,
		enabled: client !== null && q !== '',
	});

	const transformedData = useMemo(() => {
		if (queryResults.fetchStatus === 'fetching') return [];
		if (queryResults.status !== 'success') return [];
		return (
			queryResults?.data?.accounts?.map((o) =>
				ActivityPubAdapterService.adaptUser(o, domain),
			) || []
		);
	}, [queryResults.fetchStatus]);

	return { ...queryResults, transformedData };
}

export default TimelineWidgetUserApi;
