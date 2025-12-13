import { Profile, ProfilePinnedUserService } from '@dhaaga/db';
import { useQuery } from '@tanstack/react-query';
import { useActiveUserSession, useAppDb } from '#/states/global/hooks';
import type { UserObjectType } from '@dhaaga/bridge';

export function useSocialHubUserPinStatus(
	profile: Profile,
	user: UserObjectType,
) {
	const { db } = useAppDb();
	const { acct } = useActiveUserSession();
	return useQuery<boolean>({
		queryKey: ['hub/pin/user', profile?.id, user?.id],
		queryFn: () => {
			return ProfilePinnedUserService.isPinnedForProfile(
				db,
				profile,
				acct.server,
				user.id,
			);
		},
		initialData: false,
	});
}
