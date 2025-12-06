import { AppAtpSessionData } from '../../../types/atproto.js';
import { SavedFeedsPrefV2 } from '@atproto/api/dist/client/types/app/bsky/actor/defs.js';
import { RandomUtil } from '../../../utils/random.js';
import { notImplementedErrorBuilder } from '../../../adapters/_client/_router/dto/api-responses.dto.js';
import {
	AppBskyActorDefs,
	AppBskyActorGetPreferences,
	AppBskyFeedDefs,
	AppBskyFeedGetFeedGenerator,
	AtpAgent,
} from '@atproto/api';
import { Err, Ok, ResultErr, ResultOk } from '../../../utils/result.js';
import { ApiErrorCode } from '../../../types/result.types.js';
import type { ApiAsyncResult } from '../../../utils/api-result.js';
import { getXrpcAgent } from '../../../utils/atproto.js';

type SubscriptionUpdateResult = Promise<{
	success: boolean;
	subscribed: boolean;
}>;

type PinStatusUpdateResult = Promise<{
	success: boolean;
	pinned: boolean;
}>;

type AppSavedPrefDate = AppBskyActorGetPreferences.OutputSchema;

/**
 * Feeds are unique to Bluesky driver
 */
class BlueskyFeedRouter {
	dto: AppAtpSessionData;
	xrpc: AtpAgent;

	constructor(dto: AppAtpSessionData) {
		this.dto = dto;
		this.xrpc = getXrpcAgent(this.dto);
	}

	private async ensureUserPref(pref?: AppSavedPrefDate) {
		if (pref) return pref;
		return (await this.xrpc.app.bsky.actor.getPreferences()).data;
	}

	private findFeedPref(pref: AppSavedPrefDate, uri: string): [number, number] {
		const i = pref.preferences.findIndex(AppBskyActorDefs.isSavedFeedsPrefV2);
		if (i === -1) return [-1, -1];

		const j = (pref.preferences[i] as SavedFeedsPrefV2).items.findIndex(
			(o) => o.value === uri,
		);
		return [i, j];
	}

	/**
	 * Resolve and fetch details of a single feed
	 * @param uri uri of the feed
	 */
	async getFeedGenerator(
		uri: string,
	): ApiAsyncResult<AppBskyFeedGetFeedGenerator.OutputSchema> {
		try {
			const data = await this.xrpc.app.bsky.feed.getFeedGenerator({
				feed: uri,
			});
			return ResultOk(data.data);
		} catch (e) {
			return ResultErr(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	/**
	 * Resolve and fetch details of multiple feed
	 * @param uriList a list of uris of the feeds
	 */
	async getFeedGenerators(
		uriList: string[],
	): ApiAsyncResult<AppBskyFeedDefs.GeneratorView[]> {
		try {
			const data = await this.xrpc.app.bsky.feed.getFeedGenerators({
				feeds: uriList,
			});
			if (!data.success) return Err(ApiErrorCode.REMOTE_SERVER_ERROR);
			return Ok(data.data.feeds);
		} catch (e) {
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	// dont know how com.atproto.repo.createRecord works
	async like(uri: string) {
		return notImplementedErrorBuilder();
	}

	// dont know how com.atproto.repo.deleteRecord works
	async removeLike(uri: string) {
		return notImplementedErrorBuilder();
	}

	async addSubscription(
		uri: string,
		cached?: AppSavedPrefDate,
	): SubscriptionUpdateResult {
		const pref = await this.ensureUserPref(cached);
		const [i, j] = this.findFeedPref(pref, uri);
		if (i === -1) return { success: false, subscribed: false };
		if (j !== -1) return { success: true, subscribed: true };

		(pref.preferences[i] as SavedFeedsPrefV2).items.push({
			value: uri,
			pinned: true,
			type: 'feed',
			id: RandomUtil.nanoId(13),
		});

		const result = await this.xrpc.app.bsky.actor.putPreferences(pref);
		return { success: result.success, subscribed: false };
	}

	async removeSubscription(
		uri: string,
		cached?: AppSavedPrefDate,
	): SubscriptionUpdateResult {
		const pref = await this.ensureUserPref(cached);
		const [i, j] = this.findFeedPref(pref, uri);
		if (i === -1 || j === -1) return { success: false, subscribed: false };

		(pref.preferences[i] as SavedFeedsPrefV2).items.splice(j, 1);

		const result = await this.xrpc.app.bsky.actor.putPreferences(pref);
		return { success: result.success, subscribed: false };
	}

	async pin(uri: string, cached?: AppSavedPrefDate): PinStatusUpdateResult {
		const pref = await this.ensureUserPref(cached);
		const [i, j] = this.findFeedPref(pref, uri);
		if (i === -1 || j === -1) return { success: false, pinned: false };

		(pref.preferences[i] as SavedFeedsPrefV2).items[j].pinned = true;
		const result = await this.xrpc.app.bsky.actor.putPreferences(pref);
		return { success: result.success, pinned: true };
	}

	async removePin(
		uri: string,
		cached?: AppSavedPrefDate,
	): PinStatusUpdateResult {
		const pref = await this.ensureUserPref(cached);

		const [i, j] = this.findFeedPref(pref, uri);
		if (i === -1 || j === -1) return { success: false, pinned: false };

		(pref.preferences[i] as SavedFeedsPrefV2).items[j].pinned = false;
		const result = await this.xrpc.app.bsky.actor.putPreferences(pref);
		return { success: result.success, pinned: false };
	}
}

export default BlueskyFeedRouter;
