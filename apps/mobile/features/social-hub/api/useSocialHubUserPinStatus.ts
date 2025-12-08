import { Profile, ProfilePinnedUserService } from '@dhaaga/db';
import { useQuery } from '@tanstack/react-query';
import {
	useAppAcct,
	useAppDb,
} from '../../../hooks/utility/global-state-extractors';
import type { UserObjectType } from '@dhaaga/bridge/typings';

export function useSocialHubUserPinStatus(
	profile: Profile,
	user: UserObjectType,
) {
	const { db } = useAppDb();
	const { acct } = useAppAcct();
	return useQuery<boolean>({
		queryKey: ['hub/pin/user', profile.id, user.id],
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
