import { ActivityPubClient } from '@dhaaga/shared-abstraction-activitypub';
import { TimelineFetchMode } from '../states/useTimelineController';
import { GetPostsQueryDTO } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_interface';

type TimelineGetMiscQueryDto = {
	listQuery?: string;
	hashtagQuery?: string;
	// more filters for hashtag timeline
	hashtagAny?: string[];
	hashtagAll?: string[];
	hashtagNone?: string[];
	hashtagLocalOnly?: boolean;
	hashtagRemoteOnly?: boolean;

	userQuery?: string;
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
			case TimelineFetchMode.USER: {
				const { data, error } = await client.accounts.statuses(misc.userQuery, {
					userId: misc.userQuery,
					limit: 5,
					maxId: opts.maxId,
				});
				if (error) return [];
				return data;
			}
			case TimelineFetchMode.FEDERATED: {
				return client.getPublicTimeline();
			}
			default: {
				return [];
			}
		}
	}
}

export default ActivityPubProviderService;
