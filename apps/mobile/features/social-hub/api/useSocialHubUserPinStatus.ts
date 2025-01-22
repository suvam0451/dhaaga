import { Profile } from '../../../database/_schema';
import { useQuery } from '@tanstack/react-query';
import { AppUserObject } from '../../../types/app-user.types';
import { ProfilePinnedUserService } from '../../../database/entities/profile-pinned-user';
import {
	useAppAcct,
	useAppDb,
} from '../../../hooks/utility/global-state-extractors';

export function useSocialHubUserPinStatus(
	profile: Profile,
	user: AppUserObject,
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
