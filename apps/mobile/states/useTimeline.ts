import { TimelineFetchMode } from './useTimelineController';
import { useActivityPubRestClientContext } from './useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import { StatusArray } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/status/_interface';

type TimelineQueryParams = {
	type: TimelineFetchMode;
	query?: {
		id: string;
		label: string;
	};
	opts?: {};
	minId?: string;
	maxId?: string;
};

/**
 * For use with the main timeline renderer
 * component
 */
function useTimeline({ type, query, maxId, minId }: TimelineQueryParams) {
	const { client } = useActivityPubRestClientContext();
	// to be adjusted based on performance
	const TIMELINE_STATUS_LIMIT = 5;

	const _id = query?.id;
	const _query = {
		limit: TIMELINE_STATUS_LIMIT,
		maxId,
		userId: _id,
	};

	async function api() {
		switch (type) {
			case TimelineFetchMode.IDLE:
				return [];
			case TimelineFetchMode.HOME:
				return client.getHomeTimeline(_query);
			case TimelineFetchMode.LOCAL:
				return client.getLocalTimeline(_query);
			case TimelineFetchMode.HASHTAG:
				return client.getTimelineByHashtag(_id, _query);
			case TimelineFetchMode.LIST:
				return client.getListTimeline(_id, _query);
			case TimelineFetchMode.USER: {
				const { data, error } = (await client.accounts.statuses(
					_id,
					_query,
				)) as any;
				if (error) return [];
				return data;
			}
			case TimelineFetchMode.FEDERATED:
				return client.getPublicTimeline();
			default:
				return [];
		}
	}

	// Queries
	return useQuery<StatusArray>({
		queryKey: [type, _id, _query, maxId, minId],
		queryFn: api,
		enabled: client !== null && type !== 'Idle',
	});
}

export default useTimeline;
