import { AppTimelineQuery } from './useTimelineController';
import { useQuery } from '@tanstack/react-query';
import { StatusArray } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/status/_interface';
import {
	DhaagaJsTimelineQueryOptions,
	MisskeyRestClient,
	KNOWN_SOFTWARE,
	PleromaRestClient,
} from '@dhaaga/shared-abstraction-activitypub';
import { TimelineFetchMode } from '../utils/timeline.types';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

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
	const { router, driver } = useGlobalState(
		useShallow((o) => ({
			router: o.router,
			driver: o.driver,
		})),
	);
	// to be adjusted based on performance
	const TIMELINE_STATUS_LIMIT = 10;

	const _id = query?.id;
	const _query = {
		// the actual options
		...opts,

		// injected
		limit: TIMELINE_STATUS_LIMIT,
		sinceId: minId,
		untilId: maxId === null ? undefined : maxId,
		maxId,
		minId,
		// quirks
		userId: _id,
	};

	async function api() {
		if (router === null) return [];
		switch (type) {
			case TimelineFetchMode.IDLE:
				return [];
			case TimelineFetchMode.HOME: {
				const { data, error } = await router.timelines.home(_query);
				if (error) return [];
				return data;
			}
			case TimelineFetchMode.LOCAL: {
				const { data, error } = await router.timelines.public({
					..._query,
					local: true,
					// Pleroma/Akkoma thing
					withMuted: [KNOWN_SOFTWARE.PLEROMA, KNOWN_SOFTWARE.AKKOMA].includes(
						driver,
					)
						? true
						: undefined,
					withRenotes: !opts?.excludeReblogs,
					withReplies: !opts?.excludeReplies,
				});
				if (error) return [];
				return data;
			}
			case TimelineFetchMode.HASHTAG: {
				const { data, error } = await router.timelines.hashtag(_id, _query);
				if (error) return [];
				return data;
			}
			case TimelineFetchMode.LIST: {
				const { data, error } = await router.timelines.list(_id, _query);
				if (error) return [];
				return data;
			}
			case TimelineFetchMode.USER: {
				const { data, error } = (await router.accounts.statuses(
					_id,
					_query,
				)) as any;
				if (error) return [];
				return data;
			}
			case TimelineFetchMode.SOCIAL: {
				const { data, error } = await router.timelines.public({
					..._query,
					social: true,
				});
				if (error) return [];
				return data;
			}
			case TimelineFetchMode.BUBBLE: {
				if (driver === KNOWN_SOFTWARE.AKKOMA) {
					const { data } = await (router as PleromaRestClient).timelines.bubble(
						_query,
					);
					return data;
				} else if (driver === KNOWN_SOFTWARE.SHARKEY) {
					const { data } = await (router as MisskeyRestClient).timelines.bubble(
						_query,
					);
					return data;
				} else {
					return [];
				}
			}
			case TimelineFetchMode.FEDERATED: {
				const { data, error } = await router.timelines.public(_query);
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
		enabled: router !== null && type !== TimelineFetchMode.IDLE,
	});
}

export default useTimeline;
