import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import ActivitypubService from '../../services/activitypub.service';
import { PleromaRestClient } from '@dhaaga/shared-abstraction-activitypub';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ActivitypubReactionsService from '../../services/ap-proto/activitypub-reactions.service';
import ActivityPubAdapterService from '../../services/activitypub-adapter.service';
import ActivityPubUserDtoService, {
	ActivityPubAppUserDtoType,
} from '../../services/ap-proto/activitypub-user-dto.service';

type ReactionDetails = {
	id: string;
	url: string;
	count: number;
	reacted: boolean;
	accounts: ActivityPubAppUserDtoType[];
};
function useGetReactionDetails(postId: string, reactionId: string) {
	const { client, domain, subdomain } = useActivityPubRestClientContext();
	const [Data, setData] = useState<ReactionDetails>(null);

	async function api(): Promise<ReactionDetails> {
		const { id } = ActivitypubReactionsService.extractReactionCode(
			reactionId,
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
				accounts: match.accounts
					.map((o) =>
						ActivityPubUserDtoService.export(
							ActivityPubAdapterService.adaptUser(o, domain),
							domain,
							subdomain,
						),
					)
					.filter((o) => !!o),
			};
		}
	}

	const { data, fetchStatus, error, status, refetch } =
		useQuery<ReactionDetails>({
			queryKey: ['reaction', postId],
			queryFn: api,
		});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		setData(data);
	}, [fetchStatus]);

	return { Data, fetchStatus, refetch };
}

export default useGetReactionDetails;
