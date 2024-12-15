import { useEffect, useState } from 'react';
import { useActivitypubUserContext } from '../../../../states/useProfile';
import { useQuery } from '@tanstack/react-query';
import {
	ActivityPubStatuses,
	KNOWN_SOFTWARE,
	MisskeyRestClient,
	StatusInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import { UserDetailed } from 'misskey-js/built/autogen/models';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

/**
 * -- Obtain the pinned posts --
 *
 * Mastodon = Separate Call
 * Misskey - Already embedded in UserDetailed
 * Pleroma - ???
 */
function usePinnedPosts(userId: string) {
	const [Data, setData] = useState<StatusInterface[]>([]);
	const { user } = useActivitypubUserContext();
	const { client, acct, driver } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			driver: o.driver,
			client: o.router,
		})),
	);

	useEffect(() => {
		setData([]);
	}, [userId]);

	async function fn() {
		switch (driver) {
			case KNOWN_SOFTWARE.MISSKEY:
			case KNOWN_SOFTWARE.FIREFISH:
			case KNOWN_SOFTWARE.SHARKEY: {
				const { data, error } = await (
					client as MisskeyRestClient
				).accounts.get(userId);
				if (error) return [];
				const _data = data as UserDetailed;
				return _data.pinnedNotes;
			}
			default: {
				const { data, error } = (await client.accounts.statuses(userId, {
					limit: 10,
					pinned: true,
					userId,
				})) as any;
				if (error) return [];
				return data;
			}
		}
	}

	// Post Queries
	const { status, data, fetchStatus } = useQuery<ActivityPubStatuses>({
		queryKey: ['acct', acct?.server, userId],
		queryFn: fn,
		enabled: userId !== undefined || driver === KNOWN_SOFTWARE.MISSKEY,
	});

	useEffect(() => {
		if (driver === 'misskey') {
			setData(
				ActivityPubAdapterService.adaptManyStatuses(
					user?.getPinnedNotes() || [],
					driver,
				).slice(0, 10),
			);
		}
	}, [driver, user]);

	useEffect(() => {
		if (status !== 'success' || data === undefined) return;
		/**
		 * Masto.js returns the account first,
		 * then the status array. Pretty weird.
		 */
		if (!Array.isArray(data)) return;

		setData(
			ActivityPubAdapterService.adaptManyStatuses(data, driver).slice(0, 10),
		);
	}, [fetchStatus]);

	return { Data };
}

export default usePinnedPosts;
