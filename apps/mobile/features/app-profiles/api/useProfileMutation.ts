import { useAppDb } from '../../../hooks/utility/global-state-extractors';
import { useMutation } from '@tanstack/react-query';
import {
	Profile,
	ProfilePinnedUserService,
	ProfileService,
	ProfilePinnedTimelineService,
} from '@dhaaga/db';
import type { UserObjectType, FeedObjectType } from '@dhaaga/bridge';

export function useProfileMutation() {
	const { db } = useAppDb();

	const toggleUserPin = useMutation({
		mutationKey: ['hub/user-assign'],
		mutationFn: async ({
			user,
			profile,
		}: {
			user: UserObjectType;
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
			feed: FeedObjectType;
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
