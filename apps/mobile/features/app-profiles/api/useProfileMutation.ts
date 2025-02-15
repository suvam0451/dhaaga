import { useAppDb } from '../../../hooks/utility/global-state-extractors';
import { useMutation } from '@tanstack/react-query';
import { Profile } from '../../../database/_schema';
import { AppUserObject } from '../../../types/app-user.types';
import { ProfilePinnedUserService } from '../../../database/entities/profile-pinned-user';
import { ProfileService } from '../../../database/entities/profile';
import { AppFeedObject } from '../../../types/app-feed.types';
import { ProfilePinnedTimelineService } from '../../../database/entities/profile-pinned-timeline';

export function useProfileMutation() {
	const { db } = useAppDb();

	const toggleUserPin = useMutation({
		mutationKey: ['hub/user-assign'],
		mutationFn: async ({
			user,
			profile,
		}: {
			user: AppUserObject;
			profile: Profile;
		}) => {
			const acct = ProfileService.getOwnerAccount(db, profile);
			return ProfilePinnedUserService.toggleUserPin(db, profile, acct, user);
		},
	});

	const toggleFeedPin = useMutation({
		mutationKey: ['hub/feed-assign'],
		mutationFn: async ({
			feed,
			profile,
		}: {
			feed: AppFeedObject;
			profile: Profile;
		}) => {
			const acct = ProfileService.getOwnerAccount(db, profile);
			return ProfilePinnedTimelineService.toggleTimelinePin(
				db,
				acct,
				profile,
				feed,
			);
		},
	});

	return {
		toggleUserPin,
		toggleFeedPin,
	};
}
