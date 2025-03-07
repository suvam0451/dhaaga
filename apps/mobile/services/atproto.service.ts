import { AtprotoApiAdapter } from '@dhaaga/bridge';
import type { ViewerState } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import type { ApiTargetInterface } from '@dhaaga/bridge';
import { AppBskyActorDefs, AppBskyActorGetPreferences } from '@atproto/api';

export type AppSavedPrefDate = AppBskyActorGetPreferences.OutputSchema;

class AtprotoPostService {
	/**
	 * toggle like for an at proto post object
	 */
	static async toggleLike(
		client: ApiTargetInterface,
		uri: string,
		cid: string,
		viewer: ViewerState,
	) {
		const _client = client as AtprotoApiAdapter;
		if (viewer.like === undefined)
			return _client.statuses.atProtoLike(uri, cid);
		return _client.statuses.atProtoDeleteLike(viewer.like);
	}

	/**
	 * toggle sharing status for an at proto post object
	 */
	static async toggleRepost(
		client: ApiTargetInterface,
		uri: string,
		cid: string,
		viewer: ViewerState,
	) {
		const _client = client as AtprotoApiAdapter;
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

class AtprotoFeedService {
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

export { AtprotoPostService, AtprotoFeedService };
