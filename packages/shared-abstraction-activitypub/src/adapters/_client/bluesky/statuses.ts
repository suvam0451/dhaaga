import {
	DhaagaJsPostCreateDto,
	StatusesRoute,
} from '../_router/routes/statuses.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import { getBskyAgent } from '../_router/_api.js';
import {
	AppBskyFeedGetPostThread,
	AtpSessionData,
	ChatBskyConvoGetConvo,
	ChatBskyConvoGetConvoForMembers,
	ChatBskyConvoSendMessage,
} from '@atproto/api';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { MastoStatus } from '../../../types/mastojs.types.js';
import { DhaagaErrorCode } from '../../../types/result.types.js';

class BlueskyStatusesRouter implements StatusesRoute {
	dto: AtpSessionData;
	constructor(dto: AtpSessionData) {
		this.dto = dto;
	}

	bookmark(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/create']['res']> {
		return Promise.resolve(undefined) as any;
	}

	async create(dto: DhaagaJsPostCreateDto): LibraryPromise<{
		uri: string;
		cid: string;
	}> {
		const agent = getBskyAgent(this.dto);
		try {
			const data = await agent.post({
				text: dto.status,
			});
			return { data };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	delete(id: string): LibraryPromise<MastoStatus | { success: true }> {
		return Promise.resolve(undefined) as any;
	}

	async get(id: string): LibraryPromise<AppBskyFeedGetPostThread.Response> {
		const agent = getBskyAgent(this.dto);
		try {
			/**
			 * could not figure out how to resolve
			 * repo/rkey for agent.getPost
			 */
			const data = await agent.getPostThread({
				uri: id,
				depth: 1,
			});
			return { data };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async getContext(
		id: string,
		limit?: number,
	): LibraryPromise<AppBskyFeedGetPostThread.Response> {
		const agent = getBskyAgent(this.dto);
		try {
			const data = await agent.getPostThread({
				uri: id,
				depth: limit || 10,
			});
			return { data };
		} catch (e) {
			console.log('[ERROR]: bluesky', e);
			return errorBuilder();
		}
	}

	like(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/create']['res']> {
		return Promise.resolve(undefined) as any;
	}

	removeLike(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/delete']['res']> {
		return Promise.resolve(undefined) as any;
	}

	unBookmark(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/delete']['res']> {
		return Promise.resolve(undefined) as any;
	}

	async getConvoForMembers(
		members: string[],
	): LibraryPromise<ChatBskyConvoGetConvoForMembers.Response> {
		const agent = getBskyAgent(this.dto);
		try {
			const data = await agent.chat.bsky.convo.getConvoForMembers({
				members,
			});
			return { data };
		} catch (e) {
			console.log('[ERROR]: bluesky', e);
			return errorBuilder();
		}
	}

	async getConvo(id: string): LibraryPromise<ChatBskyConvoGetConvo.Response> {
		const agent = getBskyAgent(this.dto);
		try {
			const data = await agent.chat.bsky.convo.getConvo({
				convoId: id,
			});
			return { data };
		} catch (e) {
			console.log('[ERROR]: bluesky', e);
			return errorBuilder();
		}
	}

	async sendMessage(
		id: string,
		msg: string,
	): LibraryPromise<ChatBskyConvoSendMessage.Response> {
		const agent = getBskyAgent(this.dto);
		try {
			const data = await agent.chat.bsky.convo.sendMessage({
				convoId: id,
				message: { text: msg },
			});
			return { data };
		} catch (e) {
			console.log('[ERROR]: bluesky', e);
			return errorBuilder();
		}
	}
}

export default BlueskyStatusesRouter;
