import BlueskyRestClient from '@dhaaga/bridge/dist/adapters/_client/bluesky';
import { ViewerState } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import { ActivityPubClient } from '@dhaaga/bridge';
import { AppBskyActorDefs, AppBskyActorGetPreferences } from '@atproto/api';

export type AppSavedPrefDate = AppBskyActorGetPreferences.OutputSchema;

export class AtprotoPostService {
	/**
	 * toggle like for an at proto post object
	 */
	static async toggleLike(
		client: ActivityPubClient,
		uri: string,
		cid: string,
		viewer: ViewerState,
	) {
		const _client = client as BlueskyRestClient;
		if (viewer.like === undefined) {
			const result = await _client.statuses.atProtoLike(uri, cid);
			if (result.success)
				return { state: result.liked, uri: result.uri, success: true };
			return { state: !!viewer.like, uri: viewer?.like, success: false };
		}

		const result = await _client.statuses.atProtoDeleteLike(viewer.like);
		if (result.success) return { state: result.liked, success: true };
		return { state: !!viewer.like, uri: viewer?.like, success: false };
	}

	/**
	 * toggle sharing status for an at proto post object
	 */
	static async toggleRepost(
		client: ActivityPubClient,
		uri: string,
		cid: string,
		viewer: ViewerState,
	) {
		const _client = client as BlueskyRestClient;
		if (viewer.repost === undefined) {
			const result = await _client.statuses.atProtoRepost(uri, cid);
			if (result.success)
				return { state: result.liked, uri: result.uri, success: true };
			return { state: !!viewer.repost, uri: viewer?.repost, success: false };
		}

		const result = await _client.statuses.atProtoDeleteRepost(viewer.repost);
		if (result.success) return { state: result.liked, success: true };
		return { state: !!viewer.repost, uri: viewer?.repost, success: false };
	}
}

export class AtprotoFeedService {
	/**
	 * Helper function to get saved feeds
	 * from an AT proto preference (saved or fetched)
	 * @param pref
	 */
	static extractFeedPreferences(pref: AppSavedPrefDate) {
		const match = pref.preferences.find(AppBskyActorDefs.isSavedFeedsPrefV2);
		return match ? match.items : [];
	}
}
