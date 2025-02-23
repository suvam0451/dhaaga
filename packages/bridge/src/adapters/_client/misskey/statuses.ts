import {
	DhaagaJsPostCreateDto,
	StatusesRoute,
} from '../_router/routes/statuses.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import type { MastoScheduledStatus } from '../../../types/mastojs.types.js';
import type { MissContext, MissNote } from '../../../types/misskey-js.types.js';
import { ApiErrorCode, LibraryResponse } from '../../../types/result.types.js';
import { MisskeyJsWrapper } from '../../../custom-clients/custom-clients.js';
import {
	DriverBookmarkStateResult,
	DriverLikeStateResult,
} from '../../../types/driver.types.js';
import { Err, Ok } from '../../../utils/index.js';

type RenoteCreateDTO = {
	localOnly: boolean;
	renoteId: string;
	visibility: 'followers';
};

export class MisskeyStatusesRouter implements StatusesRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async create(
		dto: DhaagaJsPostCreateDto,
	): LibraryPromise<MastoScheduledStatus> {
		try {
			console.log('dto', {
				// ...dto,
				lang: dto.language,
				visibility: dto.misskeyVisibility,
				replyId: dto.inReplyToId,
				text: dto.status,
				visibleUserIds:
					dto.misskeyVisibility === 'specified'
						? dto.visibleUserIds || []
						: undefined,
				fileIds: dto.mediaIds || [],
				cw: dto.spoilerText || null,
				localOnly: false, // reactionAcceptance: null,
				poll: dto.poll || null,
				scheduledAt: null, // cw: dto.spoilerText || null,
			});

			const data = await this.client.client.request<
				// @ts-ignore-next-line
				Endpoints['notes/create']['req'],
				any
			>('notes/create', {
				// ...dto,
				lang: dto.language,
				visibility: dto.misskeyVisibility,
				replyId: dto.inReplyToId,
				text: dto.status,
				visibleUserIds:
					dto.misskeyVisibility === 'specified'
						? dto.visibleUserIds || []
						: undefined,
				fileIds: dto.mediaIds.length > 0 ? dto.mediaIds || [] : undefined,
				cw: dto.spoilerText || undefined,
				localOnly: false, // reactionAcceptance: null,
				poll: dto.poll || null,
				scheduledAt: null, // cw: dto.spoilerText || null,
			});
			return { data: data as any };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(ApiErrorCode.UNAUTHORIZED);
		}
	}

	async delete(id: string): Promise<{ success: boolean; deleted: boolean }> {
		try {
			// @ts-ignore-next-line
			await this.client.client.request('notes/delete', {
				noteId: id,
			});
			return { success: true, deleted: true };
		} catch (e: any) {
			if (e.code) {
				return { success: false, deleted: false };
			}
			return { success: false, deleted: false };
		}
	}

	async get(id: string): Promise<LibraryResponse<MissNote>> {
		const data = await this.client.client.request('notes/show', { noteId: id });
		return { data };
	}

	async getReactions(
		postId: string,
	): LibraryPromise<Endpoints['notes/reactions']['res']> {
		const data = await this.client.client.request('notes/reactions', {
			noteId: postId,
		});
		return { data };
	}

	async getReactionDetails(
		postId: string,
		reactionId: string,
	): LibraryPromise<any> {
		try {
			const data = await this.client.client.request('notes/reactions', {
				noteId: postId,
				type: reactionId, // limit: 20,
			});
			return { data };
		} catch (e) {
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	/**
	 * @param postId
	 * @param reactionId in full format --> e.g. :ultraigyo@.:
	 */
	async addReaction(
		postId: string,
		reactionId: string,
	): LibraryPromise<{ success: true; reacted: true; id: string }> {
		try {
			await this.client.client.request('notes/reactions/create', {
				noteId: postId,
				reaction: reactionId,
			});
			return { data: { success: true, reacted: true, id: reactionId } };
		} catch (e: any) {
			if (e.code) return errorBuilder(e);
			console.log('[ERROR]: failed to add reaction', reactionId, e);
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async removeReaction(
		postId: string,
		reactionId: string,
	): LibraryPromise<{
		success: false;
		reacted: false;
		id: string;
	}> {
		try {
			await this.client.client.request('notes/reactions/delete', {
				noteId: postId,
				reaction: reactionId,
			});
			return { data: { success: false, reacted: false, id: reactionId } };
		} catch (e: any) {
			if (e.code) return errorBuilder(e);
			console.log('[ERROR]: failed to remove reaction', reactionId, e);
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async getState(id: string): LibraryPromise<Endpoints['notes/state']['res']> {
		try {
			const data = await this.client.client.request('notes/state', {
				noteId: id,
			});
			return { data };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(ApiErrorCode.UNAUTHORIZED);
		}
	}

	async bookmark(id: string): DriverBookmarkStateResult {
		try {
			await this.client.client.request('notes/favorites/create', {
				noteId: id,
			});
			return Ok({ state: true });
		} catch (e: any) {
			if (e.code) {
				// ERR_BAD_REQUEST, ERR_BAD_RESPONSE
				if (e.code === 'ALREADY_FAVORITED') return Ok({ state: true });
				return Err(e.code);
			}
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async unBookmark(id: string): DriverBookmarkStateResult {
		try {
			await this.client.client.request('notes/favorites/delete', {
				noteId: id,
			});
			return Ok({ state: false });
		} catch (e: any) {
			if (e.code) {
				// ERR_BAD_REQUEST, ERR_BAD_RESPONSE
				if (e.code === 'NOT_FAVORITED') return Ok({ state: false });
				return Err(e.code);
			}
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async renotes(id: string): LibraryPromise<Endpoints['notes/renotes']['res']> {
		try {
			const data = await this.client.client.request('notes/renotes', {
				noteId: id,
			});
			return { data };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(ApiErrorCode.UNAUTHORIZED);
		}
	}

	/**
	 * a.k.a. like -- applicable for Sharkey only
	 * @param id
	 */
	async favourite(id: string): LibraryPromise<{
		success: boolean;
		isFavourited: true;
	}> {
		const { error } = await this.direct.post(
			'/api/notes/like',
			{ noteId: id },
			{},
		);
		if (error) return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		return { data: { success: true, isFavourited: true } };
	}

	/**
	 * a.k.a. like -- applicable for Sharkey only
	 * @param id
	 */
	async like(id: string): DriverLikeStateResult {
		const { error } = await this.direct.post(
			'/api/notes/like',
			{ noteId: id },
			{},
		);
		if (error) return Err(ApiErrorCode.REMOTE_SERVER_ERROR);
		return Ok({ state: true });
	}

	async removeLike(id: string): DriverLikeStateResult {
		return Err(ApiErrorCode.OPERATION_UNSUPPORTED);
	}

	/**
	 * Possible to renote multiple times
	 * @param dto
	 */
	async renote(dto: RenoteCreateDTO): LibraryPromise<{
		success: true;
		renoted: true;
		post: Endpoints['notes/create']['res'];
	}> {
		try {
			const data = await this.client.client.request('notes/create', dto);
			return {
				data: {
					success: true,
					renoted: true,
					post: data,
				},
			};
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(ApiErrorCode.UNAUTHORIZED);
		}
	}

	async unrenote(id: string): LibraryPromise<{
		success: true;
		renoted: false;
	}> {
		try {
			await this.client.client.request('notes/unrenote', {
				noteId: id,
			});
			return { data: { success: true, renoted: false } };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(ApiErrorCode.UNAUTHORIZED);
		}
	}

	async getContext(id: string, limit?: number): LibraryPromise<MissContext> {
		try {
			const parents = this.client.client.request('notes/conversation', {
				noteId: id,
				limit: limit || 40,
			});
			const children = this.client.client.request('notes/children', {
				noteId: id,
				showQuotes: false,
				limit: limit || 40,
			});

			return new Promise((resolve, reject) => {
				Promise.all([parents, children])
					.then(([_parents, _children]) => {
						resolve({
							data: {
								ancestors: _parents,
								descendants: _children,
							},
						});
					})
					.catch((e) => {
						return resolve({ data: { ancestors: [], descendants: [] } });
					});
			});
		} catch (e) {
			console.log(e);
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}
}
