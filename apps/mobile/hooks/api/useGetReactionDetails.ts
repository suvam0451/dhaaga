import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import ActivitypubService from '../../services/activitypub.service';
import {
	MisskeyRestClient,
	PleromaRestClient,
} from '@dhaaga/shared-abstraction-activitypub';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ActivityPubAdapterService from '../../services/activitypub-adapter.service';
import ActivityPubService from '../../services/activitypub.service';
import AppUserService, {
	AppUser,
} from '../../services/approto/app-user-service';
import ActivitypubReactionsService from '../../services/approto/activitypub-reactions.service';

type ReactionDetails = {
	id: string;
	url: string;
	count: number;
	reacted: boolean;
	accounts: AppUser[];
};

function useGetReactionDetails(postId: string, reactionId: string) {
	const { client, domain, subdomain, me } = useActivityPubRestClientContext();
	const [Data, setData] = useState<ReactionDetails>(null);

	async function api(): Promise<ReactionDetails> {
		const { id } = ActivitypubReactionsService.extractReactionCode(
			reactionId,
			domain,
			subdomain,
		);
		if (ActivitypubService.pleromaLike(domain)) {
			const { data, error } = await (
				client as PleromaRestClient
			).statuses.getReactions(postId);

			if (error) {
				return null;
			}

			const match = data.find((o) => o.name === id);
			if (!match) {
				return null;
			}
			return {
				id: match.name,
				count: match.count,
				reacted: match.me,
				url: match.url,
				accounts: AppUserService.exportRawMultiple(
					match.accounts,
					domain,
					subdomain,
				),
			};
		} else if (ActivityPubService.misskeyLike(domain)) {
			const { data, error } = await (
				client as MisskeyRestClient
			).statuses.getReactionDetails(postId, id);

			if (error) {
				console.log('[ERROR]: failed to get reaction details', error);
				return null;
			}

			const accts: AppUser[] = data
				.map((o) =>
					AppUserService.export(
						ActivityPubAdapterService.adaptUser(o.user, domain),
						domain,
						subdomain,
					),
				)
				.filter((o) => !!o);

			let reacted = false;
			if (me?.getId()) {
				const match = accts.find((o) => o.id === me?.getId());
				reacted = !!match;
			}

			return {
				id: id,
				count: accts.length,
				reacted,
				url: data?.url,
				accounts: accts,
			};
		}
	}

	const { data, fetchStatus, error, status, refetch } =
		useQuery<ReactionDetails>({
			queryKey: ['reaction', postId, reactionId, domain, subdomain],
			queryFn: api,
		});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		setData(data);
	}, [fetchStatus, data]);

	return { Data, fetchStatus, refetch };
}

export default useGetReactionDetails;
