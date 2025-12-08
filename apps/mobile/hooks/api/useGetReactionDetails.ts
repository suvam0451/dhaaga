import { MisskeyApiAdapter, PleromaApiAdapter } from '@dhaaga/bridge';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	ActivityPubService,
	ActivityPubReactionsService,
} from '@dhaaga/bridge';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../states/_global';
import { UserParser } from '@dhaaga/bridge';
import type { UserObjectType } from '@dhaaga/bridge/typings';

type ReactionDetails = {
	id: string;
	url: string;
	count: number;
	reacted: boolean;
	accounts: UserObjectType[];
};

function useGetReactionDetails(postId: string, reactionId: string) {
	const { client, acct, driver, me } = useGlobalState(
		useShallow((o) => ({
			me: o.me,
			driver: o.driver,
			acct: o.acct,
			client: o.router,
		})),
	);
	const [Data, setData] = useState<ReactionDetails>(null);

	async function api(): Promise<ReactionDetails> {
		const { id } = ActivityPubReactionsService.extractReactionCode(
			reactionId,
			driver,
			acct?.server,
		);
		if (ActivityPubService.pleromaLike(driver)) {
			const { data, error } = await (
				client as PleromaApiAdapter
			).posts.getReactions(postId);

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
				accounts: UserParser.parse<unknown[]>(
					match.accounts,
					driver,
					acct?.server,
				),
			};
		} else if (ActivityPubService.misskeyLike(driver)) {
			const { data, error } = await (
				client as MisskeyApiAdapter
			).posts.getReactionDetails(postId, id);

			if (error) {
				console.log('[ERROR]: failed to get reaction details', error);
				return null;
			}

			const accts: UserObjectType[] = data.map((o) =>
				UserParser.parse<unknown[]>(o.user, driver, acct?.server),
			);

			let reacted = false;
			if (me.id) {
				const match = accts.find((o) => o.id === me.id);
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
			queryKey: ['reaction', postId, reactionId, driver, acct?.server],
			queryFn: api,
		});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		setData(data);
	}, [fetchStatus, data]);

	return { Data, fetchStatus, refetch };
}

export default useGetReactionDetails;
