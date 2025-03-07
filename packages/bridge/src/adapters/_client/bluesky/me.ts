import { MeRoute } from '../_router/routes/me.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import {
	AppBskyActorGetPreferences,
	AppBskyActorGetProfile,
	AtpAgent,
} from '@atproto/api';
import { getBskyAgent, getXrpcAgent } from '../_router/_api.js';
import { AppAtpSessionData } from '../../../types/atproto.js';
import { ApiAsyncResult } from '../../../utils/api-result.js';
import { Err, Ok } from '../../../utils/index.js';
import { ApiErrorCode } from '../../../types/result.types.js';

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

	async getPreferences(): ApiAsyncResult<AppBskyActorGetPreferences.OutputSchema> {
		try {
			const data = await this.xrpc.app.bsky.actor.getPreferences();
			if (!data.success) return Err(ApiErrorCode.REMOTE_SERVER_ERROR);
			return Ok(data.data);
		} catch (e) {
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}
}
