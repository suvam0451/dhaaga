import { MeRoute } from './_interface.js';
import {
	AppBskyActorGetPreferences,
	AppBskyActorGetProfile,
	AtpAgent,
} from '@atproto/api';
import { AppAtpSessionData } from '#/types/atproto.js';
import { getBskyAgent, getXrpcAgent } from '#/utils/atproto.js';

export class BlueskyMeRouter implements MeRoute {
	dto: AppAtpSessionData;
	xrpc: AtpAgent;

	constructor(dto: AppAtpSessionData) {
		this.dto = dto;
		this.xrpc = getXrpcAgent(this.dto);
	}

	async getMe(): Promise<AppBskyActorGetProfile.OutputSchema> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.getProfile({ actor: this.dto.did });
		return data.data;
	}

	/**
	 * Extras
	 */

	/**
	 * User preferences. For example, what should be the visibility
	 * status under various kinds of filters (e.g. - adult)
	 *
	 * contentLabelPref can be extended (beyond those listed below), btw
	 * It can be determined by labelerDid being present in the response.
	 *
	 * {adult, porn, sexual, suggestive, graphic-media, gore}
	 *
	 * labelersPref - labels that the user has chosen to apply to their posts
	 *
	 * savedFeedsPrefV2 --> list and pinning
	 *

	 */
	async getPreferences(): Promise<AppBskyActorGetPreferences.OutputSchema> {
		const data = await this.xrpc.app.bsky.actor.getPreferences();
		return data.data;
	}

	/**
	 * can get MFA info, basic details and PDS
	 *
	 * NOTE: unused and not tested
	 */
	async getSession() {
		const data = await this.xrpc.com.atproto.server.getSession();
		return data.data;
	}
}
