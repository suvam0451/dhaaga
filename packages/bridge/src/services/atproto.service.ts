import { AtprotoApiAdapter } from '@dhaaga/bridge';
import type { ApiTargetInterface } from '@dhaaga/bridge';
import { AppBskyActorDefs, AppBskyActorGetPreferences } from '@atproto/api';
import { ViewerState } from '@atproto/api/dist/client/types/app/bsky/feed/defs.js';

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
		repostView: string | undefined,
	) {
		const _client = client as AtprotoApiAdapter;
		if (repostView === undefined) {
			const result = await _client.statuses.atProtoRepost(uri, cid);
			if (result.success)
				return { state: result.liked, uri: result.uri, success: true };
			return { state: false, uri: undefined, success: false };
		}

		const result = await _client.statuses.atProtoDeleteRepost(repostView);
		if (result.success) return { state: result.liked, success: true };
		return { state: true, uri: repostView, success: false };
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
