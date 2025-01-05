import { AtpAgent, AtpSessionData } from '@atproto/api';
import { AppAtpSessionData } from '../../../types/atproto.js';

export function getBskyAgent(dto: AtpSessionData): AtpAgent {
	const agent = new AtpAgent({
		service: 'https://bsky.social',
		persistSession: async (
			evt: string,
			session: AtpSessionData | undefined,
		) => {},
	});

	agent.sessionManager.session = dto;
	return agent;
}

/**
 * Some requests need to be made to the PDS directly
 * @param dto
 */
export function getXrpcAgent(dto: AppAtpSessionData): AtpAgent {
	const agent = new AtpAgent({
		service: `${dto.pdsUrl}/xrpc`,
		persistSession: async (
			evt: string,
			session: AtpSessionData | undefined,
		) => {},
	});

	agent.sessionManager.session = dto;
	return agent;
}

export function getChatAgent(dto: AppAtpSessionData): AtpAgent {
	const agent = new AtpAgent({
		service: dto.pdsUrl,
		persistSession: async (
			evt: string,
			session: AtpSessionData | undefined,
		) => {},
	});

	agent.sessionManager.session = dto;
	return agent;
}
