import { getXrpcAgent } from '../_router/_api.js';
import { AppAtpSessionData } from '../../../types/atproto.js';
import { SavedFeedsPrefV2 } from '@atproto/api/dist/client/types/app/bsky/actor/defs.js';
import { RandomUtil } from '../../../utils/random.js';
import {
	errorBuilder,
	notImplementedErrorBuilder,
} from '../_router/dto/api-responses.dto.js';
import {
	AppBskyActorDefs,
	AppBskyActorGetPreferences,
	AppBskyFeedGetFeedGenerator,
	AppBskyFeedGetFeedGenerators,
	AtpAgent,
} from '@atproto/api';
import { LibraryPromise } from '../_router/routes/_types.js';
import { ResultErr, ResultOk } from '../../../utils/result.js';
import { DhaagaErrorCode } from '../../../types/result.types.js';
import type { ApiAsyncResult } from '../../../utils/api-result.js';

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
			return ResultErr(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	/**
	 * Resolve and fetch details of multiple feed
	 * @param uriList a list of uris of the feeds
	 */
	async getFeedGenerators(
		uriList: string[],
	): LibraryPromise<AppBskyFeedGetFeedGenerators.OutputSchema> {
		try {
			const data = await this.xrpc.app.bsky.feed.getFeedGenerators({
				feeds: uriList,
			});
			return { data: data.data };
		} catch (e) {
			console.log(uriList, e);
			return errorBuilder(e);
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
