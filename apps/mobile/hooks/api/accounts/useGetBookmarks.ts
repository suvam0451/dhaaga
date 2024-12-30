import { BookmarkGetQueryDTO } from '@dhaaga/bridge/dist/adapters/_client/_router/routes/bookmarks';
import { useQuery } from '@tanstack/react-query';
import ActivityPubAdapterService from '../../../services/activitypub-adapter.service';
import { StatusInterface, KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { useEffect, useState } from 'react';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function useGetBookmarks(query: BookmarkGetQueryDTO) {
	const { client, acct, driver } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			client: o.router,
			driver: o.driver,
		})),
	);

	const [Data, setData] = useState<{
		data: StatusInterface[];
		minId?: string;
		maxId?: string;
	}>({
		data: [],
		minId: undefined,
		maxId: undefined,
	});

	async function api() {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.accounts.bookmarks({
			limit: 20,
			maxId: query.maxId === null ? undefined : query.maxId,
		});
		if (error) {
			return { data: [], maxId: null, minId: null };
		}
		if (
			[
				KNOWN_SOFTWARE.MASTODON,
				KNOWN_SOFTWARE.PLEROMA,
				KNOWN_SOFTWARE.AKKOMA,
			].includes(driver as any)
		) {
			return {
				data: ActivityPubAdapterService.adaptManyStatuses(data.data, driver),
				maxId: data.maxId,
				minId: data.minId,
			};
		} else {
			return {
				data: ActivityPubAdapterService.adaptManyStatuses(
					data.data.map((o) => o.note),
					driver,
				),
				maxId: data.maxId,
				minId: data.minId,
			};
		}
	}

	// Queries
	const { status, data, refetch, fetchStatus } = useQuery<{
		data: StatusInterface[];
		minId?: string;
		maxId?: string;
	}>({
		queryKey: ['bookmarks', query.maxId, acct?.id],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		setData(data);
	}, [fetchStatus]);

	return {
		data: Data,
		refetch,
		fetchStatus,
	};
}

export default useGetBookmarks;
