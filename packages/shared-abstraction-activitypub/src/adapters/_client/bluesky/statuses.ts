import {
	DhaagaJsPostCreateDto,
	StatusesRoute,
} from '../_router/routes/statuses.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { MastoScheduledStatus, MastoStatus, MissNote } from '../_interface.js';
import { Endpoints } from 'misskey-js';
import { getBskyAgent } from '../_router/_api.js';
import { AppBskyFeedGetPostThread, AtpSessionData } from '@atproto/api';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';

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

	create(dto: DhaagaJsPostCreateDto): LibraryPromise<MastoScheduledStatus> {
		return Promise.resolve(undefined) as any;
	}

	delete(id: string): LibraryPromise<MastoStatus | { success: true }> {
		return Promise.resolve(undefined) as any;
	}

	get(id: string): LibraryPromise<MastoStatus | MissNote> {
		return Promise.resolve(undefined) as any;
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
}

export default BlueskyStatusesRouter;
