import { DhaagaJsPostCreateDto, StatusesRoute } from './_interface.js';
import { LibraryPromise } from '#/adapters/_client/_router/routes/_types.js';
import {
	AppBskyFeedGetPostThread,
	AtpSessionData,
	ChatBskyConvoGetConvo,
	ChatBskyConvoGetConvoForMembers,
	ChatBskyConvoSendMessage,
} from '@atproto/api';
import { errorBuilder } from '#/adapters/_client/_router/dto/api-responses.dto.js';
import {
	DriverBookmarkStateResult,
	DriverLikeStateResult,
} from '#/types/driver.types.js';
import { getBskyAgent } from '#/utils/atproto.js';

class BlueskyStatusesRouter implements StatusesRoute {
	dto: AtpSessionData;

	constructor(dto: AtpSessionData) {
		this.dto = dto;
	}

	bookmark(id: string): DriverBookmarkStateResult {
		return Promise.resolve(undefined) as any;
	}

	async create(dto: DhaagaJsPostCreateDto): Promise<{
		uri: string;
		cid: string;
	}> {
		const agent = getBskyAgent(this.dto);
		return agent.post({
			text: dto.status,
		});
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

	async getPost(id: string): Promise<AppBskyFeedGetPostThread.Response> {
		const agent = getBskyAgent(this.dto);
		/**
		 * could not figure out how to resolve
		 * repo/rkey for agent.getPost
		 */
		return agent.getPostThread({
			uri: id,
			depth: 1,
		});
	}

	async getPostContext(
		id: string,
		limit?: number,
	): Promise<AppBskyFeedGetPostThread.Response> {
		const agent = getBskyAgent(this.dto);
		return agent.getPostThread({
			uri: id,
			depth: limit || 10,
		});
	}

	async like(uri: string, cid?: string): DriverLikeStateResult {
		if (!cid) throw new Error('invalid input. missing cid');
		const agent = getBskyAgent(this.dto);
		const result = await agent.like(uri, cid);
		return { state: true, uri: result.uri };
	}

	async removeLike(uri: string, cid?: string): DriverLikeStateResult {
		if (!cid) throw new Error('invalid input. missing cid');
		const agent = getBskyAgent(this.dto);
		await agent.deleteLike(uri);
		return { state: false };
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
		const result = await agent.like(uri, cid);
		return { state: true, uri: result.uri };
	}

	async atProtoDeleteLike(uri: string): DriverLikeStateResult {
		const agent = getBskyAgent(this.dto);
		await agent.deleteLike(uri);
		return { state: false };
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
