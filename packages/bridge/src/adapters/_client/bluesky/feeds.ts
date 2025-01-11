import { getXrpcAgent } from '../_router/_api.js';
import { AppAtpSessionData } from '../../../types/atproto.js';
import { SavedFeedsPrefV2 } from '@atproto/api/dist/client/types/app/bsky/actor/defs.js';
import { RandomUtil } from '../../../utiils/random.util.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import {
	AppBskyActorDefs,
	AppBskyActorGetPreferences,
	AtpAgent,
} from '@atproto/api';

type SubscriptionUpdateResult = Promise<{
	success: boolean;
	subscribed: boolean;
}>;

type LikeStatusUpdateResult = Promise<{
	success: boolean;
	liked: boolean;
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
