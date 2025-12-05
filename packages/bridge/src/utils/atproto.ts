import { AtpAgent, AtpSessionData } from '@atproto/api';
import { AtprotoApiAdapter } from '../client/index.js';
import { ApiAsyncResult } from './api-result.js';
import { Err, Ok } from './result.js';
import { ApiErrorCode } from '../types/result.types.js';
import { AppAtpSessionData } from '../types/atproto.js';

class Util {
	static async generateFeedUrl(
		client: AtprotoApiAdapter,
		uri: string,
	): ApiAsyncResult<string> {
		const feed = await client.timelines.getFeedGenerator(uri);
		if (feed.error || feed.data === null)
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		if (!feed.data.isValid) return Err('[E_Feed_Invalid]');
		if (!feed.data.isOnline) return Err('[E_Feed_Offline]');

		const regex = /([^/]+)$/;
		if (regex.test(feed.data.view.uri)) {
			const feedUrl = feed.data.view.uri.match(regex)![1];
			const handle = feed.data.view.creator.handle;

			return Ok(`https://bsky.app/profile/${handle}/feed/${feedUrl}`);
		}
		return Err('[E_Feed_Has_Invalid_Regex]');
	}
}

function getBskyAgent(dto: AtpSessionData): AtpAgent {
	const agent = new AtpAgent({
		service: 'https://bsky.social',
	});

	agent.sessionManager.session = dto;
	return agent;
}

/**
 * Some requests need to be made to the PDS directly
 * @param dto
 */
function getXrpcAgent(dto: AppAtpSessionData): AtpAgent {
	const agent = new AtpAgent({
		service: `${dto.pdsUrl}/xrpc`,
	});

	agent.sessionManager.session = dto;
	return agent;
}

function getChatAgent(dto: AppAtpSessionData): AtpAgent {
	const agent = new AtpAgent({
		service: dto.pdsUrl,
	});

	agent.sessionManager.session = dto;
	return agent;
}

export { Util as AtprotoUtils, getBskyAgent, getXrpcAgent, getChatAgent };
