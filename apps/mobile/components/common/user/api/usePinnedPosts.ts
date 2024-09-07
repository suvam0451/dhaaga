import { useEffect, useState } from 'react';
import { useActivitypubUserContext } from '../../../../states/useProfile';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import {
	ActivityPubStatuses,
	MisskeyRestClient,
	KNOWN_SOFTWARE,
	StatusInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import { UserDetailed } from 'misskey-js/built/autogen/models';

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
	const { client, domain, subdomain } = useActivityPubRestClientContext();

	useEffect(() => {
		setData([]);
	}, [userId]);

	async function fn() {
		switch (domain) {
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
		queryKey: ['acct', subdomain, userId],
		queryFn: fn,
		enabled: userId !== undefined || domain === 'misskey',
	});

	useEffect(() => {
		if (domain === 'misskey') {
			setData(
				ActivityPubAdapterService.adaptManyStatuses(
					user.getPinnedNotes(),
					domain,
				).slice(0, 10),
			);
		}
	}, [domain, user]);

	useEffect(() => {
		if (status !== 'success' || data === undefined) return;
		/**
		 * Masto.js returns the account first,
		 * then the status array. Pretty weird.
		 */
		if (!Array.isArray(data)) return;

		setData(
			ActivityPubAdapterService.adaptManyStatuses(data, domain).slice(0, 10),
		);
	}, [fetchStatus]);

	return { Data };
}

export default usePinnedPosts;
