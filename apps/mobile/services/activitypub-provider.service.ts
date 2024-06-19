import { ActivityPubClient } from '@dhaaga/shared-abstraction-activitypub/src';
import { GetPostsQueryDTO } from '@dhaaga/shared-abstraction-activitypub/src/adapters/_client/_interface';
import { TimelineFetchMode } from '../states/useTimelineController';

type TimelineGetMiscQueryDto = {
	listQuery?: string;
	hashtagQuery?: string;
	// more filters for hashtag timeline
	hashtagAny?: string[];
	hashtagAll?: string[];
	hashtagNone?: string[];
	hashtagLocalOnly?: boolean;
	hashtagRemoteOnly?: boolean;
};

/**
 * Wrapper service to invoke provider functions
 */
class ActivityPubProviderService {
	static async getStatusContext(client: ActivityPubClient, id: string) {
		return client.getStatusContext(id);
	}

	static async getStatus(client: ActivityPubClient, id: string) {
		return client.getStatus(id);
	}

	static async getStatusAsArray(client: ActivityPubClient, id: string) {
		const status = await client.getStatus(id);
		console.log(status.id);
		return [status];
	}

	static async getTimeline(
		client: ActivityPubClient,
		mode: TimelineFetchMode,
		opts: GetPostsQueryDTO,
		misc: TimelineGetMiscQueryDto,
	) {
		if (!client) return [];

		// to be adjusted based on performance
		const TIMELINE_STATUS_LIMIT = 5;

		switch (mode) {
			case TimelineFetchMode.IDLE: {
				return [];
			}
			case TimelineFetchMode.HOME: {
				return client.getHomeTimeline({
					limit: TIMELINE_STATUS_LIMIT,
					maxId: opts.maxId,
				});
			}
			case TimelineFetchMode.LOCAL: {
				return client.getLocalTimeline({
					limit: TIMELINE_STATUS_LIMIT,
					maxId: opts.maxId,
				});
			}
			case TimelineFetchMode.HASHTAG: {
				return client.getTimelineByHashtag(misc.hashtagQuery, {
					maxId: opts.maxId,
					limit: TIMELINE_STATUS_LIMIT,
				});
			}
			case TimelineFetchMode.LIST: {
				return client.getListTimeline(misc.listQuery, {
					maxId: opts.maxId,
					limit: TIMELINE_STATUS_LIMIT,
				});
			}
		}
	}
}

export default ActivityPubProviderService;
