import type { FeedObjectType } from '@dhaaga/bridge';
import { Profile, ProfilePinnedTimelineService } from '@dhaaga/db';
import { useActiveUserSession, useAppDb } from '#/states/global/hooks';
import { useQuery } from '@tanstack/react-query';

export function useSocialHubFeedPinStatus(
	profile: Profile,
	feed: FeedObjectType,
) {
	const { db } = useAppDb();
	const { acct } = useActiveUserSession();

	return useQuery<boolean>({
		queryKey: ['hub/pin/timeline', profile.id, feed.uri],
		queryFn: () => {
			return ProfilePinnedTimelineService.isPinnedForProfile(
				db,
				profile,
				acct.server,
				feed.uri,
			);
		},
		initialData: false,
	});
}
