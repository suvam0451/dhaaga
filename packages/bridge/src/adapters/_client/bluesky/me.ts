import { MeRoute } from '../_router/routes/me.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import {
	AppBskyActorGetPreferences,
	AppBskyActorGetProfile,
	AtpAgent,
} from '@atproto/api';
import { getBskyAgent, getXrpcAgent } from '../_router/_api.js';
import { AppAtpSessionData } from '../../../types/atproto.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';

export class BlueskyMeRouter implements MeRoute {
	dto: AppAtpSessionData;
	xrpc: AtpAgent;

	constructor(dto: AppAtpSessionData) {
		this.dto = dto;
		this.xrpc = getXrpcAgent(this.dto);
	}

	async getMe(): LibraryPromise<AppBskyActorGetProfile.Response> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.getProfile({ actor: this.dto.did });
		return { data };
	}

	async getPreferences(): LibraryPromise<AppBskyActorGetPreferences.OutputSchema> {
		try {
			const data = await this.xrpc.app.bsky.actor.getPreferences();
			return { data: data.data };
		} catch (e) {
			return errorBuilder(e);
		}
	}
}
