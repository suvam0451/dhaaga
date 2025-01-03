import { useCallback, useEffect, useRef, useState } from 'react';
import { MastoRelationship } from '@dhaaga/bridge/dist/adapters/_client/_interface';
import useHookLoadingState from './useHookLoadingState';
import {
	LibraryResponse,
	MastodonRestClient,
	MisskeyRestClient,
	KNOWN_SOFTWARE,
} from '@dhaaga/bridge';
import { UserDetailed } from 'misskey-js/built/autogen/models';
import ActivitypubRelationService from '../services/approto/activitypub-relation.service';
import BlueskyRestClient from '@dhaaga/bridge/dist/adapters/_client/bluesky';
import { AppBskyActorGetProfile } from '@atproto/api';
import useGlobalState from './_global';
import { useShallow } from 'zustand/react/shallow';

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
	const { client, driver } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			client: o.router,
		})),
	);
	const { State, forceUpdate } = useHookLoadingState();

	const [IsLoading, setIsLoading] = useState(false);
	const Data = useRef(defaultValue);
	const manager = useRef(
		new ActivitypubRelationService(client, '', setIsLoading),
	);

	useEffect(() => {
		Data.current = defaultValue;
		forceUpdate();
		manager.current = new ActivitypubRelationService(client, id, setIsLoading);
		refetch();
	}, [id, client, setIsLoading]);

	async function follow() {
		const res = await manager.current.follow();
		if (res) {
			refetch();
		}
	}

	async function unfollow() {
		const res = await manager.current.unFollow();
		if (res) {
			refetch();
		}
	}

	const setMastoRelation = useCallback(
		({ data, error }: LibraryResponse<MastoRelationship[]>) => {
			if (error || data.length === 0) {
				Data.current.error = true;
				return;
			}
			const _data = data[0];
			Data.current.following = _data.following;
			Data.current.followedBy = _data.followedBy;
			Data.current.blockedBy = _data.blockedBy;
			Data.current.blocking = _data.blocking;
			Data.current.muting = _data.muting;

			Data.current.domainBlocking = _data.domainBlocking;
			Data.current.requested = _data.requested;
			Data.current.requestedBy = _data.requestedBy;

			// moderation
			Data.current.mutingNotifications = _data.mutingNotifications;
			Data.current.notifying = _data.notifying;
			Data.current.showingReblogs = _data.showingReblogs;
		},
		[Data, IsLoading],
	);

	const setBlueskyRelation = useCallback(
		({ data, error }: LibraryResponse<AppBskyActorGetProfile.Response>) => {
			if (error) {
				Data.current.error = true;
				return;
			}
			const viewer = data.data.viewer;
			Data.current.following = !!viewer.following;
			Data.current.followedBy = !!viewer.followedBy;
			Data.current.muting = !!viewer.muted;
			Data.current.blocking = !!viewer.blocking;
			Data.current.blockedBy = !!viewer.blockedBy;
		},
		[Data, IsLoading],
	);

	const setMisskeyRelation = useCallback(
		({ data, error }: LibraryResponse<UserDetailed>) => {
			if (error) {
				Data.current.error = true;
				return;
			}

			Data.current.following = data.isFollowing;
			Data.current.followedBy = data.isFollowed;

			Data.current.blocking = data.isBlocking;
			Data.current.blockedBy = data.isBlocked;

			Data.current.requested = data.hasPendingFollowRequestFromYou;
			Data.current.requestedBy = data.hasPendingFollowRequestToYou;
		},
		[Data, IsLoading],
	);

	function setRelation(input: MastoRelationship) {
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

		switch (driver) {
			case KNOWN_SOFTWARE.MASTODON:
			case KNOWN_SOFTWARE.PLEROMA:
			case KNOWN_SOFTWARE.AKKOMA: {
				(client as MastodonRestClient).accounts
					.relationships([id])
					.then(setMastoRelation)
					.finally(() => {
						setIsLoading(false);
						forceUpdate();
					});
				break;
			}
			case KNOWN_SOFTWARE.MISSKEY:
			case KNOWN_SOFTWARE.FIREFISH:
			case KNOWN_SOFTWARE.SHARKEY: {
				(client as MisskeyRestClient).accounts
					.get(id)
					.then(setMisskeyRelation)
					.finally(() => {
						setIsLoading(false);
						forceUpdate();
					});
				break;
			}
			case KNOWN_SOFTWARE.BLUESKY: {
				(client as BlueskyRestClient).accounts
					.get(id)
					.then(setBlueskyRelation)
					.then(() => {
						setIsLoading(false);
						forceUpdate();
					});
				break;
			}
			default: {
				setIsLoading(false);
				forceUpdate();
			}
		}
	}

	return {
		relationState: State,
		relation: Data.current,
		refetchRelation: refetch,
		setRelation,
		relationLoading: IsLoading,
		setRelationLoading: setIsLoading,
		follow,
		unfollow,
	};
}

export default useRelationshipWith;
