import { MeRoute } from '../_router/routes/me.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { AppBskyActorGetProfile, AtpSessionData } from '@atproto/api';
import { getBskyAgent } from '../_router/_api.js';

export class BlueskyMeRouter implements MeRoute {
	dto: AtpSessionData;
	constructor(dto: AtpSessionData) {
		this.dto = dto;
	}

	async getMe(): LibraryPromise<AppBskyActorGetProfile.Response> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.getProfile({ actor: this.dto.did });
		return { data };
	}
}
