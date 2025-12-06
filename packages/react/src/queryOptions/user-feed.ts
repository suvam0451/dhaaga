import {
	ApiTargetInterface,
	DhaagaJsTimelineQueryOptions,
	KNOWN_SOFTWARE,
} from '@dhaaga/bridge';
import { UserObjectType, ResultPage } from '@dhaaga/bridge/typings';
import { queryOptions } from '@tanstack/react-query';

enum UserFeedFetchMode {
	IDLE = 'idle',
	SEARCH = 'search',
	FOLLOWS = 'follows',
	MY_FOLLOWS = 'my-follows',
	FOLLOWERS = 'followers',
	MY_FOLLOWERS = 'my-followers',
	SUGGESTED = 'suggested',
}

type UserFeedQueryParams = {
	type: UserFeedFetchMode;
	query?: {
		id: string;
		label: string;
	};
	opts?: DhaagaJsTimelineQueryOptions;
	minId?: string;
	maxId?: string;
	sessionId?: string;
	limit?: number;
};

type UserFeedFetchResultType = ResultPage<UserObjectType>;

export function unifiedUserFeedQueryOptions(
	client: ApiTargetInterface,
	driver: KNOWN_SOFTWARE,
	server: string,
	acctIdentifier: string,
	{
		type,
		query,
		opts,
		maxId,
		minId,
		sessionId,
		limit = 15,
	}: UserFeedQueryParams,
) {
	const _query = {
		// the actual options
		...opts,

		// injected
		limit: limit!,
		sinceId: minId,
		untilId: maxId === null ? undefined : maxId,
		maxId,
		minId, // quirks
		// userId: _id,
	};

	// async function api(): Promise<UserFeedFetchResultType> {
	// 	switch (type) {
	// 		case UserFeedFetchMode.IDLE:
	// 			return defaultResultPage;
	// 		case UserFeedFetchMode.SEARCH: {
	// 		}
	// 		case UserFeedFetchMode.FOLLOWS: {
	// 			if (!query?.id) {
	// 				throw new Error('missing id for user/follows query');
	// 			}
	// 			const result = await client.user.getFollows({
	// 				id: query?.id,
	// 				limit,
	// 				maxId: maxId as any,
	// 				allowPartial: true,
	// 			});
	// 		}
	// 		case UserFeedFetchMode.MY_FOLLOWS: {
	// 		}
	// 		case UserFeedFetchMode.FOLLOWERS: {
	// 		}
	// 		case UserFeedFetchMode.MY_FOLLOWERS: {
	// 		}
	// 		default: {
	// 			throw new Error(`unknown timeline type: ${type}`);
	// 		}
	// 	}
	// }

	return queryOptions<UserFeedFetchResultType>({
		queryKey: ['dhaaga/feed/unified/users'],
		// queryFn: api,
		enabled: !!client && type !== UserFeedFetchMode.IDLE,
	});
}
