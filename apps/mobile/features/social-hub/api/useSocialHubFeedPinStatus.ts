import { FeedObjectType } from '@dhaaga/bridge';
import { Profile, ProfilePinnedTimelineService } from '@dhaaga/db';
import {
	useAppAcct,
	useAppDb,
} from '../../../hooks/utility/global-state-extractors';
import { useQuery } from '@tanstack/react-query';

export function useSocialHubFeedPinStatus(
	profile: Profile,
	feed: FeedObjectType,
) {
	const { db } = useAppDb();
	const { acct } = useAppAcct();

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
