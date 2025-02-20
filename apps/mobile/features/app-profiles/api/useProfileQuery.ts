import {
	useAppAcct,
	useAppApiClient,
	useAppDb,
} from '../../../hooks/utility/global-state-extractors';
import { useQuery } from '@tanstack/react-query';
import {
	Profile,
	ProfileService,
	ProfilePinnedTimelineService,
	ProfilePinnedUserService,
	ProfilePinnedTagService,
} from '@dhaaga/db';

export type ProfileAssigned = Profile & {
	has: boolean;
};

export function useProfileListFeedAssignment(uri: string) {
	const { db } = useAppDb();
	const { acct } = useAppAcct();

	return useQuery<ProfileAssigned[]>({
		queryKey: ['db', 'profiles/feed-assign', acct?.id, uri],
		initialData: [],
		queryFn: () => {
			const all = ProfilePinnedTimelineService.listByUri(db, uri);
			const st = new Set(all.map((obj) => obj.profileId));

			const profiles = ProfileService.getForAccount(db, acct);
			return profiles.map((o) => ({ ...o, has: st.has(o.id) })) as any;
		},
	});
}

export function useProfileListUserAssignment(userId: string) {
	const { db } = useAppDb();
	const { acct } = useAppAcct();
	const { server } = useAppApiClient();

	return useQuery<ProfileAssigned[]>({
		queryKey: ['db', 'profiles/user-assign', acct?.id, userId],
		initialData: [],
		queryFn: () => {
			const all = ProfilePinnedUserService.listByUserId(db, server, userId);
			const st = new Set(all.map((obj) => obj.profileId));

			const profiles = ProfileService.getForAccount(db, acct);
			return profiles.map((o) => ({ ...o, has: st.has(o.id) })) as any;
		},
	});
}

export function useProfileListTagAssignment(name: string) {
	const { db } = useAppDb();
	const { acct } = useAppAcct();

	return useQuery<ProfileAssigned[]>({
		queryKey: ['db', 'profiles/tag-assign', acct?.id, name],
		initialData: [],
		queryFn: () => {
			const all = ProfilePinnedTagService.listByName(db, name);
			const st = new Set(all.map((obj) => obj.profileId));

			const profiles = ProfileService.getForAccount(db, acct);
			return profiles.map((o) => ({ ...o, has: st.has(o.id) })) as any;
		},
	});
}
