import { useAppDb } from '../../../hooks/utility/global-state-extractors';
import { useMutation } from '@tanstack/react-query';
import { Profile } from '../../../database/_schema';
import { AppUserObject } from '../../../types/app-user.types';
import { ProfilePinnedUserService } from '../../../database/entities/profile-pinned-user';
import { ProfileService } from '../../../database/entities/profile';
import { AppFeedObject } from '../../../types/app-feed.types';

export function useSocialHubMutation(profile: Profile) {
	const { db } = useAppDb();

	const toggleUserToProfile = useMutation({
		mutationKey: ['hub', profile],
		mutationFn: async ({ user }: { user: AppUserObject }) => {
			const acct = ProfileService.getOwnerAccount(db, profile);
			return ProfilePinnedUserService.toggleUserPin(db, profile, acct, user);
		},
	});

	const toggleFeedToProfile = useMutation({
		mutationKey: ['hub', profile],
		mutationFn: async ({ feed }: { feed: AppFeedObject }) => {
			const acct = ProfileService.getOwnerAccount(db, profile);
		},
	});

	return {
		toggleUserToProfile,
		toggleFeedToProfile,
	};
}
