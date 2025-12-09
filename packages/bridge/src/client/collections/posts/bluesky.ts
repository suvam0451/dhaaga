import { DhaagaJsPostCreateDto, StatusesRoute } from './_interface.js';
import {
	AppBskyActorDefs,
	AppBskyFeedDefs,
	AppBskyFeedGetPostThread,
	AtpSessionData,
	ChatBskyConvoGetConvo,
	ChatBskyConvoGetConvoForMembers,
	ChatBskyConvoSendMessage,
} from '@atproto/api';
import {
	DriverBookmarkStateResult,
	DriverLikeStateResult,
} from '#/types/driver.types.js';
import { getBskyAgent, getXrpcAgent } from '#/utils/atproto.js';
import { PaginatedPromise } from '#/types/api-response.js';

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

	async getPosts(ids: string[]): Promise<AppBskyFeedDefs.PostView[]> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.getPosts({
			uris: ids,
		});
		return data.data.posts;
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
	): Promise<ChatBskyConvoGetConvoForMembers.Response> {
		const agent = getBskyAgent(this.dto);
		return await agent.chat.bsky.convo.getConvoForMembers({
			members,
		});
	}

	async getConvo(id: string): Promise<ChatBskyConvoGetConvo.Response> {
		const agent = getBskyAgent(this.dto);
		return await agent.chat.bsky.convo.getConvo({
			convoId: id,
		});
	}

	async sendMessage(
		id: string,
		msg: string,
	): Promise<ChatBskyConvoSendMessage.Response> {
		const agent = getBskyAgent(this.dto);
		return agent.chat.bsky.convo.sendMessage({
			convoId: id,
			message: { text: msg },
		});
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

	async getLikedBy(
		id: string,
		limit?: number,
		maxId?: string,
	): PaginatedPromise<AppBskyActorDefs.ProfileView[]> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.getLikes({
			uri: id,
			cursor: maxId === null ? undefined : maxId,
			limit,
		});
		return {
			data: data.data.likes.map((o) => o.actor),
			maxId: data.data.cursor,
		};
	}

	async getSharedBy(
		id: string,
		limit?: number,
		maxId?: string,
	): PaginatedPromise<AppBskyActorDefs.ProfileView[]> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.getRepostedBy({
			uri: id,
			cursor: maxId === null ? undefined : maxId,
			limit,
		});
		return {
			data: data.data.repostedBy,
			maxId: data.data.cursor,
		};
	}

	async getQuotedBy(
		id: string,
		limit?: number,
		maxId?: string,
	): PaginatedPromise<AppBskyFeedDefs.PostView[]> {
		const agent = getXrpcAgent(this.dto);
		const data = await agent.app.bsky.feed.getQuotes({
			uri: id,
			cursor: maxId === null ? undefined : maxId,
			limit,
		});
		return {
			data: data.data.posts,
			maxId: data.data.cursor,
		};
	}
}

export default BlueskyStatusesRouter;
