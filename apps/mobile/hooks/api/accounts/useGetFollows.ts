import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import {
	KNOWN_SOFTWARE,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { AppBskyGraphGetFollows } from '@atproto/api';
import ActivityPubAdapterService from '../../../services/activitypub-adapter.service';

function useGetFollows(id: string, cursor?: string | null) {
	const [Data, setData] = useState<UserInterface[]>([]);
	const maxId = useRef<string>(null);

	const { client, primaryAcct, domain } = useActivityPubRestClientContext();

	async function api() {
		const { data, error } = await client.accounts.followings({
			id,
			limit: 20,
			maxId: cursor,
			allowPartial: false,
		});
		if (error) return null;
		return data;
	}

	// Queries
	const { status, data, refetch, fetchStatus } = useQuery({
		queryKey: ['follows', id, cursor, primaryAcct._id],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success' || data === null)
			return;
		switch (domain) {
			case KNOWN_SOFTWARE.BLUESKY: {
				const _data = (data as AppBskyGraphGetFollows.Response).data;
				maxId.current = _data.cursor;

				setData(
					ActivityPubAdapterService.adaptManyUsers(_data.follows, domain),
				);
				break;
			}
			default: {
				setData(ActivityPubAdapterService.adaptManyUsers(data as any, domain));
			}
		}
	}, [fetchStatus]);

	return { Data, refetch };
}

export default useGetFollows;
