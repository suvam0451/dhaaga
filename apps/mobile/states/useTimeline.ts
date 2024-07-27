import { AppTimelineQuery, TimelineFetchMode } from './useTimelineController';
import { useActivityPubRestClientContext } from './useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import { StatusArray } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/status/_interface';
import { DhaagaJsTimelineQueryOptions } from '@dhaaga/shared-abstraction-activitypub';

type TimelineQueryParams = {
	type: TimelineFetchMode;
	query?: AppTimelineQuery;
	opts?: DhaagaJsTimelineQueryOptions;
	minId?: string;
	maxId?: string;
};

/**
 * For use with the main timeline renderer
 * component
 */
function useTimeline({ type, query, opts, maxId, minId }: TimelineQueryParams) {
	const { client } = useActivityPubRestClientContext();
	// to be adjusted based on performance
	const TIMELINE_STATUS_LIMIT = 5;

	const _id = query?.id;
	const _query = {
		// the actual options
		...opts,

		// injected
		limit: TIMELINE_STATUS_LIMIT,
		sinceId: minId,
		untilId: maxId,
		maxId,
		minId,
		// quirks
		userId: _id,
	};

	async function api() {
		switch (type) {
			case TimelineFetchMode.IDLE:
				return [];
			case TimelineFetchMode.HOME: {
				const { data, error } = await client.timelines.home(_query);
				if (error) return [];
				return data;
			}
			case TimelineFetchMode.LOCAL: {
				const { data, error } = await client.timelines.public(_query);
				if (error) return [];
				return data;
			}
			case TimelineFetchMode.HASHTAG: {
				const { data, error } = await client.timelines.hashtag(_id, _query);
				if (error) return [];
				return data;
			}
			case TimelineFetchMode.LIST: {
				const { data, error } = await client.timelines.list(_id, _query);
				if (error) return [];
				return data;
			}
			case TimelineFetchMode.USER: {
				const { data, error } = (await client.accounts.statuses(
					_id,
					_query,
				)) as any;
				if (error) return [];
				return data;
			}
			case TimelineFetchMode.FEDERATED: {
				const { data, error } = await client.timelines.public(_query);
				if (error) return [];
				return data;
			}
			default:
				return [];
		}
	}

	// Queries
	return useQuery<StatusArray>({
		queryKey: [type, _id, _query],
		queryFn: api,
		enabled: client !== null && type !== 'Idle',
	});
}

export default useTimeline;
