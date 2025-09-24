import {
	DhaagaJsPostCreateDto,
	StatusesRoute,
} from '../_router/routes/statuses.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import {
	AppBskyFeedGetPostThread,
	AtpSessionData,
	ChatBskyConvoGetConvo,
	ChatBskyConvoGetConvoForMembers,
	ChatBskyConvoSendMessage,
} from '@atproto/api';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { ApiErrorCode } from '../../../types/result.types.js';
import { Err, Ok } from '../../../utils/index.js';
import {
	DriverBookmarkStateResult,
	DriverLikeStateResult,
} from '../../../types/driver.types.js';
import { getBskyAgent } from '../../../utils/atproto.js';

class BlueskyStatusesRouter implements StatusesRoute {
	dto: AtpSessionData;

	constructor(dto: AtpSessionData) {
		this.dto = dto;
	}

	bookmark(id: string): DriverBookmarkStateResult {
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
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async delete(id: string): Promise<{ success: boolean; deleted: boolean }> {
		const agent = getBskyAgent(this.dto);
		try {
			await agent.deletePost(id);
			return { success: true, deleted: true };
		} catch (e) {
			return { success: false, deleted: false };
		}
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
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
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

	async like(uri: string, cid?: string): DriverLikeStateResult {
		if (!cid) return Err(ApiErrorCode.INVALID_INPUT);
		const agent = getBskyAgent(this.dto);
		try {
			const result = await agent.like(uri, cid);
			return Ok({ state: true, uri: result.uri });
		} catch (e) {
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async removeLike(uri: string, cid?: string): DriverLikeStateResult {
		if (!cid) return Err(ApiErrorCode.INVALID_INPUT);
		const agent = getBskyAgent(this.dto);
		try {
			await agent.deleteLike(uri);
			return Ok({ state: false });
		} catch (e) {
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	unBookmark(id: string): DriverBookmarkStateResult {
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

	/**
	 * AT protocol specific implementation
	 * @param uri
	 * @param cid
	 */
	async atProtoLike(uri: string, cid: string): DriverLikeStateResult {
		const agent = getBskyAgent(this.dto);
		try {
			const result = await agent.like(uri, cid);
			return Ok({ state: true, uri: result.uri });
		} catch (e) {
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async atProtoDeleteLike(uri: string): DriverLikeStateResult {
		const agent = getBskyAgent(this.dto);
		try {
			await agent.deleteLike(uri);
			return Ok({ state: false });
		} catch (e) {
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async atProtoRepost(
		uri: string,
		cid: string,
	): Promise<{ success: boolean; liked?: boolean; uri?: string }> {
		try {
			const agent = getBskyAgent(this.dto);
			const result = await agent.repost(uri, cid);
			return { success: true, liked: true, uri: result.uri };
		} catch (e) {
			console.log(e);
			return { success: false };
		}
	}

	async atProtoDeleteRepost(uri: string) {
		const agent = getBskyAgent(this.dto);
		try {
			await agent.deleteRepost(uri);
			return { success: true, liked: false };
		} catch (e) {
			console.log(e);
			return { success: false };
		}
	}
}

export default BlueskyStatusesRouter;
