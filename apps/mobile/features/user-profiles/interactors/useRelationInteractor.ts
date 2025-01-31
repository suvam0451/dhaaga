import { useEffect, useRef, useState } from 'react';
import useHookLoadingState from '../../../states/useHookLoadingState';
import {
	LibraryResponse,
	MastodonRestClient,
	MisskeyRestClient,
	KNOWN_SOFTWARE,
} from '@dhaaga/bridge';
import ActivitypubRelationService from '../../../services/approto/activitypub-relation.service';
import BlueskyRestClient from '@dhaaga/bridge/dist/adapters/_client/bluesky';
import { AppBskyActorGetProfile } from '@atproto/api';
import { useAppApiClient } from '../../../hooks/utility/global-state-extractors';
import ActivityPubService from '../../../services/activitypub.service';

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

	//
	didFollowing: null,
};

/**
 * - Loads relationship with a user
 * - Helps update relationship with user
 *
 * FIXME: known bug. follow status is
 *  not replicated immediately by mastodon
 *
 * @param id is the user's id
 * @constructor
 */
function useRelationInteractor(id: string) {
	const { client, driver } = useAppApiClient();
	const { State, forceUpdate } = useHookLoadingState();

	const [IsLoading, setIsLoading] = useState(false);
	const [Relation, setRelation] = useState(defaultValue);
	const manager = useRef(
		new ActivitypubRelationService(client, '', setIsLoading),
	);

	useEffect(() => {
		setRelation(defaultValue);
		manager.current = new ActivitypubRelationService(client, id, setIsLoading);
		refetch();
	}, [id, client]);

	async function follow() {
		try {
			const res = await manager.current.follow();
			if (driver === KNOWN_SOFTWARE.BLUESKY) {
				setRelation({
					...Relation,
					following: true,
				});
				// need to refetch did on follow
				refetch();
			} else if (!!res) {
				refetch();
			}
		} catch (e) {
			console.log('[WARN]: failed to follow', e);
		}
	}

	async function unfollow() {
		try {
			const res = await manager.current.unFollow(Relation.didFollowing);
			if (driver === KNOWN_SOFTWARE.BLUESKY) {
				setRelation({
					...Relation,
					following: false,
				});
			} else if (!!res) {
				refetch();
			}
		} catch (e) {
			console.log('[WARN]: failed to unfollow', e);
		}
	}

	function setMastoRelation({ data, error }: LibraryResponse<any[]>) {
		if (error || data.length === 0) {
			setRelation({
				...Relation,
				error: true,
			});
			return;
		}
		const _data = data[0];
		setRelation({
			...Relation,
			following: _data.following,
			followedBy: _data.followedBy,
			blockedBy: _data.blockedBy,
			blocking: _data.blocking,
			muting: _data.muting,
			domainBlocking: _data.domainBlocking,
			requested: _data.requested,
			requestedBy: _data.requestedBy, // moderation
			mutingNotifications: _data.mutingNotifications,
			notifying: _data.notifying,
			showingReblogs: _data.showingReblogs,
		});
	}

	function setBlueskyRelation({
		data,
		error,
	}: LibraryResponse<AppBskyActorGetProfile.Response>) {
		if (error) {
			setRelation({
				...Relation,
				error: true,
			});
			return;
		}
		const viewer = data.data.viewer;
		setRelation({
			...Relation,
			following: !!viewer.following,
			followedBy: !!viewer.followedBy,
			muting: !!viewer.muted,
			blocking: !!viewer.blocking,
			blockedBy: !!viewer.blockedBy,
			didFollowing: viewer.following,
		});
	}

	function setMisskeyRelation({ data, error }: LibraryResponse<any>) {
		if (error) {
			setRelation({
				...Relation,
				error: true,
			});
			return;
		}

		setRelation({
			...Relation,
			following: data.isFollowing,
			followedBy: data.isFollowed,
			blocking: data.isBlocking,
			blockedBy: data.isBlocked,
			requested: data.hasPendingFollowRequestFromYou,
			requestedBy: data.hasPendingFollowRequestToYou,
		});
	}

	function set(input: any) {
		setIsLoading(true);
		switch (driver) {
			case KNOWN_SOFTWARE.MASTODON: {
				// Mock API response, to avoid duplicate api calls
				setMastoRelation({ data: [input] });
			}
		}
		setIsLoading(false);
		forceUpdate();
	}

	async function refetch() {
		setIsLoading(true);

		if (ActivityPubService.mastodonLike(driver)) {
			(client as MastodonRestClient).accounts
				.relationships([id])
				.then(setMastoRelation)
				.finally(() => {
					setIsLoading(false);
					forceUpdate();
				});
		} else if (ActivityPubService.misskeyLike(driver)) {
			(client as MisskeyRestClient).accounts
				.get(id)
				.then(setMisskeyRelation)
				.finally(() => {
					setIsLoading(false);
					forceUpdate();
				});
		} else if (ActivityPubService.blueskyLike(driver)) {
			(client as BlueskyRestClient).accounts
				.get(id)
				.then(setBlueskyRelation)
				.then(() => {
					setIsLoading(false);
					forceUpdate();
				});
		}
	}

	return {
		relationState: State,
		data: Relation,
		refetch,
		setRelation: set,
		relationLoading: IsLoading,
		setRelationLoading: setIsLoading,
		follow,
		unfollow,
	};
}

export default useRelationInteractor;
