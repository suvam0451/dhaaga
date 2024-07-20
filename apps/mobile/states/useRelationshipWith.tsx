import { useActivityPubRestClientContext } from './useActivityPubRestClient';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MastoRelationship } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_interface';
import useHookLoadingState from './useHookLoadingState';

const defaultValue = {
	blockedBy: false,
	blocking: false,
	domainBlocking: false,
	endorsed: false,
	followedBy: false,
	following: false,
	id: '',
	languages: null,
	muting: false,
	mutingNotifications: false,
	note: '',
	notifying: false,
	requested: false,
	requestedBy: false,
	showingReblogs: false,
	error: false,
};

/**
 * Fetch and show relationship with user
 *
 * //FIXME: known bug. follow status is not replicated immediately by mastodon
 * @param id is the user's id
 * @constructor
 */
function useRelationshipWith(id: string) {
	const { domain } = useActivityPubRestClientContext();
	const { client } = useActivityPubRestClientContext();
	const { State, forceUpdate } = useHookLoadingState();

	const [IsLoading, setIsLoading] = useState(false);
	const Data = useRef(defaultValue);

	useEffect(() => {
		refetch();
	}, [id]);

	const setMastoRelation = useCallback(
		(input: MastoRelationship) => {
			Data.current.following = input.following;
			Data.current.followedBy = input.followedBy;
			Data.current.blockedBy = input.blockedBy;
			Data.current.blocking = input.blocking;
			Data.current.muting = input.muting;

			Data.current.domainBlocking = input.domainBlocking;
			Data.current.requested = input.requested;
			Data.current.requestedBy = input.requestedBy;

			// moderation
			Data.current.mutingNotifications = input.mutingNotifications;
			Data.current.notifying = input.notifying;
			Data.current.showingReblogs = input.showingReblogs;
		},
		[Data, IsLoading],
	);

	function setRelation(input: MastoRelationship) {
		setIsLoading(true);
		switch (domain) {
			case 'mastodon': {
				setMastoRelation(input);
			}
		}
		setIsLoading(false);
		forceUpdate();
	}

	async function refetch() {
		setIsLoading(true);
		const { data, error } = await client.accounts.relationships([id]);
		console.log(data);
		if (error) {
			Data.current.error = true;
			return;
		}
		switch (domain) {
			case 'mastodon': {
				setMastoRelation(data[0]);
			}
		}
		setIsLoading(false);
		forceUpdate();
	}

	return {
		relationState: State,
		relation: Data.current,
		refetchRelation: refetch,
		setRelation,
		relationLoading: IsLoading,
	};
}

export default useRelationshipWith;
