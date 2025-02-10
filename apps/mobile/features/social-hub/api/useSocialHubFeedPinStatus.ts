import { AppFeedObject } from '../../../types/app-feed.types';
import { Profile } from '../../../database/_schema';
import {
	useAppAcct,
	useAppDb,
} from '../../../hooks/utility/global-state-extractors';
import { useQuery } from '@tanstack/react-query';
import { ProfilePinnedTimelineService } from '../../../database/entities/profile-pinned-timeline';

export function useSocialHubFeedPinStatus(
	profile: Profile,
	feed: AppFeedObject,
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
